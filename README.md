# Next.js + Better Auth + Drizzle

A modern full-stack authentication starter template built with Next.js, Better Auth, and Drizzle ORM.

## Tech Stack

- **Next.js** - React framework for production
- **Better Auth** - Modern authentication library
- **Drizzle ORM** - TypeScript ORM for SQL databases
- **TypeScript** - Type safety and developer experience

## Getting Started

### Prerequisites

- Node.js 18+
- Package manager (npm, yarn, or pnpm)
- Database (PostgreSQL, MySQL, or SQLite)

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
DATABASE_URL=your_database_url
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:3000
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Seed database
npm run db:seed
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
├── app/              # Next.js app directory
├── components/       # React components
├── lib/              # Utility functions and configurations
├── db/               # Database schema and migrations
└── public/           # Static assets
```

## Features

- 🔐 Secure authentication with Better Auth
- 📊 Type-safe database queries with Drizzle
- 🎨 Modern UI components
- 📱 Responsive design
- ⚡ Fast development with hot reload

## License

MIT
