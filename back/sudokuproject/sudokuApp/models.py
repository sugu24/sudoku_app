from django.db import models

# Create your models here.

class ProblemModel(models.Model):
    problem = models.CharField(max_length=200)
    post_data = models.DateField(auto_now_add=True)
    times = models.IntegerField(default=0)
    respondent = models.IntegerField(default=0)

