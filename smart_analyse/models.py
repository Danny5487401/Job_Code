from django.db import models

# Create your models here.
from resumes.models import Resume
from companies.models import Area

class ExpectArea(models.Model):
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, default='')
    area = models.ForeignKey(Area, on_delete=models.CASCADE, default='')
