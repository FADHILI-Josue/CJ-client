# Credit Jambo - Client Application

A modern savings management system for customers of Credit Jambo Ltd, built with React, TypeScript, and Tailwind CSS.

## Features

- 🔐 **Secure Authentication**: SHA-512 password hashing with JWT tokens
- 📱 **Device Verification**: Admin-approved device access for enhanced security
- 💰 **Savings Operations**: Deposit and withdraw funds with transaction history
- 📊 **Dashboard**: Real-time balance and transaction monitoring
- 🔔 **Notifications**: Low balance alerts and transaction confirmations
- 🎨 **Modern UI**: Clean, responsive design with Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Prerequisites

- Node.js 18+
- pnpm package manager
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/FADHILI-Josue/CJ-client.git client-app
   cd client-app/frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your configuration:
   ```env
   VITE_API_BASE_URL=http://localhost:5001/api
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── store/         # Zustand stores
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Utility functions
│   └── types/         # TypeScript type definitions
├── public/            # Static assets
└── dist/              # Build output
```

## Key Features Implementation

### Authentication Flow
1. User registers with email, full name, and password
2. Device ID is automatically generated and stored
3. Registration creates a pending device verification request
4. Admin must approve the device before login is allowed
5. JWT token issued upon successful login

### Savings Operations
- **Deposit**: Add funds to account with transaction logging
- **Withdraw**: Remove funds with balance validation
- **History**: View all transactions with filtering options

### Security Features
- Device-based access control
- JWT token authentication
- Input validation and sanitization
- Rate limiting (handled by backend)

## API Integration

The frontend communicates with the backend API at `/api`:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/account/me` - Get account details
- `POST /api/account/deposit` - Deposit funds
- `POST /api/account/withdraw` - Withdraw funds

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Implement proper error handling

### State Management
- Use Zustand for global state
- Keep components focused and reusable
- Implement proper loading and error states

### Styling
- Use Tailwind CSS utility classes
- Maintain consistent design system
- Ensure responsive design

## Deployment

1. **Build the application**
   ```bash
   pnpm build
   ```

2. **Serve the dist folder**
   ```bash
   pnpm preview
   ```

For production deployment, serve the `dist` folder with any static file server.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:5001/api` |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow the existing code style
2. Write clear, concise commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is part of Credit Jambo Ltd's internal systems.

## Support

For support, contact the development team at Credit Jambo Ltd.

---

**Credit Jambo Ltd**  
NM 233 St, Nyamagumba  
Musanze – Rwanda  
+250 788 268 451  
hello@creditjambo.com  
www.creditjambo.com