from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Book

def index(request):
    return render(request, 'pages/index.html')

def index_books(request):
    books = Book.objects.all()
    data = {'books': []}
    for book in books:
        data['books'].append({
            'name': book.name,
            'image': book.image.url,
        })
    return JsonResponse(data)

def Template_book(request, title):
    return render(request, 'pages/Template_book.html', {'title': title})

def Template_book_details(request, title):
    book = get_object_or_404(Book, name=title)
    data = {
        'book': {
            'name': book.name,
            'image': book.image.url,
            'category': book.category,
            'author': book.author,
            'details': book.details
        }
    }
    return JsonResponse(data)



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



