import os
import shutil

from django.conf import settings
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models.signals import pre_delete
from django.dispatch import receiver


class User(AbstractUser):
    username = models.CharField(max_length=255, unique=True, verbose_name='Логин')
    full_name = models.CharField(max_length=255, verbose_name='Полное имя')
    email = models.CharField(max_length=254, unique=True, verbose_name='Email')
    storage_path = models.CharField(blank=True, default='', max_length=255,
                                    verbose_name='Путь к хранилищу пользователя')
    is_admin = models.BooleanField(default=False, verbose_name='Статус администратора')

    def save(self, *args, **kwargs):
        self.storage_path = self.username
        self.is_staff = self.is_admin
        self.is_superuser = self.is_admin
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'
        ordering = ['username']


@receiver(pre_delete, sender=User)
def auto_delete_user_storage(sender, instance, **kwargs):
    if instance.storage_path:
        full_storage_path = os.path.join(settings.MEDIA_ROOT, instance.storage_path)
        if os.path.isdir(full_storage_path):
            shutil.rmtree(full_storage_path)
