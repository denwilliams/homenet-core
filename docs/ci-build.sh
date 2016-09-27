#!/bin/bash
set -e # Exit with nonzero exit code if anything fails

pip install mkdocs --upgrade
mkdocs build --clean
