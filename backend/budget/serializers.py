from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    """
    Budget serializer
    """

    class Meta:
        model = Budget
        fields = ("id", "category", "amount", "currency", "start_date", "user")
        read_only_fields = ("id", "user")
