# How to install deploy keys

1. Generate a pair

```
ssh-keygen -t rsa -C "heroku@substance.io"
```
Save the key as `heroku_id_rsa` in the local folder.

2. Register the public key as deploy key for `substance/docs` repository.

3. Run `configure.sh`

4. Set a heroku variable GITHUB_SECRET containing the secret configured in the webhook.

