#!/bin/bash
set -e

branch=docs-test
giturl=https://github.com/substance/substance.git
remoteurl=git@github.com:substance/docs.git
source=/tmp/substance
build=/tmp/substance/dist/doc
docs=/tmp/docs

# Check to see if repo exists. If not, git clone it
if [ ! -d $source ]; then
  echo "Cloning substance/substance..."
  git clone $giturl $source
fi
if [ ! -d $docs ]; then
  echo "Cloning substance/docs..."
  git clone $remoteurl $docs
fi

# Git checkout appropriate branch, pull latest code
echo "Updating repositories..."
cd $source
git checkout $branch
git fetch origin $branch
git reset --hard FETCH_HEAD
cd -
cd $docs
git checkout gh-pages
git fetch origin gh-pages
git reset --hard FETCH_HEAD
cd -

# Run build script
cd $source
echo "Executing 'npm install'..."
npm install
echo "Executing 'npm run doc'..."
npm run doc
message=$(git log -1 --pretty=%B)
echo "Updating docs..."
rsync -r --delete --cvs-exclude /tmp/substance/dist/master/ /tmp/docs/master
cd -

cd "$docs"
if git status --porcelain; then
  echo "Pushing changes into 'substance/docs'..."
  git add .
  git commit -m "$message"
  git push origin gh-pages
else
  echo "Documentation did not change."
fi
cd -

echo "Success."
exit 0