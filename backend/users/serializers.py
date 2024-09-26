from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from rest_framework.exceptions import ValidationError

from files.models import File
from .models import User


class UserFilesSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ['size']


class AdminSerializer(serializers.ModelSerializer):
    files = UserFilesSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'storage_path', 'is_admin', 'files']
        read_only_fields = ['storage_path']


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'full_name', 'email', 'password', 'storage_path', 'is_admin']
        read_only_fields = ['storage_path']
        extra_kwargs = {'password': {'write_only': True}}

    def validate_username(self, value):
        if User.objects.filter(username=value.lower()).exists():
            raise ValidationError('Пользователь с таким Логин уже существует.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value.lower()).exists():
            raise ValidationError('Пользователь с таким Email уже существует.')
        return value

    def create(self, validated_data):
        validated_data['username'] = validated_data['username'].lower()
        validated_data['email'] = validated_data['email'].lower()
        validated_data['password'] = make_password(validated_data['password'])
        if 'is_admin' in validated_data:
            validated_data.pop('is_admin')
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request_user = self.context['request'].user
        if 'username' in validated_data and not request_user.is_admin:
            validated_data.pop('username')
        if 'password' in validated_data:
            validated_data['password'] = make_password(validated_data['password'])
        if 'is_admin' in validated_data:
            if not request_user.is_admin or request_user.id == instance.id:
                validated_data.pop('is_admin')
        return super().update(instance, validated_data)
