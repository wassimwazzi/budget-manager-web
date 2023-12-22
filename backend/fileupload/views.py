from rest_framework import viewsets, mixins, status
from rest_framework.response import Response
import rest_framework.serializers as serializers
from .serializers import FileUploadSerializer
from .models import FileUpload
from .tasks import process_file


class FileUploadView(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    viewsets.GenericViewSet,
):
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

    # def perform_create(self, serializer):
    #     serializer.save(user=self.request.user)
    #     task = process_file.delay(serializer.data["id"])
    #     result = task.get()
    #     if not result:
    #         raise serializers.ValidationError("Failed to process file")

    def create(self, request, *args, **kwargs):
        print("Creating file upload")
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        file_upload = serializer.save(user=self.request.user)
        task = process_file.delay(file_upload.id)
        result = task.get()
        if not result:
            return Response(
                "Failed to process file", status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
