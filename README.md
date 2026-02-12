
# Expense Client - Frontend Application

A modern, feature-rich expense management web application built with React. This application allows users to create groups, track shared expenses, settle balances, and manage transactions efficiently.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Key Features Explained](#key-features-explained)
- [Authentication & Authorization](#authentication--authorization)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Routing](#routing)

## 🎯 Overview

Expense Client is a single-page application (SPA) designed to simplify expense tracking and splitting among groups of people. Whether you're managing household expenses, travel costs, or group activities, this application provides an intuitive interface to track who owes what and settle balances seamlessly.

### Key Capabilities

- **Group Management**: Create and manage expense groups with multiple members
- **Expense Tracking**: Add expenses with detailed information including amount, description, category, and split among members
- **Balance Calculation**: Automatically calculate who owes whom within each group
- **Settlement**: Record settlements to clear debts between members
- **Transaction History**: View complete history of expenses and settlements
- **Dashboard Analytics**: Get insights into spending patterns and category-wise breakdowns
- **Role-Based Access**: Implement role-based permissions (Viewer, Manager, Admin)

## ✨ Features

### Core Features

1. **User Authentication**
   - Email/Password login
   - Google OAuth SSO integration
   - Password reset functionality
   - Session management with JWT tokens

2. **Dashboard**
   - Overview of all groups (limited to 5 recent groups)
   - Quick settle section showing pending debts
   - Category-wise spending breakdown
   - Summary cards with key metrics

3. **Group Management**
   - Create new expense groups
   - View groups in grid or list layout
   - Sort groups (newest, oldest, A-Z, Z-A)
   - Pagination support
   - Delete groups (with proper permissions)

4. **Expense Management**
   - Add expenses to groups
   - Split expenses equally or unequally among members
   - Categorize expenses
   - View expense details
   - Timeline view of expenses and settlements

5. **Balance & Settlement**
   - View balances (what you owe and what you're owed)
   - Quick settle functionality
   - Record settlements between members
   - Track settlement history

6. **Transactions**
   - View all settlement transactions
   - Grouped by date (Today, Yesterday, or specific dates)
   - Complete transaction history

7. **User Management** (Admin/Manager)
   - View all users
   - Create new users
   - Update user information
   - Delete users (Admin only)

8. **Profile & Settings**
   - User profile management
   - Payment management
   - Subscription management

9. **Landing Page**
   - Hero section
   - Features showcase
   - How it works guide
   - Testimonials
   - Call-to-action sections

## 🛠 Tech Stack

### Core Technologies

- **React 18.2.0** - UI library
- **React Router DOM 6.22.3** - Client-side routing
- **Redux Toolkit 2.11.2** - State management
- **React Redux 9.2.0** - React bindings for Redux
- **Axios 1.13.4** - HTTP client for API calls

### UI Libraries & Styling

- **Bootstrap 5.3.8** - CSS framework
- **React Bootstrap 2.10.10** - Bootstrap components for React
- **Tailwind CSS 4.1.18** - Utility-first CSS framework
- **React Spinners 0.17.0** - Loading spinners

### Authentication

- **@react-oauth/google 0.13.4** - Google OAuth integration

### Build Tools

- **Vite 7.2.4** - Build tool and dev server
- **ESLint 9.39.1** - Code linting
- **PostCSS 8.5.6** - CSS processing
- **Autoprefixer 10.4.23** - CSS vendor prefixing


## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher recommended)
- **npm** or **yarn** package manager
- Backend API server running (see environment variables)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd expense-client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_SERVER_ENDPOINT=http://localhost:8000
   VITE_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in terminal)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SERVER_ENDPOINT` | Backend API server URL | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (for Google login) |

### Example `.env` file:

```env
VITE_SERVER_ENDPOINT=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

**Note**: Environment variables prefixed with `VITE_` are exposed to the client-side code. Never include sensitive information like API keys or secrets.

## 🔑 Key Features Explained

### Authentication Flow

1. **Login**: Users can log in using email/password or Google OAuth
2. **Session Management**: JWT tokens are stored in HTTP-only cookies (handled by backend)
3. **Auto-refresh**: On app load, the application checks for existing session
4. **Protected Routes**: Unauthenticated users are redirected to login page

### Group Management

- **Create Groups**: Users with `canCreateGroups` permission can create new groups
- **View Groups**: All users can view groups they're members of
- **Group Details**: Click on a group to view expenses, balances, and members
- **Delete Groups**: Only admins can delete groups

### Expense Tracking

- **Add Expenses**: Click "Add Expense" button in group detail page
- **Split Options**: Expenses can be split equally or unequally among members
- **Categories**: Expenses can be categorized for better tracking
- **Timeline View**: Expenses and settlements are shown in chronological order

### Balance Settlement

- **View Balances**: See what you owe and what you're owed across all groups
- **Quick Settle**: One-click settlement from dashboard or balances page
- **Settlement Recording**: Record when you've paid someone or received payment
- **Balance Updates**: Balances update automatically after settlements

## 🔒 Authentication & Authorization

### Authentication Methods

1. **Email/Password**
   - Traditional login with email and password
   - Password reset via email verification code

2. **Google OAuth**
   - Single Sign-On (SSO) using Google account
   - Users who registered with Google must use Google login

### Role-Based Access Control (RBAC)

The application implements three user roles:

#### Viewer
- Can view users and groups
- Cannot create, update, or delete

#### Manager
- Can create and update users and groups
- Cannot delete users or groups

#### Admin
- Full access: create, update, and delete users and groups

### Permission System

Permissions are defined in `src/rbac/userPermissions.js`:

```javascript
ROLE_PERMISSIONS = {
  viewer: { canViewUsers: true, ... },
  manager: { canCreateUsers: true, canUpdateUsers: true, ... },
  admin: { canCreateUsers: true, canUpdateUsers: true, canDeleteUsers: true, ... }
}
```

### Protected Components

Use the `Can` component to conditionally render based on permissions:

```jsx
<Can requiredPermission="canCreateGroups">
  <button>Create Group</button>
</Can>
```

### Protected Routes

Routes are protected in `App.jsx` by checking `userDetails` from Redux store. Unauthenticated users are redirected to `/login`.

## 📊 State Management

### Redux Store Structure

```javascript
{
  userDetails: {
    _id: string,
    username: string,
    email: string,
    role: 'viewer' | 'manager' | 'admin',
    // ... other user properties
  }
}
```

### Actions

- `SET_USER`: Set user details (on login/session refresh)
- `CLEAR_USER`: Clear user details (on logout)

### Usage

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { SET_USER, CLEAR_USER } from './redux/user/action';

// Get user from store
const user = useSelector(state => state.userDetails);

// Dispatch action
dispatch({ type: SET_USER, payload: userData });
```

## 🌐 API Integration

The application communicates with a backend API. All API calls use Axios with credentials enabled for cookie-based authentication.

### Base Configuration

API endpoint is configured in `src/config/appConfig.js`:

```javascript
export const serverEndpoint = import.meta.env.VITE_SERVER_ENDPOINT;
```

### Key API Endpoints Used

#### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/google-auth` - Google OAuth login
- `GET /auth/get-user` - Get current user
- `GET /auth/logout` - Logout user
- `POST /auth/valid-login` - Check if user has password
- `POST /auth/generate-code` - Generate password reset code
- `POST /auth/verify-code` - Verify reset code
- `POST /auth/reset-password` - Reset password

#### Groups
- `GET /groups/my-groups` - Get user's groups (with pagination)
- `POST /groups/create` - Create new group
- `DELETE /groups/:groupId/delete` - Delete group
- `GET /groups/:groupId/expenses` - Get group expenses
- `GET /groups/:groupId/settlements` - Get group settlements
- `GET /groups/:groupId/total-owed` - Get total owed by user
- `GET /groups/:groupId/total-is-owed` - Get total owed to user
- `GET /groups/:groupId/people-i-owe` - Get creditors list
- `POST /groups/:groupId/add-members` - Add members to group

#### Expenses
- `POST /groups/:groupId/expenses` - Create expense
- `GET /groups/:groupId/expenses` - Get expenses

#### Settlements
- `POST /groups/:groupId/settlements` - Create settlement
- `GET /settlements/user/` - Get user's settlements

#### Dashboard
- `GET /dashboard/summary` - Get dashboard summary
- `GET /dashboard/grouped-by-category` - Get category-wise spending
- `GET /dashboard/quick-settle` - Get quick settle debts
- `GET /dashboard/quick-receive` - Get quick receive credits

#### Users
- `GET /user/` - Get users list
- `POST /user/` - Create user
- `PUT /user/:userId` - Update user
- `DELETE /user/:userId` - Delete user

#### Profile & Payments
- `GET /profile/get-user-info` - Get user info
- `POST /payments/create-order` - Create payment order
- `POST /payments/verify-order` - Verify payment order
- `POST /payments/create-subscription` - Create subscription
- `POST /payments/capture-subscription` - Capture subscription



## 🗺 Routing

The application uses React Router DOM v6 for client-side routing.

### Route Structure

```
/                    → Home (Landing page)
/login               → Login page
/register            → Registration page
/reset-password      → Password reset page
/dashboard           → Dashboard (protected)
/groups              → Groups listing (protected)
/groups/:groupId     → Group details (protected)
/balances            → Balances page (protected)
/transactions        → Transactions page (protected)
/profile             → User profile (protected)
/manage-users        → User management (protected)
/manage-payments      → Payment management (protected)
/manage-subscriptions → Subscription management (protected)
```

### Route Protection

Routes are protected by checking `userDetails` in Redux store:

```jsx
<Route
  path="/dashboard"
  element={
    userDetails
      ? <UserLayout><Dashboard /></UserLayout>
      : <Navigate to="/login" />
  }
/>
```

### Navigation

Use React Router's `useNavigate` hook:

```javascript
import { useNavigate } from 'react-router-dom';

const navigate = useNavigate();
navigate('/dashboard');
```



---

**Built with ❤️ using React and modern web technologies**
