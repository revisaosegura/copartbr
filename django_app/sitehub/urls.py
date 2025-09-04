from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Serve account pages under ``/app/`` leaving ``/`` for the Copart mirror
    path('app/', include('accounts.urls')),
    # Expose bid-related URLs under ``/bids/`` instead of a generic ``/app/``
    path('bids/', include('bids.urls')),
]
