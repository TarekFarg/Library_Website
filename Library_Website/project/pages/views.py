from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.

def index (request):
    return render(request,'pages/index.html')

def categories (request):
    return render(request,'pages/categories.html')


def Login (request):
    return render(request,'pages/Login.html')


def Signup (request):
    return render(request,'pages/Signup.html')


def Template_book (request):
    return render(request,'pages/Template_book.html')


def Template_Category (request):
    return render(request,'pages/Template_Category.html')


def Not_Available (request):
    return render(request,'pages/Not_Available.html')


def confirm (request):
    return render(request,'pages/confirm.html')


def Borrow_book (request):
    return render(request,'pages/Borrow_book.html')



