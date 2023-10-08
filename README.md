# Strava Tools
I built this app with the initial intention of streamlining my training log writing process as a member of the Wisconsin Badgers cross country and track teams.

## What it Does
- Weekly Training Log text and email generator from Strava activities
- Customizable email inputs including recipients, subject line, signature
- Customizable rounding and round-up thresholds
- Download Strava activities to JSON or CSV
- Sign in with Google for authentication

## How I built it
- Frontend and backend built with Next.js (and inherently React.js) using the App Directory structure
- NextAuth for Google account authentication
- Supabase relational database with Prisma ORM allowing API routes in the App Directory to perform CRUD operations

## What's Next
- Other tools, including CSV/JSON generation, data visualizations
- More customizability
- Bug fixes, particularly with server-side rendering issues
- Loading/error states for server-side rendering