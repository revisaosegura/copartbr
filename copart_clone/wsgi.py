"""WSGI entry point for compatibility with Render settings expecting `copart_clone`.
This module simply re-exports the application from `sitehub.wsgi`.
"""
from sitehub.wsgi import application
