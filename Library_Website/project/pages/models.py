from django.db import models

# Create your models here.


class Book(models.Model):
    x = [
        ('Historical','Historical'),('Fantasy','Fantasy'),('Science Fiction','Science Fiction'),
         ('Personal Development','Personal Development'), ('Cookbooks','Cookbooks'), ('Romance','Romance'),
         ('Story','Story'),('Biography','Biography')
        ]
    name = models.CharField(max_length=50)
    category = models.CharField(max_length=50,choices=x)
    author = models.CharField(max_length=50)
    image = models.ImageField(upload_to='photos')
    details = models.TextField()
    def __str__(self):
        return self.name
    
class User(models.Model):
    name = models.CharField(max_length=50)
    borrowed_books = models.ManyToManyField(Book, related_name='borrowers', blank=True)
