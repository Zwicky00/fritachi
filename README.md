# Fritachi

The Shadow Hokage (Backend Server) of Freeknect website

## Getting Started


### Prerequisites

Below are for Windows operating System 
- [NVM](https://github.com/coreybutler/nvm-windows)
- [OpenSSL](https://slproweb.com/products/Win32OpenSSL.html)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Google OAuth Client](https://support.google.com/cloud/answer/6158849?hl=en)
### Installing

Clone the repository onto a local system

    nvm install 20
    nvm use 20

Install all the dependencies

    npm install

And start the server

    npm start
Set public and private keys for RSA encryption

  openssl genpkey -algorithm RSA -out private.pem -aes256
  openssl rsa -pubout -in private.pem -out public.pem

Set Environment Variables by creating .env file in the root directory of the repository and fill

  PORT = port number of the server,
  MONGO_URL = link to the mongo db server, 
  GOOGLE_OAUTH_REDIRECT_URL, 
  GOOGLE_CLIENT_SECRET, 
  GOOGLE_CLIENT_ID 

## Authors

  - **Sreekara Madyastha** 

## Acknowledgments

  -   Masashi Kishimoto for writing Naruto and giving the name itachi