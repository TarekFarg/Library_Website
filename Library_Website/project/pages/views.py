from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Book

def index(request):
    books = Book.objects.all()
    return render(request, 'pages/index.html', {'books': books})

def Template_book(request, title):
    book = get_object_or_404(Book, name=title)
    return render(request, 'pages/Template_book.html', {'book': book})



def categories (request):
    return render(request,'pages/categories.html')


def Login (request):
    return render(request,'pages/Login.html')


def Signup (request):
    return render(request,'pages/Signup.html')

def Template_Category (request):
    return render(request,'pages/Template_Category.html')


def Not_Available (request):
    return render(request,'pages/Not_Available.html')


def confirm (request):
    return render(request,'pages/confirm.html')


def Borrow_book (request):
    return render(request,'pages/Borrow_book.html')



