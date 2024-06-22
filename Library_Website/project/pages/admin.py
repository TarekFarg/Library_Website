from django.contrib import admin
from .models import Book,New_User,Admin
# Register your models here.
admin.site.register(Book)
admin.site.register(New_User)
admin.site.register(Admin)
