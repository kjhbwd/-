# TabiPlan - Japan Travel Itinerary Planner

## Overview

TabiPlan is a full-stack web application for planning personalized travel itineraries to Japan. Users can create AI-generated trip plans with detailed day-by-day schedules including activities, transportation, dining, and lodging. The app features a Japanese-inspired aesthetic with a clean, minimal design using vermilion accents.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI animations
- **Forms**: React Hook Form with Zod validation
- **Date Handling**: date-fns for formatting, react-day-picker for date selection

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES Modules
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schemas
- **Build**: Vite for client bundling, esbuild for server bundling

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all tables
- **Tables**:
  - `users` and `sessions` - Authentication (required for Replit Auth)
  - `conversations` and `messages` - Chat functionality
  - `itineraries` and `itinerary_items` - Trip planning data

### Authentication
- **Provider**: Replit Auth via OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Implementation**: Passport.js with custom OIDC strategy in `server/replit_integrations/auth/`

### AI Integration
- **Provider**: OpenAI API via Replit AI Integrations
- **Features**: 
  - Itinerary generation from user preferences
  - Chat conversations
  - Image generation capability

### Project Structure
```
client/src/           # React frontend
  components/         # UI components including shadcn/ui
  pages/              # Route pages (Landing, Dashboard, CreateTrip, ItineraryDetail)
  hooks/              # Custom React hooks
  lib/                # Utilities and query client
server/               # Express backend
  replit_integrations/  # Auth, chat, image, batch processing modules
  routes.ts           # API route handlers
  storage.ts          # Database operations
shared/               # Shared between client/server
  schema.ts           # Drizzle table definitions
  routes.ts           # API contract with Zod schemas
  models/             # Type definitions for auth and chat
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and type-safe queries

### Authentication
- **Replit Auth**: OIDC provider at `ISSUER_URL` (defaults to replit.com/oidc)
- **Required env vars**: `SESSION_SECRET`, `REPL_ID`

### AI Services
- **OpenAI API**: Via Replit AI Integrations
- **Required env vars**: `AI_INTEGRATIONS_OPENAI_API_KEY`, `AI_INTEGRATIONS_OPENAI_BASE_URL`

### Third-Party Libraries
- **UI Components**: Radix UI primitives (dialog, popover, select, etc.)
- **Styling**: Tailwind CSS, class-variance-authority, tailwind-merge
- **Data Fetching**: TanStack React Query
- **Validation**: Zod with drizzle-zod integration