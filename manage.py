#!/usr/bin/env python
import os
import sys
from pathlib import Path

# Ensure the Django app directory is on the Python path
BASE_DIR = Path(__file__).resolve().parent
DJANGO_APP = BASE_DIR / 'django_app'
if str(DJANGO_APP) not in sys.path:
    sys.path.insert(0, str(DJANGO_APP))

if __name__ == '__main__':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sitehub.settings')
    from django.core.management import execute_from_command_line
    execute_from_command_line(sys.argv)
