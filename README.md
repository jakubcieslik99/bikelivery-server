# <img src="https://i.ibb.co/F43sFj3/bikelivery-server-1.png" width="440">

## Bikelivery Server 🚴

📌 A simple REST API server used for managing bike deliveries & showing monthly/weekly stats. Project contains NestJS app as
a backend (server). Database used in this project is PostgreSQL.

![GitHub package.json version (subfolder of monorepo)](https://img.shields.io/github/package-json/v/jakubcieslik99/bikelivery-server?color=orange&filename=package.json&label=server%20version)
![GitHub top language](https://img.shields.io/github/languages/top/jakubcieslik99/bikelivery-server)
![GitHub repo size](https://img.shields.io/github/repo-size/jakubcieslik99/bikelivery-server)

## Features

- Adding trips between two addresses with price and date
- Editing or deleting previously added trips
- Listing all added trips
- Listing weekly stats containing total distance and price from current week
- Listing monthly stats containing total distance, average distance and average price from current month splitted by days

## Endpoints Documentation

📚 Documentation of all available endpoints can be found here:
[API Documentation](https://documenter.getpostman.com/view/20607862/2s93CHtut2)

## Run Locally

- Clone repository

```bash
  git clone https://github.com/jakubcieslik99/bikelivery-server.git
```

ℹ️ Instructions for running server app locally:

- Navigate to the server directory and install dependencies

```bash
  cd bikelivery-server
  npm install
```

- Run server app in development mode

```bash
  npm run docker
  npm run dev
```

## Deployment

ℹ️ Instructions for building and running server app in production

- Transpile to production build

```bash
  npm run build
```

- Run server app in production mode

```bash
  npm install --omit=dev
  npm run migration:run
  npm run start:prod
```

## Environment Variables

⚙️ To run server app, you will need to add the following environment variables to your .env file

- `DIR` _(default already set for development)_
- `ENV` _(default already set for development)_

- `POSTGRES_VER`
- `REDIS_VER`

- `PORT`
- `API_URL`
- `APP_URL`

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`

- `REDIS_HOST`
- `REDIS_PORT`
- `REDIS_PASSWORD`

- `COOKIE_SESSION_SECRET`
- `JWT_ACCESS_TOKEN_SECRET`
- `JWT_REFRESH_TOKEN_SECRET`
- `GOOGLE_DIRECTIONS_API_KEY`

## Languages

🔤 Available API messages languages: **EN**

## Feedback

If you have any feedback, please reach out to me at ✉️ contact@jakubcieslik.com

## Authors

- [@jakubcieslik99](https://www.github.com/jakubcieslik99)
