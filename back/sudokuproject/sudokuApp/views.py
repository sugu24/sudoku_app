from django.shortcuts import render
from django.views.generic import ListView, DetailView
from .models import ProblemModel
from django.urls import reverse_lazy
import environ

class ProblemList(ListView):
    template_name = 'problemList.html'
    model = ProblemModel
    context_object_name = "problem_list"

class Problem(DetailView):
    template_name = 'problem.html'
    model = ProblemModel
    context_object_name = "problem_data"
