set -e
echo INSTALLING DEPENDENCIES

npm install -g typedoc --loglevel silent
npm install --loglevel silent
pip install --user mkdocs

echo CONFIGURING GIT

# git remote add gh-token "https://${GH_TOKEN}@github.com/denwilliams/homenet-core.git";
# git fetch gh-token && git fetch gh-token gh-pages:gh-pages;

echo CLONING

rm -rf ./gh-pages-docs
git clone -b gh-pages --single-branch https://${GH_TOKEN}@github.com/denwilliams/homenet-core.git gh-pages-docs

echo BUILDING MKDOCS

pushd docs
    mkdocs build -d ../gh-pages-docs
popd

echo BUILDING TYPEDOC

typedoc --mode file --out ./gh-pages-docs/tsdoc/ --module commonjs --target ES5 --lib lib.es5.d.ts,lib.es2015.core.d.ts,lib.es2015.symbol.d.ts,lib.es2015.iterable.d.ts,lib.es2015.promise.d.ts --exclude node_modules/* --includeDeclarations --excludeExternals tsconfig.json

echo PUSHING

pushd gh-pages-docs
    git config user.name "Travis CI"
    git config user.email "travis@denwilliams.net"
    git add .
    git commit -m "Update docs"
    git push
popd
