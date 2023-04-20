"""Kernel execution info methods"""
from .messaging import InfoMessaging, InfoRequestDto, InfoResponseDto


class Info:  # pylint: disable=too-few-public-methods
    """Controller that manages the kernel execution info"""

    INFO_TYPE = {
        "info": "tasks_info",
        "status": "tasks_status",
        "current_graph": "current_task_graph",
        "complete_graph": "complete_task_graph",
        "resources": "resources_status",
        "statistics": "statistics",
    }

    @classmethod
    def _handle_request(cls, info_type: str) -> InfoResponseDto:
        function_name = cls.INFO_TYPE[info_type]
        title = f"'{function_name.replace('_', ' ').capitalize()}'"
        return {
            "code": f"""
                %matplotlib inline
                import pycompss.interactive as ipycompss
                from ipycompss_kernel import OuterInfo

                with OuterInfo(title={title}, type={info_type}):
                    ipycompss.{function_name}()
                
                del ipycompss, OuterInfo
            """
        }

    @classmethod
    def _callback(cls, request: InfoRequestDto) -> InfoResponseDto:
        return cls._handle_request(request["type"])

    def start(self) -> None:
        """Register info callback"""

        InfoMessaging.on_info(self._callback)
