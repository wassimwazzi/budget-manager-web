from rest_framework import viewsets
import rest_framework.serializers as serializers
from .serializers import TransactionSerializer
from .models import Transaction
from category.models import Category
from django.utils import timezone


class TransactionView(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer

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
            if filter_field not in [f.name for f in Transaction._meta.get_fields()]:
                raise serializers.ValidationError("Invalid filter")
            return Transaction.objects.filter(
                user=user, **{f"{filter_field}__icontains": filter_value}
            )
        return Transaction.objects.filter(user=user)

    def validate_date(self):
        date = self.request.data.get("date")
        if not date:
            return
        date = timezone.datetime.strptime(date, "%Y-%m-%d").date()
        if date > timezone.now().date():
            raise serializers.ValidationError("Date cannot be in the future")

    def perform_create(self, serializer):
        self.validate_date()
        category = self.request.data.get("category")
        try:
            category = Category.objects.get(id=category)
        except (Category.DoesNotExist, ValueError) as e:
            raise serializers.ValidationError("Category not found: {}".format(e))
        serializer.save(user=self.request.user, category=category)

    def perform_update(self, serializer):
        self.validate_date()
        category_id = self.request.data.get("category")
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except (Category.DoesNotExist, ValueError) as e:
                raise serializers.ValidationError("Category not found: {}".format(e))
            serializer.save(category=category)
        else:
            serializer.save()
