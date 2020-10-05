from django.urls import path

from .views import ResumeView
from . import views

app_name = "resumes"

# app_name will help us do a reverse look-up latter.
urlpatterns = [
#    path('resumes/', ResumeView.as_view()),
]
