from uuid import uuid4

from django.http import FileResponse
from django.utils import timezone
from rest_framework import status
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from .models import File
from .permissions import IsAdminOrIsOwner
from .serializers import FileSerializer
from users.models import User


class FileViewSet(ModelViewSet):
    queryset = File.objects.all()
    serializer_class = FileSerializer

    def get_permissions(self):
        if self.action in ['partial_update', 'destroy', 'download', 'link']:
            return [IsAuthenticated(), IsAdminOrIsOwner()]
        if self.action in ['list', 'create']:
            return[IsAuthenticated()]
        return [AllowAny()]

    def list(self, request, storage_path, *args, **kwargs):
        if request.user.is_admin:
            user = get_object_or_404(User, storage_path=storage_path)
            user_files = user.files
        else:
            user_files = request.user.files

        serializer = self.serializer_class(user_files, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def partial_update(self, request, pk=None, *args, **kwargs):
        file_instance = get_object_or_404(self.queryset, pk=pk)
        self.check_object_permissions(request, file_instance)
        serializer = self.serializer_class(file_instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, pk=None, *args, **kwargs):
        file_instance = get_object_or_404(self.queryset, pk=pk)
        self.check_object_permissions(request, file_instance)
        file_instance.delete()
        return Response({'message': 'Файл успешно удален.'}, status=status.HTTP_204_NO_CONTENT)

    def download(self, request, pk=None):
        file_instance = get_object_or_404(self.queryset, pk=pk)
        self.check_object_permissions(request, file_instance)
        file_instance.downloaded_at = timezone.now()
        file_instance.save()
        return FileResponse(open(file_instance.file.path, 'rb'), as_attachment=True)

    def link(self, request, pk=None):
        file_instance = get_object_or_404(self.queryset, pk=pk)
        self.check_object_permissions(request, file_instance)
        special_link = file_instance.special_link
        if not special_link:
            unique_code = uuid4().hex
            special_link = request.build_absolute_uri(f'/api/files/share/{unique_code}')
            file_instance.special_link = special_link
            file_instance.save()
        return Response({'special_link': special_link}, status=status.HTTP_200_OK)

    def share(self, request, unique_code=None):
        special_link = request.build_absolute_uri(f'/api/files/share/{unique_code}')
        file_instance = get_object_or_404(self.queryset, special_link=special_link)
        file_instance.downloaded_at = timezone.now()
        file_instance.save()
        return FileResponse(open(file_instance.file.path, 'rb'), as_attachment=True)
