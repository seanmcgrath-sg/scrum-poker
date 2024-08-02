# Scrum Poker App

This is a Scrum Poker application built using the [T3 Stack](https://create.t3.gg/), which includes Next.js, NextAuth.js, Prisma, Drizzle, Tailwind CSS, and tRPC.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- Yarn

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/scrum-poker.git
   cd scrum-poker
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=your_nextauth_url
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

### Running the App

1. Generate Prisma client:
   ```sh
   yarn db:generate
   ```

2. Start the development server:
   ```sh
   yarn dev
   ```

### Deployment

Follow the deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify), and [Docker](https://create.t3.gg/en/deployment/docker).

## Learn More

To learn more about the T3 Stack, check out the following resources:
- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available)

## Contributing

Contributions are welcome! Please check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) for more information.

## License

This project is licensed under the MIT License.