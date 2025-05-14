# UTech Housing Platform

A modern web application for managing property rentals, connecting landlords with potential tenants, and streamlining the property viewing process.

## Features

- 🏠 Property listing and management
- 👥 Separate interfaces for landlords and tenants
- 💬 Messaging system for communication
- 📅 Property viewing scheduling
- 📊 Landlord dashboard
- 🔐 Secure authentication
- 📱 Responsive design
- 🌙 Dark/Light mode support

## Tech Stack

- **Framework**: Next.js 15+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Backend**: Firebase
  - Authentication
  - Firestore Database
  - Cloud Storage
- **Image Management**: Cloudinary
- **Form Handling**: React Hook Form with Zod validation
- **State Management**: React Context

## Prerequisites

- Node.js 18+ 
- npm/yarn
- Firebase account
- Cloudinary account

## Getting Started

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd utech-housing
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Copy `.env.example` to `.env.local` and fill in your environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable UI components
- `/contexts` - React context providers
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configurations

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Copyright © 2024 CampusConnect. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited without the express permission of CampusConnect.