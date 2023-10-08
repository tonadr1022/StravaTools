# Strava Tools
I built this app with the initial intention of streamlining my training log writing process as a member of the Wisconsin Badgers cross country and track teams.
You can use it live at [strava-tools.vercel.app](https://strava-tools.vercel.app/)

## What it Does
- Weekly Training Log text and email generator from Strava activities using the Strava API
- Customizable email inputs including recipients, subject line, signature
- Customizable rounding and round-up thresholds
- Download Strava activities to JSON or CSV
- Sign in with Google for authentication

## How I built it
- Frontend and backend built with Next.js (and inherently React.js) using the App Directory structure
- NextAuth for Google account authentication
- Supabase relational database with Prisma ORM allowing API routes in the App Directory to perform CRUD operations

## Demo
https://github.com/tonadr1022/StravaTools/assets/126039668/e1b8bcf1-781b-4faa-b3c2-6315c658ac03


## What's Next
- Use of Strava private notes to populate run descriptions
- Other tools, including CSV/JSON generation, data visualizations
- More customizability
- Bug fixes, particularly with server-side rendering issues
- Loading/error states for server-side rendering
