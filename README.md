
<h2>docker-compose.yml</h2>

```md
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
```
