from rest_framework import viewsets
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
        category = Category.objects.get(category=category)
        serializer.save(user=self.request.user, category=category)
