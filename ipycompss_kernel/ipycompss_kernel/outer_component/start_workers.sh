#!/usr/bin/env sh

HOST_LIST=$(scontrol show hostname ${SLURM_JOB_NODELIST} | awk {' print $1 '} | sed -e 's/\.[^\ ]*//g')
export COMPSS_MASTER_NODE=$(hostname)
export COMPSS_WORKER_NODES=$(echo ${HOST_LIST} | sed -e "s/${COMPSS_MASTER_NODE}//g")
WORK_DIRECTORY=$(echo $@|sed -n 's/.*--master-working-dir=\([^ ]*\).*/\1/p')
if [ "${WORK_DIRECTORY}" == '' ]; then
  WORK_DIRECTORY=${HOME}
  set -- "$@ --master-working-dir=${WORK_DIRECTORY}"
fi

ORIGINAL_ENV_PATH=${WORK_DIRECTORY}/original.env
env|sort > ${ORIGINAL_ENV_PATH}

# launch_compss will store the updated environment in $UPDATED_ENV_PATH
export UPDATED_ENV_PATH=${WORK_DIRECTORY}/updated.env
${COMPSS_HOME}/Runtime/scripts/user/launch_compss --master_node="${COMPSS_MASTER_NODE}" --worker_nodes="${COMPSS_WORKER_NODES}" --node_memory=disabled --node_storage_bandwidth=450 --wall_clock_limit=540 --sc_cfg=default.cfg --jupyter_notebook=jupyterhub --lang=python --worker_working_dir=${WORK_DIRECTORY} --pythonpath=${PYTHONPATH}:${HOME} --keep_workingdir $@ > /dev/null

# Now we filter the environments (updated - original) to find the variables that launch_compss defined
REQUIRED_ENV_PATH=${WORK_DIRECTORY}/TO_BE_SOURCED.vars
sort ${UPDATED_ENV_PATH} | diff -u ${ORIGINAL_ENV_PATH} - | sed -n '/^+[^+]/ s/^+//p' | sed '/SHLVL\|UPDATED_ENV_PATH/d' > ${REQUIRED_ENV_PATH}
echo "COMPSS_MASTER_NODE=$COMPSS_MASTER_NODE
COMPSS_WORKER_NODES=$COMPSS_WORKER_NODES" >> ${REQUIRED_ENV_PATH}

cat ${REQUIRED_ENV_PATH}
rm ${ORIGINAL_ENV_PATH} ${UPDATED_ENV_PATH} ${REQUIRED_ENV_PATH}