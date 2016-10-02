cd docs

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"
git remote add gh-token "https://${GH_TOKEN}@github.com/denwilliams/homenet-core.git";
git fetch gh-token && git fetch gh-token gh-pages:gh-pages;

pip install --user mkdocs
mkdocs gh-deploy -v --clean --remote-name gh-token;
