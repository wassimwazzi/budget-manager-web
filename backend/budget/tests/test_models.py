from datetime import datetime
import django.db.utils
from django.test import TestCase
from budget.tests.factories import BudgetFactory


class BudgetTestCase(TestCase):
    """
    Budget Test Case
    """

    def test_start_date_is_set_to_first_of_month(self):
        """
        Test start date is set to first of month
        """
        budget = BudgetFactory(start_date=datetime(2021, 1, 15))
        self.assertEqual(budget.start_date.day, 1)

    def test_budget_is_unique(self):
        """
        Test budget is unique
        """
        budget = BudgetFactory()
        with self.assertRaises(django.db.utils.IntegrityError):
            BudgetFactory(
                category=budget.category,
                start_date=budget.start_date,
            )
