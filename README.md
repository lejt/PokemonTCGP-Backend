# Pokémon TCG Pocket (Backend)

This is my personal development project that emulates the recent Pokemon TCG Pocket game in web version. The app allows users to open booster packs, collect cards, and track their collection.

**Project Link** - [click here!](https://pokemon-tcgp-jackytam.vercel.app/)

## Features

- **Authentication & Authorization** - JWT token, route protection - token required in header for most requests, user password hash
- **Initial Seeding** - Cards seeded on app initialization using SDK, services used to format and sort into custom tables, bulk saving data
- **Pagination and sort** - Card data is paginated to reduce load (700+ cards in database), query used in ORM to sort by card attributes
- **Type and Class validation** - Tables, functions, and variables are typed and checked
- **Error handling** - logs and throw errors incorporated with try catches provide graceful failure
- **Rate Limit** - implement rate limit for apis

## Tech Stack

- **Framework**: [Nest.js](https://docs.nestjs.com/)
- **Language**: [TypeScript](https://typescriptlang.org)
- **ORM**: [TypeORM](https://typeorm.io/)
- **API standard**: RESTful
- **Class validation**: [hapisjs](https://github.com/hapijs/joi)
- **Database**: PostgreSQL (remote hosted via [Supabase](https://supabase.com/docs))

## Installation & Getting Started

Prerequisites

- npm or yarn package manager

Install dependencies:

```
npm install
```

Create a `.env.development` file in the `/config` folder with variables:

```
DB_HOST=localhost
DB_PORT=5632
DB_NAME=your-db-name
DB_USERNAME=your-db-username
DB_PASSWORD=your-db-password
PORT=****
DB_SSL=false
JWT_SECRET=your-jwt-secret
```

Run the development server:

```
npm run start:dev
```

## API Communication

This backend's features can be called through the [**NextJS frontend**](https://github.com/lejt/Pokemon-TCGP-frontend) through RESTful APIs. Ensure the frontend is running for proper functionality.

## Future Enhancements

- **Deck Building**: Enable users to create and manage decks
- **Battle System**: Implement battle mechanics (need web sockets)
- **Trading feature**: Allow users to trade cards
- **Implement booster pack opening wall**: limit opening rate may encourage users to trade

## License

This project is for educational purposes. No official affiliation with Pokémon or Nintendo.

## Deploy on Railway

This repo is deployed on [Railway Platform](https://docs.railway.com/)
