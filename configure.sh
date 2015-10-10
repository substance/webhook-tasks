#!/bin/bash
_HEROKU_PRIVATE_KEY=$(cat heroku_id_rsa)
_HEROKU_PUBLIC_KEY=$(cat heroku_id_rsa.pub)
heroku config:set HEROKU_PRIVATE_KEY="$_HEROKU_PRIVATE_KEY"
heroku config:set HEROKU_PUBLIC_KEY="$_HEROKU_PUBLIC_KEY"
