# Generated by Django 5.0.6 on 2024-06-22 18:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('pages', '0017_admin_alter_user_name'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='User',
            new_name='New_User',
        ),
    ]