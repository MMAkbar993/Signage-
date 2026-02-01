# Signage Creators Backend

Node.js + PostgreSQL backend for the Universal Smart Signage Generator platform.

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript
- **File Upload**: Multer + Sharp

## Features

- 🔐 **Authentication**: JWT-based auth with refresh tokens
- 👥 **User Management**: Role-based access control (User, Admin, Super Admin)
- 📋 **Signage Management**: CRUD operations for signage documents
- 👤 **Authorized Persons**: Manage authorized personnel records
- 🚨 **Emergency Plans**: Create and manage emergency response plans
- 📊 **Organization Charts**: Build organizational hierarchies
- 📚 **Template Library**: Access pre-built signage templates
- 📝 **Blog/Tutorials**: Content management system
- 🏢 **Company Branding**: Logo and branding management
- ⚙️ **User Settings**: Customizable user preferences
- 📁 **File Uploads**: Image processing and storage
- 📈 **Analytics**: Usage tracking and statistics

## Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

## Installation

### 1. Clone and navigate to backend

```bash
cd backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example environment file and configure:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/signagecreators?schema=public"

# JWT Secrets (generate secure random strings)
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"

# Server
PORT=5000
NODE_ENV=development

# CORS (your frontend URL)
CORS_ORIGIN="http://localhost:5173"

# Admin credentials (for initial setup)
ADMIN_EMAIL="admin@signagecreators.com"
ADMIN_PASSWORD="admin123"
```

### 4. Set up the database

Generate Prisma client:

```bash
npm run db:generate
```

Run database migrations:

```bash
npm run db:migrate
```

Seed the database with initial data:

```bash
npm run db:seed
```

### 5. Start the server

Development mode (with hot reload):

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## API Documentation

### Base URL

```
http://localhost:5000/api
```

### Authentication

All protected endpoints require a Bearer token:

```
Authorization: Bearer <access_token>
```

### Endpoints

#### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout user |
| GET | `/auth/me` | Get current user |
| PUT | `/auth/profile` | Update profile |
| PUT | `/auth/password` | Change password |

#### Signages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/signages` | List user's signages |
| GET | `/signages/public` | List public signages |
| GET | `/signages/:id` | Get signage by ID |
| POST | `/signages` | Create signage |
| PUT | `/signages/:id` | Update signage |
| DELETE | `/signages/:id` | Delete signage |
| POST | `/signages/:id/duplicate` | Duplicate signage |

#### Authorized Persons
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/authorized-persons` | List all |
| GET | `/authorized-persons/:id` | Get by ID |
| POST | `/authorized-persons` | Create |
| POST | `/authorized-persons/bulk` | Bulk create |
| PUT | `/authorized-persons/:id` | Update |
| DELETE | `/authorized-persons/:id` | Delete |

#### Emergency Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/emergency-plans` | List all |
| GET | `/emergency-plans/:id` | Get by ID |
| POST | `/emergency-plans` | Create |
| PUT | `/emergency-plans/:id` | Update |
| DELETE | `/emergency-plans/:id` | Delete |

#### Organization Charts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organization-charts` | List all |
| GET | `/organization-charts/:id` | Get by ID |
| POST | `/organization-charts` | Create |
| PUT | `/organization-charts/:id` | Update |
| DELETE | `/organization-charts/:id` | Delete |

#### Templates
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/templates` | List templates |
| GET | `/templates/categories` | Get categories |
| GET | `/templates/industries` | Get industries |
| GET | `/templates/popular` | Get popular templates |
| GET | `/templates/:id` | Get template |
| GET | `/templates/user/my-templates` | User's custom templates |
| POST | `/templates/user` | Create custom template |

#### Blog
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/blog` | List published posts |
| GET | `/blog/categories` | Get categories |
| GET | `/blog/popular` | Get popular posts |
| GET | `/blog/:slug` | Get post by slug |
| POST | `/blog/:slug/comments` | Add comment |

#### Branding
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/branding` | Get branding |
| PUT | `/branding` | Update branding |
| POST | `/branding/logo/:type` | Upload logo |

#### Settings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/settings` | Get settings |
| PUT | `/settings` | Update settings |
| POST | `/settings/reset` | Reset to defaults |

#### Admin (requires admin role)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/dashboard` | Dashboard stats |
| GET | `/admin/users` | List users |
| PUT | `/admin/users/:id` | Update user |
| DELETE | `/admin/users/:id` | Delete user |
| GET | `/admin/history` | Signage history |

#### Uploads
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/uploads/file` | Upload file |
| POST | `/uploads/files` | Upload multiple |
| POST | `/uploads/image` | Upload & process image |
| POST | `/uploads/image/base64` | Convert to base64 |
| GET | `/uploads` | List user uploads |
| DELETE | `/uploads/:id` | Delete upload |

## Database Schema

The database includes the following main entities:

- **User**: User accounts with roles
- **Session**: JWT refresh token sessions
- **UserSettings**: User preferences
- **CompanyBranding**: Company logos and info
- **Signage**: Generated signage documents
- **AuthorizedPerson**: Personnel records
- **EmergencyPlan**: Emergency response plans
- **OrganizationChart**: Org chart data
- **Template**: Pre-built templates
- **CustomTemplate**: User-created templates
- **BlogPost**: Blog articles
- **BlogComment**: Post comments
- **SignageHistory**: Usage tracking
- **Upload**: File uploads

## Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Build
npm run build        # Compile TypeScript

# Production
npm start            # Run compiled server

# Database
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Run migrations (dev)
npm run db:migrate:prod  # Run migrations (prod)
npm run db:push      # Push schema without migration
npm run db:seed      # Seed initial data
npm run db:studio    # Open Prisma Studio
```

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── config/          # Configuration
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Express middleware
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   └── server.ts        # Entry point
├── uploads/             # Uploaded files
├── .env.example         # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Security

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens with configurable expiration
- Rate limiting on API endpoints
- Helmet.js security headers
- CORS protection
- Input validation with express-validator
- SQL injection protection via Prisma ORM

## Deployment

### Using Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY prisma ./prisma
RUN npx prisma generate

COPY dist ./dist

EXPOSE 5000

CMD ["npm", "start"]
```

### Environment Variables for Production

Make sure to set secure values for:
- `JWT_SECRET` - Long random string
- `JWT_REFRESH_SECRET` - Long random string
- `DATABASE_URL` - Production database URL
- `NODE_ENV=production`
- `CORS_ORIGIN` - Your frontend URL

## License

Proprietary - All rights reserved
