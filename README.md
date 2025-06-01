# Contract Management POC

![CI](https://github.com/monoceros69/blogic-crm/workflows/CI/badge.svg)
# Contract Management POC

A proof-of-concept React application for managing contracts, clients, and advisors. Built with React, TypeScript, React Hook Form, Zod, and json-server for mock API.

## Features

- **Full CRUD operations** for Contracts, Clients, and Advisors
- **Form validation** using React Hook Form + Zod
- **Many-to-many relationships** between contracts and advisors
- **Role-based features** (Admin/Advisor roles)
- **Cross-entity navigation** with detailed views
- **Responsive UI** with Tailwind CSS

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **React Router** for navigation
- **React Query (TanStack Query)** for server state management
- **React Hook Form + Zod** for forms and validation
- **Tailwind CSS** for styling
- **json-server** for mock REST API

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/contract-management-poc.git
cd contract-management-poc
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start both the React app and json-server:

```bash
npm start
```

This will run:
- React app on http://localhost:5173
- JSON Server on http://localhost:3001

## Project Structure

```
src/
├── components/         # Reusable components
│   ├── clients/       # Client-specific components
│   ├── advisors/      # Advisor-specific components
│   └── contracts/     # Contract-specific components
├── pages/             # Page components
├── services/          # API service layer
├── types/             # TypeScript type definitions
├── schemas/           # Zod validation schemas
└── App.tsx           # Main app component
```

## API Endpoints

The mock API provides the following endpoints:

- `GET/POST /contracts` - List all contracts or create new
- `GET/PUT/DELETE /contracts/:id` - Get, update, or delete specific contract
- `GET/POST /clients` - List all clients or create new
- `GET/PUT/DELETE /clients/:id` - Get, update, or delete specific client
- `GET/POST /advisors` - List all advisors or create new
- `GET/PUT/DELETE /advisors/:id` - Get, update, or delete specific advisor
- `GET/POST /contractAdvisors` - Manage contract-advisor relationships

## Business Rules

1. Each contract must have:
   - A unique registration number
   - An institution (ČSOB, AEGON, Axa, etc.)
   - One client
   - One administrator (must be an advisor with admin role)
   - At least one advisor
   - Conclusion, validity, and ending dates

2. Date constraints:
   - Validity date must be on or after conclusion date
   - Ending date must be after validity date

3. All clients and advisors must provide:
   - Name and surname
   - Email and phone
   - SSN (format: 123456/7890)
   - Age (minimum 18)

## Development

To run only the React app:
```bash
npm run dev
```

To run only the JSON server:
```bash
npm run server
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This is a proof-of-concept project for demonstration purposes.