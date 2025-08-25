from django.db import models
from django.contrib.auth.models import User

class Bid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    lot_number = models.CharField(max_length=100)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.lot_number} - {self.amount}'
