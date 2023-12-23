from rest_framework import viewsets
from rest_framework import serializers
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
        queryset = Category.objects.filter(user=user)

        sort_field = self.request.query_params.get("sort", None)
        sort_order = self.request.query_params.get("order", None)
        if sort_field and sort_order:
            if sort_field not in [f.name for f in Category._meta.get_fields()]:
                raise serializers.ValidationError("Invalid sort field")
            if sort_order not in ["asc", "desc"]:
                raise serializers.ValidationError(
                    "Invalid sort order, must be asc or desc"
                )
            queryset = queryset.order_by(
                f"{'' if sort_order == 'asc' else '-'}{sort_field}"
            )
        return queryset

    def perform_create(self, serializer):
        print(self.request.user)
        serializer.save(user=self.request.user)
