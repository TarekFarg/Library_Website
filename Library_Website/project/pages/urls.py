from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('categories.html', views.categories, name='categories'),
    path('Login.html', views.Login, name='Login'),
    path('Signup.html', views.Signup, name='Signup'),
    path('Template_Category.html', views.Template_Category, name='Template_Category'),
    path('Not_Available.html', views.Not_Available, name='Not_Available'),
    path('confirm.html', views.confirm, name='confirm'),
    path('Borrow_book.html', views.Borrow_book, name='Borrow_book'),
   path('Template_book/<str:title>/', views.Template_book, name='Template_book'),


]
