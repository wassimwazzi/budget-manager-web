from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import BudgetSerializer
from .models import Budget
from category.models import Category
import datetime


class BudgetView(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        """
        This view should return a list of all the budgets
        for the currently authenticated user.
        """
        user = self.request.user
        return Budget.objects.filter(user=user)

    def perform_create(self, serializer):
        category = self.request.data.get("category")
        category = Category.objects.get(category=category)
        serializer.save(user=self.request.user, category=category)

    def perform_update(self, serializer):
        category = self.request.data.get("category")
        category = Category.objects.get(category=category)
        serializer.save(user=self.request.user, category=category)

    @action(detail=False, methods=["get"])
    def budget_summary(self, request):
        month = request.query_params.get("month")
        if not month:
            return Response({"error": "month param is required"}, status=400)
        try:
            month = datetime.datetime.strptime(month, "%Y-%m").date()
        except ValueError:
            return Response({"error": "month must be in YYYY-MM format"}, status=400)
        budget_summary = Budget.get_budget_by_category(month, request.user)
        return Response(budget_summary, status=200)
