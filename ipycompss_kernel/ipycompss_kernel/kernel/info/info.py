"""Kernel execution info methods"""
from .messaging import InfoMessaging, InfoResponseDto


class Info:
    """Controller that manages the kernel execution info"""

    @staticmethod
    def _handle_info_request() -> InfoResponseDto:
        return {
            "code": """
                import pycompss.interactive as ipycompss
                from ipycompss_kernel import OuterInfo

                with OuterInfo():
                    print('Task status')
                    ipycompss.tasks_status()
                    print('Task info')
                    ipycompss.tasks_info()
                
                del ipycompss, OuterInfo
            """
        }

    def start(self) -> None:
        """Register info callbacks"""
        InfoMessaging.on_info(self._handle_info_request)
