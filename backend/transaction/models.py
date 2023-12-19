"""
Transactions model
"""
from category.models import Category
from currency.models import Currency
from fileupload.models import FileUpload
from django.db import models
from django.contrib.auth.models import User


class Transaction(models.Model):
    """
    Transactions model
    """

    id = models.AutoField(primary_key=True)
    code = models.CharField(max_length=20)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.ForeignKey(Currency, on_delete=models.PROTECT, default="CAD")
    date = models.DateField()
    description = models.CharField(max_length=255, null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    inferred_category = models.BooleanField(default=False)
    file_id = models.ForeignKey(
        FileUpload, on_delete=models.PROTECT, null=True, blank=True
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.date} - {self.code}: {self.amount} {self.currency}"
