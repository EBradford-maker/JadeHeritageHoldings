# Jade Heritage Holdings — Website

Premium corporate website for Jade Heritage Holdings.

## Local Development

```bash
npm run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel
1. Push to a Git repo (or drag & drop the folder)
2. Vercel auto-detects as static — `vercel.json` is included
3. Set custom domain: `JadeHeritageHoldings.com`

### Netlify
1. Drag the project folder into Netlify dashboard, or connect a repo
2. `netlify.toml` handles configuration
3. Set custom domain in site settings

### Any Static Host
Just serve the root folder. No build step required.

## Structure

```
├── index.html        # Full single-page site
├── styles.css        # All styles
├── script.js         # Animations, nav, scroll effects
├── assets/
│   └── logo.png      # Jade Heritage Holdings logo
├── package.json      # Dev server script
├── vercel.json       # Vercel config
├── netlify.toml      # Netlify config
└── README.md         # This file
```

## Tech

- Static HTML / CSS / JS — no framework, no build step
- Google Fonts (Playfair Display + Inter)
- Intersection Observer for scroll animations
- Fully responsive (mobile-first)
- ~55KB total (excluding logo image)

## License

© 2025 Jade Heritage Holdings. All rights reserved.
