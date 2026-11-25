# NCDL — Neuromorphic Chip Design Laboratory

A full-stack academic laboratory website built with **Next.js (App Router)**, **Server Actions**,
**Tailwind CSS**, **Drizzle ORM** and a **local PostgreSQL** database.

It covers every module in the brief: Home, Members (professors, PhD, master's, alumni,
collaborations), Research (four areas with objectives, methodologies, projects and papers),
Publications (journals, conferences, chip design, workshops, certificates with search and year
grouping), News, Contact — plus a role-based admin panel for all of it.

## Stack

| Layer | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, React 19) |
| Mutations | Next.js Server Actions |
| Styling | Tailwind CSS v4 (design tokens in `src/app/globals.css`) |
| Data | Drizzle ORM + `node-postgres` |
| Database | PostgreSQL 18 on `localhost:5432` |
| Auth | scrypt password hashing + HMAC-signed httpOnly session cookie |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

The `.env` file already points at the local database:

```
DATABASE_URL=postgresql://postgres:mdimranh@localhost:5432/ncdl
SESSION_SECRET=<change-me-in-production>
UPSTASH_BLOB_TOKEN=<upstash-blob-bucket-token>
```

### Database

The `ncdl` database has already been created and migrated. To rebuild it from scratch:

```bash
npx drizzle-kit generate     # regenerate SQL from src/db/schema.ts
npx drizzle-kit migrate      # apply migrations
npx tsx --env-file=.env src/db/seed.ts
```

The seed is idempotent: it clears the content tables and re-inserts the demo dataset
(3 faculty, 4 PhD, 5 MSc, 5 alumni, 5 partners, 4 research areas, 6 projects,
22 publication records, 6 news articles, 5 positions, 5 carousel photos).

## Accounts

| Role | Email | Password | Can do |
| --- | --- | --- | --- |
| Administrator | `admin@ncdl-lab.org` | `admin1234` | Everything, including members, gallery, positions, collaborations and site settings |
| Professor / Researcher | `faculty@ncdl-lab.org` | `faculty1234` | Create and edit research areas, projects, publications and news |

Sign in at `/login`. Sessions last seven days and are signed with `SESSION_SECRET`.

> These are demo credentials for a local development database. Change the passwords
> (or re-seed with new ones) before exposing the site anywhere.

## Admin panel

| Route | Purpose |
| --- | --- |
| `/admin` | Dashboard with counts and recent activity |
| `/admin/members` | Add, edit, hide or delete members (photo upload, education, experience, patents, projects, links) |
| `/admin/research` | Research areas with objectives, methodologies, keywords, icon |
| `/admin/projects` | Ongoing/completed projects, funding, partners, featured flag |
| `/admin/publications` | Journal, conference, chip, workshop and certificate records |
| `/admin/news` | Articles with drafts, header image and publish date |
| `/admin/positions` | Open positions shown on the home and contact pages |
| `/admin/gallery` | Home page carousel photos (upload or reuse a path) |
| `/admin/collaborations` | Partner institutions on the members page |
| `/admin/settings` | Lab identity, motto, mission, address, phone, fax, email, map query, socials |

Every save revalidates the affected public routes, so changes appear immediately.

## Project structure

```
src/
  app/
    (site)/            public pages (shared header/footer layout)
      page.tsx           home: carousel, mission, research, projects, news, positions
      members/           directory + individual profiles
      research/          area index + dedicated area pages
      publications/      searchable archive grouped by year
      news/             article index + detail pages
      contact/           address, phone, email, fax, map, applications
    admin/             dashboard, resource lists, editors, server actions
    login/             staff sign-in
  components/
    site/              public UI (header, carousel, cards, avatars)
    admin/             admin chrome, form primitives, delete control
  db/
    schema.ts          Drizzle schema for the whole site
    seed.ts            demo content
    index.ts           pooled client
  lib/
    auth.ts            sessions and guards
    content.ts         cached site settings
    site-config.ts     client-safe nav and label constants
    upload.ts          image upload handling
```

## Notes

- **Uploads** go to [Upstash Blob](https://upstash.com/blob) through `UPSTASH_BLOB_TOKEN`
  and are stored under the `uploads/` prefix; the saved member/gallery/news URL is the
  bucket's public CDN URL. The bucket must be **public**, otherwise uploads are rejected
  (a private bucket returns no URL). Keep the token server-side — it can read and write the
  whole bucket.
- **Images** shipped with the seed (`public/images/lab/*.svg`) are designed placeholders,
  not photographs. Replace them from `/admin/gallery`.
- **Auth** is deliberately lightweight for a single-lab CMS. Add rate limiting, password
  reset and audit logging before exposing the admin panel publicly.
- **Map** uses a Google Maps embed via a place query (`mapQuery` in settings), so no API
  key is required.
