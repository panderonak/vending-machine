# Vending Machine

A CLI-based vending machine simulator built with TypeScript, Bun, and Drizzle ORM.

https://github.com/user-attachments/assets/118f15bf-878b-4c1c-90ac-c309ae08f151

## Features

- Browse available products with prices and stock levels
- Select products by slot position
- Insert cash and receive change
- Automatic change calculation using Indian Rupee denominations (₹500, ₹200, ₹100, ₹50, ₹20, ₹10, ₹5, ₹2, ₹1)
- SQLite database for product and inventory management

> For a better understanding of how the calculation of change is determined, refer to this [Change-making problem](https://en.wikipedia.org/wiki/Change-making_problem).

## Prerequisites

- [Bun](https://bun.sh) v1.3.8 or later

## Getting Started

### Installation

```bash
bun install
```

### Environment Setup

Create a `.env` file in the project root:

```bash
DB_FILE_NAME=db.sqlite
```

### Database Setup

Push the database schema:

```bash
bun run db:push
```

Optionally, view and manage your database with Drizzle Studio:

```bash
bun run db:studio
```

### Running the Application

```bash
bun run dev
```

## Usage

Once running, the vending machine displays available products and presents a menu:

1. **Select product** - Choose a product by entering its slot number
2. **Insert cash** - Add money to purchase the selected product
3. **Exit** - Close the application

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start the application with hot reload |
| `bun run db:push` | Push schema changes to the database |
| `bun run db:studio` | Open Drizzle Studio for database management |
| `bun run check` | Run Biome linter and formatter |

## Tech Stack

- **Runtime**: [Bun](https://bun.sh)
- **Language**: TypeScript
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team)
- **Linting/Formatting**: [Biome](https://biomejs.dev)
