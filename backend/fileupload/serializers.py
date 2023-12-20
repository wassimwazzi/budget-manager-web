from rest_framework import serializers
from .models import FileUpload


class FileUploadSerializer(serializers.ModelSerializer):
    """
    FileUpload serializer
    """

    class Meta:
        model = FileUpload
        fields = ("id", "filename", "date", "status", "message", "user")
        read_only_fields = ("id", "user")
