from rest_framework import viewsets
import rest_framework.serializers as serializers
from .serializers import FileUploadSerializer
from .models import FileUpload


class FileUploadView(viewsets.ModelViewSet):
    serializer_class = FileUploadSerializer

    def get_queryset(self):
        """
        This view should return a list of all the transactions
        for the currently authenticated user.
        """
        user = self.request.user
        filter_field = self.request.query_params.get("filter", None)
        filter_value = self.request.query_params.get("filter_value", None)
        if filter_field and filter_value:
            # validate filter is a valid field
            if filter_field not in [f.name for f in FileUpload._meta.get_fields()]:
                raise serializers.ValidationError("Invalid filter")
            return FileUpload.objects.filter(
                user=user, **{f"{filter_field}__icontains": filter_value}
            )
        return FileUpload.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
