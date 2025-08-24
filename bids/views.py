from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Bid

@login_required
def simulate_bid(request):
    if request.method == 'POST':
        lot = request.POST.get('lot_number','').strip()
        amount = request.POST.get('amount','').strip()
        if not lot or not amount:
            messages.error(request, 'Informe o número do lote e o valor.')
        else:
            try:
                value = float(amount.replace(',', '.'))
                Bid.objects.create(user=request.user, lot_number=lot, amount=value)
                messages.success(request, 'Lance SIMULADO registrado com sucesso (não enviado ao Copart).')
                return redirect('dashboard')
            except ValueError:
                messages.error(request, 'Valor inválido.')
    return render(request, 'bids/simulate_bid.html')
