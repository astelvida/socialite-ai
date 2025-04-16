# Instagram API Integration

This project demonstrates how to integrate Instagram API with Instagram Login (for Business accounts) in a Next.js application.

## Features

- Instagram authentication using Instagram Login flow
- Display user profile information
- Fetch and display Instagram media
- Reusable Instagram feed component

## Prerequisites

- An Instagram Professional account (Business or Creator)
- A registered Instagram application in the Meta Developer Portal

## Setup

1. Clone the repository and install dependencies:

```bash
npm install
# or
yarn
# or
pnpm install
```

2. Create a `.env.local` file in the root directory with your Instagram API credentials:

```env
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/callback/instagram
```

3. Configure your Instagram App:

   - Go to [Meta Developer Portal](https://developers.facebook.com/)
   - Create a new app or use an existing one
   - Add the Instagram Basic Display product to your app
   - Add the following to Valid OAuth Redirect URIs:
     - `http://localhost:3000/api/instagram/callback`
   - Copy your App ID and App Secret to your `.env.local` file

4. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Access the Instagram integration page at: `http://localhost:3000/instagram`

## Usage

### Authentication

1. Visit the `/instagram` page
2. Click "Login with Instagram"
3. Complete the Instagram authentication flow
4. You'll be redirected back to the app where your profile and media will be displayed

### Instagram Feed Component

Use the `InstagramFeed` component in any page:

```jsx
import { InstagramFeed } from "@/components/instagram/InstagramFeed";

export default function YourPage() {
  return (
    <div>
      <h1>Your Instagram Feed</h1>
      <InstagramFeed limit={6} />
    </div>
  );
}
```

#### Props

- `limit` (optional): Number of media items to display (default: 6)
- `username` (optional): Filter media by specific username

## How It Works

1. The app redirects users to Instagram's authorization page
2. Instagram redirects back with an authorization code
3. The app exchanges this code for an access token
4. Using the access token, the app requests the user's profile and media
5. The data is stored in localStorage for use across the application
6. The InstagramFeed component can access this data from localStorage

## Limitations

- Requires an Instagram Professional account (Business or Creator)
- Access tokens expire, so you might need to implement a refresh token mechanism for production use
- Due to Instagram API restrictions, certain features may require additional app review

## API Endpoints

The following API endpoints are available:

- `/api/instagram/auth`: Redirects to Instagram authorization page
- `/api/instagram/callback`: Handles the callback from Instagram after authorization

## Resources

- [Instagram API Documentation](https://developers.facebook.com/docs/instagram-platform)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/)
