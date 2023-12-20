from rest_framework import viewsets
from .serializers import CurrencySerializer
from .models import Currency


class CurrencyView(viewsets.ModelViewSet):
    serializer_class = CurrencySerializer

    def get_queryset(self):
        """
        This view should return a list of all the transactions
        for the currently authenticated user.
        """
        return Currency.objects.all()
