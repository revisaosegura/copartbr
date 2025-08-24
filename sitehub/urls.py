from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    # Route the root path to the accounts app so visiting ``/`` works
    path('', include('accounts.urls')),
    # Expose bid-related URLs under ``/bids/`` instead of a generic ``/app/``
    path('bids/', include('bids.urls')),
]
