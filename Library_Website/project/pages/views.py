from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpResponse, JsonResponse
from .models import Book, New_User, Admin
from django.db.models import Q
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.auth import logout




def admin_users(request):
    users = New_User.objects.all()
    return render(request, 'pages/Admin/admin_users.html', {'users': users})

def delete_user(request, user_id):
    user = get_object_or_404(New_User, id=user_id)
    user.delete()
    return redirect('admin_users')

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


def categories(request):
    categories = Book.objects.values_list('category', flat=True).distinct()
    return render(request, 'pages/categories.html', {'categories': categories})


def category_detail(request, category_name):
    books = Book.objects.filter(category=category_name)
    return render(request, 'pages/Template_Category.html', {'category': category_name, 'books': books})


def Template_Category (request):
    return render(request,'pages/Template_Category.html')


def check_attribute_exists(request):
    email_to_check = request.POST.get('email')

    # Check if a user exists with the given email
    user_exists = New_User.objects.filter(email=email_to_check).exists()

    if user_exists:
        return True
    else:
        return False

def check_attribute_exists(request):
    email_received = request.POST.get('email')
    return New_User.objects.filter(email=email_received).exists()

def Signup(request):
    if request.method == 'POST':
        fullname_received = request.POST.get('fullname')
        username_received = request.POST.get('username')
        email_received = request.POST.get('email')
        password_received = request.POST.get('password')

        if check_attribute_exists(request):
            return render(request, 'pages/Signup.html', {'message': 'Email already exists'})

        new_user = New_User(fullname=fullname_received, name=username_received, email=email_received, password=password_received)
        new_user.save()

        # Create session
        request.session['user_id'] = new_user.id
        request.session['username'] = new_user.name
        request.session['is_authenticated'] = True

        return redirect('index')  # Redirect to the index page or any other page after signup
    return render(request, 'pages/Signup.html')
        
def Login(request):
    if request.method == 'POST':
        email_received = request.POST.get('email')
        password_received = request.POST.get('password')

        if check_attribute_exists(request):
            user_ex = New_User.objects.get(email=email_received)
            if user_ex.password == password_received:
                # Create session
                request.session['user_id'] = user_ex.id
                request.session['username'] = user_ex.name
                request.session['is_authenticated'] = True

                return redirect('index')  # Redirect to the index page or any other page after login
            else:
                return render(request, 'pages/Login.html', {'message': 'Invalid Email or Password'})
        else:
            return render(request, 'pages/Login.html', {'message': 'Invalid Email or Password'})

    return render(request, 'pages/Login.html')

def Logout(request):
    request.session.flush()  # Clear all session data
    return redirect('index')  # Redirect to the index page


def Not_Available (request):
    return render(request,'pages/Not_Available.html')


def confirm (request):
    return render(request,'pages/confirm.html')


def Borrow_book (request):
    return render(request,'pages/Borrow_book.html')


# Admin
def admin_home(request):
    return render(request ,'pages/Admin/admin_home.html')




# def admin_books(request):
#     if request.method == 'POST':
#         name = request.POST['name']
#         category = request.POST['category']
#         author = request.POST['author']
#         image = request.FILES['image']
#         details = request.POST['details']
        
#         new_book = Book(name=name, category=category, author=author, image=image, details=details)
#         new_book.save()
        
#         return redirect('admin_books')
    
#     books = Book.objects.all()
#     return render(request, 'pages/admin/admin_books.html', {'books': books})


def admin_books(request):
    if request.method == 'POST' and 'edit_book_id' not in request.POST:
        # adding a new book
        name = request.POST['name']
        category = request.POST['category']
        author = request.POST['author']
        image = request.FILES['image']
        details = request.POST['details']

        new_book = Book(name=name, category=category, author=author, image=image, details=details)
        new_book.save()

        return redirect('admin_books')

    books = Book.objects.all()
    form_book_id = request.GET.get('edit', None)
    book_to_edit = None

    if form_book_id:
        book_to_edit = get_object_or_404(Book, id=form_book_id)

    return render(request, 'pages/Admin/admin_books.html', {
        'books': books,
        'form_book_id': form_book_id,
        'book_to_edit': book_to_edit
    })

def delete_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)
    book.delete()
    return redirect('admin_books')

def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if request.method == 'POST':
        book.name = request.POST['name']
        book.category = request.POST['category']
        book.author = request.POST['author']
        book.details = request.POST['details']

        if 'image' in request.FILES:
            book.image = request.FILES['image']

        book.save()
        return redirect('admin_books')
    
#Admin views


def check_attribute_exists_admin(request):
    email_to_check = request.POST.get('email')

    # Check if a user exists with the given email
    user_exists = Admin.objects.filter(email=email_to_check).exists()

    if user_exists:
        return True
    else:
        return False


def admin_login(request):

    if request.method == 'POST':

        email_received = request.POST.get('email')
        password_received = request.POST.get('password')

        if check_attribute_exists_admin(request):
            user_ex = Admin.objects.get(email=email_received)
            if user_ex.password == password_received:
                return admin_home(request)
                
            return render(request, 'pages/Admin/admin_login.html', {'message_admin': 'Invalid Email or Password'})

    return render(request ,'pages/Admin/admin_login.html')
