# Q Tea Cafe — website, ordering and cafe management

One cafe, one database, one backend (modelled on The Minerva codebase, rebranded for Q Tea Cafe).
`server/` Express + Prisma + PostgreSQL · `web/` React + Vite + Tailwind + Motion · `docs/` guides.
Brand: forest green + copper from the logo (`web/public/logo.png`, `logo-mark.png`, `favicon.svg`).

## Run locally (Node 18+; Docker optional)

```bash
cd server && npm install
cp .env.example .env
npm run db:local          # embedded PostgreSQL on :5433 (or use your own / docker compose up db)
npm run db:push           # create tables (production uses `npm run db:deploy` migrations)
npm run db:seed:demo      # demo staff, sample items, tables (use `db:seed` for a clean production seed)
npm run db:seed:menu      # Q Tea Cafe starter menu: chai, teas, coolers, coffee, snacks, bakes
npm run dev               # API on :4000, docs at /api/docs

cd ../web && npm install && npm run dev    # site on http://localhost:5173, admin at /admin/login
```

Demo logins (password `QTea@12345`): admin@ / manager@ / kitchen@ / waiter@ / cashier@ / driver@ `qteacafe.com`.
Demo data and menu prices are placeholders — enter the real address, hours, menu and photos in the dashboard.
`db:seed:demo` also loads a few fixture dishes (Tomato Soup, Roast Chicken…) that the automated tests rely on; remove them in the dashboard before launch.

## Tests, production, integrations
Same as the reference project: `cd server && npm test`, `cd web && npm test`, `npm run e2e`; `docker compose up --build`; see `docs/`.
Defaults still carried over and worth reviewing in Settings: timezone/currency (Asia/Singapore, SGD), tax 9%, service charge 10%, delivery zones.
