<div align="center">
  <img src="public/logo-light.svg" alt="knowy" width="150"/>
  


  Quiz platform with AI cheating prevention

</div>

## About

knowy is a quiz application built for educators to create and manage quizzes with built-in anti-cheating mechanisms focused on preventing AI-assisted cheating.

## Tech Stack

- **Next.js 15** - React framework
- **Convex** - Real-time backend
- **Clerk** - Authentication
- **Google Gemini** - AI question generation
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm
- Convex account
- Clerk account
- Google AI API key

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/quiz-app.git
   cd quiz-app
   ```

2. Install dependencies
   ```bash
   pnpm install
   ```

3. Set up environment variables
   ```env
   NEXT_PUBLIC_CONVEX_URL=your_convex_url
   CLERK_JWT_ISSUER_DOMAIN=your_clerk_jwt_issuer_domain
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key
   ```

4. Run Convex
   ```bash
   npx convex dev
   ```

5. Start development server
   ```bash
   pnpm dev
   ```


## License

MIT License - see [LICENSE.md](LICENSE.md)
