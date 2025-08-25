import os
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DJANGO_APP = BASE_DIR / 'django_app'
COPART_CLONE_DIR = DJANGO_APP / 'copart_clone'

# Ensure Django app path is available for imports like `sitehub`
if str(DJANGO_APP) not in sys.path:
    sys.path.insert(0, str(DJANGO_APP))

# Point this package to the real copart_clone package inside django_app
__path__ = [str(COPART_CLONE_DIR)]
