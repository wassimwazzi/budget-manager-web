from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import BudgetSerializer
from .models import Budget
from category.models import Category


class BudgetView(viewsets.ModelViewSet):
    serializer_class = BudgetSerializer

    def get_queryset(self):
        """
        This view should return a list of all the transactions
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
        user = self.request.user
        budgets = Budget.objects.filter(user=user)
        total_budget = 0
        total_spent = 0
        for budget in budgets:
            total_budget += budget.budget
            total_spent += budget.spent
        return Response({"total_budget": total_budget, "total_spent": total_spent})
