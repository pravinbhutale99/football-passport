# Football Passport 🌍⚽

**The Complete Football Travel Companion**

> Everything a football fan needs—from buying a ticket to reaching the stadium.

---

## Stack

- **Next.js 14** — React framework
- **Tailwind CSS 3** — Utility-first styling
- **Google Fonts** — Playfair Display + Inter + Space Mono
- **Pure SVG** — World map, stadium silhouette (no external map APIs)

---

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### Option 2: GitHub + Vercel Dashboard
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repo — Vercel auto-detects Next.js
4. Click **Deploy**

No environment variables needed for the landing page.

---

## Sections

| Section | Description |
|---|---|
| Nav | Fixed, transparent → frosted on scroll |
| Hero | Full-screen with SVG world map + stadium silhouette |
| Stats | 4-column stat grid |
| Features | 6-card feature grid |
| How It Works | 3-step explainer |
| Roadmap | Timeline to 2026 |
| Coming Soon / Waitlist | Email capture with confirmation state |
| Footer | Links + copyright |

---

## Customisation

- **Colours**: Edit `tailwind.config.js` → `theme.extend.colors`
- **Copy**: All text is inline in `pages/index.js`
- **Waitlist email**: Connect the `handleSubmit` function to your email service (Mailchimp, Resend, etc.)
- **Favicon**: Replace `/public/favicon.ico`

---

## License

MIT
