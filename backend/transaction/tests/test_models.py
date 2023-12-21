# from django.test import TestCase
# from django.contrib.auth.models import User
# from .models import Transaction
# from .serializers import TransactionSerializer
# from rest_framework.test import APIClient
# from rest_framework import status
# from category.tests.factories import CategoryFactory
# from currency.tests.factories import CurrencyFactory


# class TransactionModelTestCase(TestCase):
#     def setUp(self):
#         self.user = User.objects.create_user(
#             username="testuser", password="testpassword"
#         )
#         self.category = CategoryFactory(user = self.user)
#         self.currency = CurrencyFactory()
#         self.transaction_data = {
#             "code": "123",
#             "amount": "100.50",
#             "currency": "USD",
#             "date": "2023-01-01",
#             "description": "Test transaction",
#             "category": "Test Category",
#             "inferred_category": False,
#             "file": None,
#             "user": self.user,
#         }
#         self.transaction = Transaction.objects.create(**self.transaction_data)

#     def test_transaction_model(self):
#         self.assertEqual(self.transaction.code, "123")
#         self.assertEqual(str(self.transaction.amount), "100.50")
#         self.assertEqual(self.transaction.currency, "USD")
#         self.assertEqual(str(self.transaction.date), "2023-01-01")
#         self.assertEqual(self.transaction.description, "Test transaction")
#         self.assertEqual(self.transaction.category, "Test Category")
#         self.assertFalse(self.transaction.inferred_category)
#         self.assertIsNone(self.transaction.file)
#         self.assertEqual(self.transaction.user, self.user)
