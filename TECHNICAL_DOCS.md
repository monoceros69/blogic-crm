# Technical Documentation

This document provides a more in-depth look at the technical implementation details of the Contract Management POC.

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

## Implementation Details

### User Authentication

- **Login Process:** The application uses a simple authentication mechanism where user credentials are stored in `localStorage`. The `LoginPage` component checks the credentials against the `/api/users` endpoint and sets `localStorage` flags for user roles.
- **Role-Based Access:** The application differentiates between admin and regular users. Admin users have full permissions to edit, delete, and create entities, while regular users have read-only access.

### Form Validation

- **React Hook Form + Zod:** Form validation is implemented using React Hook Form and Zod schemas. This ensures that all inputs meet the required criteria before submission.
- **Custom Validation Rules:** Additional validation rules, such as phone number format and duplicate contract checks, are implemented to enhance data integrity.

### Data Management

- **CRUD Operations:** The application supports full CRUD operations for contracts, clients, and advisors. These operations are managed through API calls to the json-server mock API.
- **Many-to-Many Relationships:** Contracts and advisors have a many-to-many relationship, managed through the `contractAdvisors` endpoint.

### UI/UX Enhancements

- **Responsive Design:** The application uses Tailwind CSS for responsive design, ensuring a consistent user experience across different devices.
- **Mobile Layout:** The mobile layout has been refined to ensure button placement and text wrapping are optimized for smaller screens.

### Data Export

- **CSV Export:** The application allows users to export data in CSV format. This includes individual exports for contracts, clients, and advisors, as well as a unified export for all data.
- **Excel Compatibility:** Phone numbers are formatted to prevent scientific notation in Excel, ensuring data integrity when viewed in spreadsheet applications.

### Performance Optimization

- **Lazy Loading:** The application uses React's lazy loading to improve performance by loading components only when needed.
- **State Management:** React Query is used for efficient server state management, reducing unnecessary API calls and improving data consistency.

### Security Considerations

- **Password Hashing:** Passwords are hashed using Bcrypt (1 round) for demonstration purposes. In a production environment, more secure hashing methods should be used.
- **Role-Based Access Control:** The application implements role-based access control to restrict certain actions based on user roles.

### Future Improvements

- **Enhanced Security:** Implement more robust authentication and authorization mechanisms.
- **Scalability:** Optimize the application for larger datasets and more concurrent users.
- **User Feedback:** Add more user feedback mechanisms, such as notifications and error messages, to improve the user experience.
