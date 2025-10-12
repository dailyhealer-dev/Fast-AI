# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# Configuration file for the Sphinx documentation builder.

import os
import sys
import django

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = 'dailyhealer'
copyright = '2025, Assefa Mekonen'
author = 'Assefa Mekonen'
release = '0.1.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

# Add the 'src' folder to sys.path so autodoc can find Django apps
sys.path.insert(0, os.path.abspath('../src'))

# Tell Django which settings to use
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sotofle.settings')

# Setup Django
django.setup()

extensions = [
    'sphinx.ext.autodoc',      # Auto-generate docs from docstrings
    'sphinx.ext.viewcode',     # Add links to highlighted source code
    'sphinx.ext.napoleon',     # Support Google/NumPy style docstrings
    'sphinxcontrib_django',    # Django integration
]

templates_path = ['_templates']
exclude_patterns = []

# -- Options for HTML output -------------------------------------------------
html_theme = 'sphinx_rtd_theme'
html_static_path = ['_static']
