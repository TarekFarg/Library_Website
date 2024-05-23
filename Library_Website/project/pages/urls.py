from django.urls import path
from . import views
from .views import admin_users, delete_user
urlpatterns = [
    path('', views.index, name='index'),  # URL pattern for the homepage
    path('index_books/', views.index_books, name='index_books'),
    path('Template_book/<str:title>/', views.Template_book, name='Template_book'),
    path('Template_book_details/<str:title>/', views.Template_book_details, name='Template_book_details'),
    path('categories/', views.categories, name='categories'),
    path('Login/', views.Login, name='Login'),
    path('Signup/', views.Signup, name='Signup'),
    path('Template_Category/', views.Template_Category, name='Template_Category'),
    path('Not_Available/', views.Not_Available, name='Not_Available'),
    path('confirm/', views.confirm, name='confirm'),
    path('Borrow_book/', views.Borrow_book, name='Borrow_book'),
    path('index.html', views.index, name='index_html'), 
    path('categories.html', views.categories, name='categories'), 
    path('Login.html', views.Login, name='Login'),
    path('Signup.html', views.Signup, name='Signup'),  
    path('Borrow_book.html', views.Borrow_book, name='Borrow_book'),
      # URL pattern for index.html
    # Admin
    path('admin_home', views.admin_home, name='admin_home'),
    path('admin_users', views.admin_users, name='admin_users'),
    path('admin_books', views.admin_books, name='admin_books'),
    path('admin_login', views.admin_login, name='admin_login'),
    path('delete_book/<int:book_id>/', views.delete_book, name='delete_book'),
      path('admin-users/', admin_users, name='admin_users'),
        path('delete-user/<int:user_id>/', delete_user, name='delete_user'),
]
