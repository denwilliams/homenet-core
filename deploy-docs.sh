set -e
echo INSTALLING DEPENDENCIES

npm install -g typedoc --loglevel silent
npm install --loglevel silent
pip install --user mkdocs

echo CONFIGURING GIT

git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

# git remote add gh-token "https://${GH_TOKEN}@github.com/denwilliams/homenet-core.git";
# git fetch gh-token && git fetch gh-token gh-pages:gh-pages;

echo CLONING

rm -rf ./gh-pages-docs
git clone -b gh-pages --single-branch https://${GH_TOKEN}@github.com/denwilliams/homenet-core.git gh-pages-docs --depth 1

echo BUILDING MKDOCS

pushd docs
    mkdocs build -d ../gh-pages-docs
popd

echo BUILDING TYPEDOC

typedoc --mode file --out ./gh-pages-docs/tsdoc/ --module commonjs --target ES6 --exclude node_modules/* --includeDeclarations --excludeExternals tsconfig.json

echo PUSHING

pushd gh-pages-docs
    git add .
    git commit -m "Update docs"
    git push
popd
