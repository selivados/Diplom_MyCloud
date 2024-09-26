from django.urls import path

from .views import FileViewSet

urlpatterns = [
    path('files/list/<storage_path>/', FileViewSet.as_view({'get': 'list'})),
    path('files/file/', FileViewSet.as_view({'post': 'create'})),
    path('files/file/<pk>/', FileViewSet.as_view({'patch': 'partial_update', 'delete': 'destroy'})),
    path('files/file/<pk>/download/', FileViewSet.as_view({'get': 'download'})),
    path('files/file/<pk>/link/', FileViewSet.as_view({'get': 'link'})),
    path('files/share/<unique_code>/', FileViewSet.as_view({'get': 'share'})),
]
