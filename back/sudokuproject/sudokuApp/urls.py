from django.urls import path
from .views import ProblemList, Problem

urlpatterns = [
    path('problemList/', ProblemList.as_view(), name="problemList"),
    path('problem/<int:pk>', Problem.as_view(), name="problem"),
]