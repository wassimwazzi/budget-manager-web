from rest_framework import viewsets
import rest_framework.serializers as serializers
from .serializers import TransactionSerializer
from .models import Transaction
from category.models import Category


class TransactionView(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

    def get_queryset(self):
        """
        This view should return a list of all the transactions
        for the currently authenticated user.
        """
        user = self.request.user
        return Transaction.objects.filter(user=user)

    def perform_create(self, serializer):
        category = self.request.data.get("category")
        try:
            category = Category.objects.get(id=category)
        except (Category.DoesNotExist, ValueError) as e:
            raise serializers.ValidationError("Category not found: {}".format(e))
        serializer.save(user=self.request.user, category=category)

    def perform_update(self, serializer):
        category_id = self.request.data.get("category")
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except (Category.DoesNotExist, ValueError) as e:
                raise serializers.ValidationError("Category not found: {}".format(e))
            serializer.save(category=category)
        else:
            serializer.save()
