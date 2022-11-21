# Nimbus Backend
Backend for Nimbus social media application
## Installation
Requirement:
1. MongoDB Database - to store user data
2. Azure Blob Storage - to store images
### Locally
add .env file
```
DB_URL="" #mongodb_url
secret="" #random string for JWT
AZURE_STORAGE_ACCOUNT_NAME=" #azure storage name
AZURE_STORAGE_ACCOUNT_ACCESS_KEY="" #azure storage access key
```
to start run in terminal
```
npm install
npm ci --only=production
```
### Azure Kubernetes Service using Azure Pipeplines
\
Conntect to Azure Pipeplines and it will automatically put the crediental to the yml file 

Put environment variables to your Github Secret

Start the build process

### Docker
use this compose file to start docker container

#### docker-compose.yml
```
version: "3"
services:
  nimbus_backend:
    image: nawat3329/nimbus_backend:latest
    container_name: nimbus_backend
    ports:
      - 8080:8080
    environment:
      - DB_URL= #mongodb_url
      - secret= #JWT_secret
      - AZURE_STORAGE_ACCOUNT_NAME=
      - AZURE_STORAGE_ACCOUNT_ACCESS_KEY=
```
