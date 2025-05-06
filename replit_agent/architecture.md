# Architecture Overview: Automatyzator.com

## 1. Overview

Automatyzator.com is a B2B platform offering business automation services, ready-to-use templates, and educational content. The application follows a modern full-stack architecture with a React-based frontend and a Node.js/Express backend. The system is designed to serve multiple audiences, including potential business clients looking for automation solutions and existing customers managing their automations.

The platform includes:
- A public-facing marketing website
- A shop for purchasing automation templates
- A blog with educational content
- A case studies portfolio
- Admin panel for content management
- Multi-language support
- Chat functionality with OpenAI integration

## 2. System Architecture

### 2.1 High-Level Architecture

The application follows a client-server architecture:

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│                 │     │                  │     │                 │
│  React Frontend │────▶│  Express Backend │────▶│ PostgreSQL DB   │
│                 │     │                  │     │                 │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        ▲                        │                        
        │                        ▼                        
┌─────────────────┐     ┌──────────────────┐           
│                 │     │                  │           
│  Static Assets  │     │  OpenAI API      │           
│                 │     │                  │           
└─────────────────┘     └──────────────────┘           
```

### 2.2 Technology Stack

#### Frontend
- **Framework**: React with TypeScript
- **Build Tool**: Vite
- **State Management**: TanStack Query (React Query)
- **Routing**: Wouter
- **Styling**: Tailwind CSS with shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Internationalization**: i18next

#### Backend
- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **ORM**: Drizzle ORM
- **Database**: PostgreSQL via Neon Serverless
- **Authentication**: Session-based with express-session
- **External APIs**: OpenAI API for chat functionality

## 3. Key Components

### 3.1 Frontend Components

#### Public Website
- **Layout Components**: Common layout structure shared across pages
- **Interactive Components**: Interactive hero section with canvas-based animations
- **Service Sections**: Display of services, templates, and case studies
- **Blog System**: Blog posts listing and individual article views
- **Contact Forms**: Forms for customer inquiries and newsletter subscriptions
- **Chat Widget**: AI-powered chat assistant using OpenAI API

#### Admin Panel
- **Authentication**: Login system for admin users
- **Content Management**: CRUD operations for blog posts, templates, and case studies
- **Settings**: Admin settings for site configuration

### 3.2 Backend Components

#### API Routes
- **Public API**: Endpoints for fetching public content (blog posts, templates, case studies)
- **Admin API**: Secured endpoints for content management (requires authentication)
- **Form Submissions**: Endpoints for handling contact and newsletter submissions
- **Authentication**: Login, logout, and session management
- **Chat API**: Integration with OpenAI for generating chat responses

#### Database Access Layer
- **Drizzle ORM**: Type-safe database access with schema definitions
- **Storage Module**: Repository pattern implementation for database operations

### 3.3 Database Schema

The database schema includes the following main entities:
- **Users**: Admin users for the CMS
- **Blog Posts**: Content for the blog section
- **Templates**: Automation templates sold in the shop
- **Case Studies**: Portfolio of customer success stories
- **Contact Submissions**: Form submissions from potential clients
- **Newsletter Subscribers**: Email subscribers for marketing

## 4. Data Flow

### 4.1 Public Content Flow

1. Client requests page from the React application
2. React components use TanStack Query to fetch data from Express API endpoints
3. Express routes handle the requests and use the storage layer to query the database
4. Data is returned to the client and rendered in the appropriate components

### 4.2 Admin Content Management Flow

1. Admin authenticates through the login page
2. Upon successful authentication, a session is created and stored
3. Admin performs CRUD operations through the admin interface
4. API requests include the session cookie for authentication
5. Backend validates the session before processing admin requests
6. Database is updated based on the admin actions

### 4.3 Form Submission Flow

1. User fills out contact or newsletter form
2. Form is validated on the client side using React Hook Form and Zod
3. Validated data is sent to the appropriate API endpoint
4. Backend performs additional validation and processes the submission
5. Submission is stored in the database
6. Confirmation is returned to the client

### 4.4 Chat Functionality Flow

1. User interacts with the chat widget
2. Messages are sent to the backend chat API
3. Backend forwards the message to OpenAI API with appropriate context
4. OpenAI generates a response
5. Response is returned to the client and displayed in the chat widget

## 5. External Dependencies

### 5.1 Core Dependencies

- **@neondatabase/serverless**: Connection to Neon PostgreSQL database
- **drizzle-orm**: ORM for database access
- **@tanstack/react-query**: Data fetching and state management
- **@radix-ui**: UI component primitives
- **shadcn/ui**: UI component collection based on Radix UI
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight routing library
- **i18next**: Internationalization framework
- **openai**: OpenAI API client for chat functionality

### 5.2 Third-Party Services

- **Neon Database**: Serverless PostgreSQL database
- **OpenAI API**: AI-powered chat responses

## 6. Deployment Strategy

### 6.1 Build Process

The application uses a combined build process:
1. Vite builds the frontend into static assets
2. esbuild compiles the TypeScript backend code
3. The resulting artifacts are bundled together for deployment

The build process is defined in the `package.json` scripts:
```json
"build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist"
```

### 6.2 Deployment Configuration

The application is configured for deployment on Replit with the following configuration:
- **Development**: `npm run dev` starts the development server
- **Production**: `npm run start` runs the built application
- **Database**: Provisioned PostgreSQL database with connection string in environment variables

The `.replit` file contains configuration for:
- Nodejs-20 runtime
- PostgreSQL database integration
- Port mapping (5000 internal to 80 external)
- Workflow configuration for Replit's environment

### 6.3 Environment Configuration

The application requires the following environment variables:
- `DATABASE_URL`: Connection string to the PostgreSQL database
- `OPENAI_API_KEY`: API key for OpenAI integration
- `NODE_ENV`: Environment mode (development/production)

## 7. Cross-Cutting Concerns

### 7.1 Authentication & Authorization

- Session-based authentication using `express-session`
- Admin routes protected by authentication middleware
- No public user authentication (B2B platform primarily for content)

### 7.2 Internationalization

- Multi-language support with i18next
- Supported languages: Polish (default), English, German, Korean
- Translation files stored in `client/src/locales/`
- Language detection and switching functionality

### 7.3 Theming

- Light/dark mode support with theme provider
- Theme persistence in localStorage
- System preference detection

### 7.4 Error Handling

- Global error handler middleware in Express
- Custom error boundaries in React components
- Query error handling with TanStack Query

## 8. Future Considerations

### 8.1 Potential Improvements

- **User Authentication**: Implement customer accounts for purchasing and accessing templates
- **Payment Integration**: Add payment gateway for e-commerce functionality
- **Enhanced Analytics**: Integrate analytics for tracking user behavior
- **Workflow Automation**: Implement actual automation workflows for templates

### 8.2 Scalability Concerns

- Current architecture is suitable for moderate traffic
- Database connection pooling helps manage concurrent connections
- Neon Serverless database provides auto-scaling capabilities
- Further optimization may be needed for high traffic scenarios