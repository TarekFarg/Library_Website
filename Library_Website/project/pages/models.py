from django.db import models

# Create your models here.


class Book(models.Model):

    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50)
    author = models.CharField(max_length=50)
    image = models.ImageField(upload_to='photos')
    details = models.TextField()
    def __str__(self):
        return self.name
    


class User(models.Model):
    name = models.CharField(max_length=100)
    borrowed_books = models.ManyToManyField(Book, related_name='borrowers', blank=True)
    email = models.EmailField(max_length=254, unique=True, null=False)
    password = models.CharField(max_length=255, unique=False, null = False)
    fullname = models.CharField(max_length=255, unique=False, null = False)
    def __str__(self):
        return self.name

class Admin(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField(max_length=250,unique=True , null = False)
    password = models.CharField(max_length=250,unique=False ,null=False) 
    def __str__(self):
        return self.name



