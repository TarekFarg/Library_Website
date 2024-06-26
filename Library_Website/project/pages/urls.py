from django.urls import path
from . import views
from .views import admin_users, delete_user
urlpatterns = [
    path('', views.index, name='index'),  
    path('index.html', views.index, name='index'),
    path('index_books/', views.index_books, name='index_books'),
    path('Template_book/<str:title>/', views.Template_book, name='Template_book'),
    path('book-description/<title>/', views.Template_book_description, name='Template_book_description'),

    path('Template_Category/', views.Template_Category, name='Template_Category'),
    path('Not_Available/', views.Not_Available, name='Not_Available'),
    path('confirm/', views.confirm, name='confirm'),
    path('categories.html', views.categories, name='categories'), 
    path('Login.html', views.Login, name='Login'),
    path('Signup.html', views.Signup, name='Signup'),  
    path('Borrow_book.html', views.Borrow_book, name='Borrow_book'),
    path('categories/', views.categories, name='category_list'),
    path('categories/<str:category_name>/', views.category_detail, name='category_detail'), 
    path('logout/', views.Logout, name='logout'),
    # Admin
    path('admin_home', views.admin_home, name='admin_home'),
    path('admin_users', views.admin_users, name='admin_users'),
    path('admin_books', views.admin_books, name='admin_books'),
    path('admin_login', views.admin_login, name='admin_login'),
    path('delete_book/<int:book_id>/', views.delete_book, name='delete_book'),
    path('edit_book/<int:book_id>/', views.edit_book, name='edit_book'),
    path('delete-user/<int:user_id>/', views.delete_user, name='delete_user'),
]
