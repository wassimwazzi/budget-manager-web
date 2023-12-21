from rest_framework import viewsets
from .serializers import CategorySerializer
from .models import Category


class CategoryView(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    pagination_class = None

    def get_queryset(self):
        """
        This view should return a list of all the categories
        for the currently authenticated user.
        """
        user = self.request.user
        return Category.objects.filter(user=user)
