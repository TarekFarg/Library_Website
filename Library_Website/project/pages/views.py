from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Book, User

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
    fullname_received = request.POST.get('fullname')
    username_received = request.POST.get('username')
    email_received = request.POST.get('email')
    password_received = request.POST.get('password')

    print(fullname_received + '\n')
    print(username_received + '\n')
    print(email_received + '\n')
    print(password_received + '\n')
    #name database attributes as this names
    data = User(name=username_received, email=email_received, password=password_received, fullname=fullname_received)
    data.save()
    return render(request,'pages/Signup.html')


def Template_Category (request):
    return render(request,'pages/Template_Category.html')


def Not_Available (request):
    return render(request,'pages/Not_Available.html')


def confirm (request):
    return render(request,'pages/confirm.html')


def Borrow_book (request):
    return render(request,'pages/Borrow_book.html')



