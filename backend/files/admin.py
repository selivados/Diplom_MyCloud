from django.contrib import admin

from .models import File


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'file_name', 'comment', 'size',
                    'uploaded_at', 'downloaded_at', 'file_path', 'special_link']
    readonly_fields = ['size', 'uploaded_at', 'downloaded_at', 'file_path', 'special_link']
    list_filter = ['user']
    search_fields = ['user__username', 'file_name']
