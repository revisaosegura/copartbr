from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('app/', include('accounts.urls')),
    path('app/', include('bids.urls')),
]
