#!/bin/bash
echo $0: creating public and private key files

# Create the .ssh directory
mkdir -p ${HOME}/.ssh
chmod 700 ${HOME}/.ssh

# Create the public and private key files from the environment variables.
echo "${HEROKU_PUBLIC_KEY}" > ${HOME}/.ssh/heroku_id_rsa.pub
chmod 644 ${HOME}/.ssh/heroku_id_rsa.pub

# Note use of double quotes, required to preserve newlines
echo "${HEROKU_PRIVATE_KEY}" > ${HOME}/.ssh/heroku_id_rsa
chmod 600 ${HOME}/.ssh/heroku_id_rsa

# Preload the known_hosts file
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

eval `ssh-agent -s`
ssh-add ~/.ssh/heroku_id_rsa
