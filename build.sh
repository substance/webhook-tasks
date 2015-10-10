#!/bin/bash
set -e

branch=master
giturl=https://github.com/substance/substance.git
remoteurl=git@github.com:substance/docs.git
source=/tmp/substance
build=/tmp/substance/dist/doc

# Check to see if repo exists. If not, git clone it
if [ ! -d $source ]; then
  echo "Cloning repository..."
  git clone $giturl $source
fi

# Git checkout appropriate branch, pull latest code
cd $source
echo "Updating repository..."
git checkout $branch
git fetch origin $branch
git reset --hard FETCH_HEAD
cd -

# Run build script
cd $source
echo "Executing 'npm install'..."
npm install
echo "Executing 'npm run doc'..."
npm run doc
message=$(git log -1 --pretty=%B)
cd -

cd "$build"
if git diff-index --quiet HEAD --; then
  echo "Documentation did not change."
else
  echo "Pushing changes into 'substance/docs'..."
  git add .
  git commit -m "$message"
  git push origin gh-pages
fi
cd -

echo "Success."
exit 0
