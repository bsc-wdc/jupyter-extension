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

    @staticmethod
    def _handle_request(function_name: str) -> InfoResponseDto:
        return {
            "code": f"""
                import pycompss.interactive as ipycompss
                from ipycompss_kernel import OuterInfo

                with OuterInfo():
                    ipycompss.{function_name}()
                
                del ipycompss, OuterInfo
            """
        }

    @classmethod
    def _callback(cls, request: InfoRequestDto) -> InfoResponseDto:
        return cls._handle_request(cls.INFO_TYPE[request["type"]])

    def start(self) -> None:
        """Register info callback"""

        InfoMessaging.on_info(self._callback)
