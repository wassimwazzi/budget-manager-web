"""
File Upload Model
"""
from django.db import models
from django.contrib.auth.models import User

class Status(models.TextChoices):
    """
    Status
    """
    PENDING = 'PENDING'
    IN_PROGRESS = 'IN_PROGRESS'
    COMPLETED = 'COMPLETED'
    FAILED = 'FAILED'

class FileUpload(models.Model):
    """
    Upload a file to be processed.
    """
    id = models.AutoField(primary_key=True)
    filename = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING)
    message = models.CharField(max_length=255, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
