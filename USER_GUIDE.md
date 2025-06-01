# User Guide

This guide provides information on how to use the Contract Management application from a user's perspective.

## Placeholder accounts for user authentication
(*Passwords have been hashed with Bcrypt - 1 round*)

To access the application, you can use the following placeholder accounts:

### Admin account (Full edit and delete permissions)
- **Username:** admin
- **Password:** password123

### User account (Read-Only)
- **Username:** user
- **Password:** password456

## Features

### Core Functionality

- **Full CRUD operations** for Contracts, Clients, and Advisors.
- **Form validation** using React Hook Form + Zod.
- **Many-to-many relationships** between contracts and advisors.
- **Role-based features** (Admin/Advisor roles).
- **Cross-entity navigation** with detailed views.
- **Responsive UI** with Tailwind CSS.

### Added Functionality

- **Enhanced Phone Number Validation:** Checks for numeric format and allows optional leading '+'.
- **Duplicate Contract Check:** Prevents creation or updating with existing registration numbers.
- **Improved Contracts Table Functionality:** Added filtering for the Contracts table, allowing more in-depth control over displayed information.
- **Sort Functionality for Tables:** Added sorting for all main categories.
- **Refined Mobile Layout:** A mobile-specific layout, allowing for the app to be displayed even on smaller devices, without sacrificing function.
- **Comprehensive CSV Export:** Export individual data (Contracts, Clients, Advisors) or a unified CSV file with data from all entities - Excel ready.

## How to Use

### Logging In

1. Navigate to the login page.
2. Enter your username and password using the placeholder accounts provided above.
3. Click the "Login" button to access the application.

### Managing Contracts

- **View Contracts:** Navigate to the Contracts tab to see a list of all contracts.
- **Add Contract:** Click the "Add Contract" button to create a new contract. Fill in the required fields and submit the form.
- **Edit Contract:** Click the "Edit" button next to a contract to modify its details.
- **Delete Contract:** Click the "Delete" button to remove a contract from the system.

### Managing Clients

- **View Clients:** Navigate to the Clients tab to see a list of all clients.
- **Add Client:** Click the "Add Client" button to create a new client. Fill in the required fields and submit the form.
- **Edit Client:** Click the "Edit" button next to a client to modify their details.
- **Delete Client:** Click the "Delete" button to remove a client from the system.

### Managing Advisors

- **View Advisors:** Navigate to the Advisors tab to see a list of all advisors.
- **Add Advisor:** Click the "Add Advisor" button to create a new advisor. Fill in the required fields and submit the form.
- **Edit Advisor:** Click the "Edit" button next to an advisor to modify their details.
- **Delete Advisor:** Click the "Delete" button to remove an advisor from the system.

### Exporting Data

- **Export Contracts:** Click the "Export Contracts CSV" button to download a CSV file of all contracts.
- **Export Clients:** Click the "Export Clients CSV" button to download a CSV file of all clients.
- **Export Advisors:** Click the "Export Advisors CSV" button to download a CSV file of all advisors.
- **Export All Data:** Click the "Export All Data CSV" button to download a unified CSV file containing data from all entities. 