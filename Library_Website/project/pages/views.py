from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from .models import Book, User
from django.db.models import Q

def check_attribute_exists(request):
    email_to_check = request.POST.get('email')  # Assuming username is the attribute

    # Check if a user exists with the given username
    user_exists = User.objects.filter(email=email_to_check).exists()

    if user_exists:
        return True
        # return render(request, 'pages/Signup.html', {'message': 'Username already exists'})
    else:
        # Create the user or perform other actions
        return False
        # return render(request, 'pages/Signup.html', {'message': 'Username available'})


def index(request):
    return render(request, 'pages/index.html')
def index_books(request):
    query = request.GET.get('q')
    if query:
        books = Book.objects.filter(
            Q(name__icontains=query) | 
            Q(category__icontains=query) | 
            Q(author__icontains=query)
        )
    else:
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
    if request.method == 'POST':
        fullname_received = request.POST.get('fullname')
        username_received = request.POST.get('username')
        email_received = request.POST.get('email')
        password_received = request.POST.get('password')

        # name database attributes as this names "comment"
        data = User(name=username_received, password=password_received, email=email_received, fullname=fullname_received)
        if check_attribute_exists(request):
            return render(request, 'pages/Signup.html', {'message': 'Email already exists'})
        data.save()
        return render(request,'pages/Signup.html', {'message_success': 'Account created successfuly'})
    else:
        return render(request,'pages/Signup.html')



def Template_Category (request):
    return render(request,'pages/Template_Category.html')


def Not_Available (request):
    return render(request,'pages/Not_Available.html')


def confirm (request):
    return render(request,'pages/confirm.html')


def Borrow_book (request):
    return render(request,'pages/Borrow_book.html')


# Admin
def admin_home(request):
    return render(request ,'pages/admin/admin_home.html')

def admin_users(request):
    return render(request ,'pages/admin/admin_users.html')


def admin_books(request):
    if request.method == 'POST':
        name = request.POST['name']
        category = request.POST['category']
        author = request.POST['author']
        image = request.FILES['image']
        details = request.POST['details']
        
        new_book = Book(name=name, category=category, author=author, image=image, details=details)
        new_book.save()
        
        return redirect('admin_books')
    
    books = Book.objects.all()
    return render(request, 'pages/admin/admin_books.html', {'books': books})

def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return redirect('admin_books')


def admin_login(request):
    return render(request ,'pages/admin/admin_login.html')



