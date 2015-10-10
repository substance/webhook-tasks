#!/bin/bash
set -e

branch=master
giturl=https://github.com/substance/substance.git
remoteurl=git@github.com:substance/docs.git
source=/tmp/substance
build=/tmp/substance/dist/doc

# Check to see if repo exists. If not, git clone it
if [ ! -d $source ]; then
  git clone $giturl $source
fi

# Git checkout appropriate branch, pull latest code
cd $source
git checkout $branch
git fetch origin $branch
git reset --hard FETCH_HEAD
cd -

# Run build script
cd $source
npm install
npm run doc
message=$(git log -1 --pretty=%B)
cd -

# Commit docs to gh pages
cd "$build"
git add .
git commit -m "$message"
git push origin gh-pages
cd -

# successful
exit 0
