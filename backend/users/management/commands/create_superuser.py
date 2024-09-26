import os

from django.core.management import BaseCommand

from users.models import User


class Command(BaseCommand):
    help = 'Create a superuser if not exists'

    def handle(self, *args, **options):
        username = os.getenv('ADMIN_USERNAME')
        full_name = os.getenv('ADMIN_FULLNAME')
        email = os.getenv('ADMIN_EMAIL')
        password = os.getenv('ADMIN_PASSWORD')
        is_admin = True

        if User.objects.filter(username=username).exists():
            self.stdout.write(self.style.WARNING(f'Superuser "{username}" already exists.'))
        else:
            User.objects.create_superuser(
                username=username,
                full_name=full_name,
                email=email,
                password=password,
                is_admin=is_admin,
            )
            self.stdout.write(self.style.SUCCESS(f'Superuser "{username}" created successfully.'))
