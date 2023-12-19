"""
Budget models
"""
from category.models import Category
from currency.models import Currency
from django.db import models
from django.contrib.auth.models import User


class Budget(models.Model):
    """
    A budget for a category for a specific period of time. Defaults to monthly.
    Can only have one budget per category per period of time.
    """

    id = models.AutoField(primary_key=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.CASCADE)
    start_date = models.DateField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["category", "start_date"], name="unique_budget"
            ),
        ]

    def __str__(self):
        return f"{self.category} - {self.start_date}: {self.amount} {self.currency}"

    def save(self, *args, **kwargs):
        """
        Set date to first day of month.
        """
        self.start_date = self.start_date.replace(day=1)
        super().save(*args, **kwargs)
