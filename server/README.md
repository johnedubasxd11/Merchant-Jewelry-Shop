# Merchant Backend (simple demo)

This is a minimal Express backend to power the demo storefront.

API endpoints

- GET /api/products - list products
- GET /api/products/:id - product details
- POST /api/auth/login - login with { identifier, password } (any credentials accepted in demo). Returns { token, profile }
- GET /api/auth/profile - get profile from Authorization: Bearer <token>
- POST /api/orders - create order { items, total, customerEmail }
- GET /api/orders - list orders; if Authorization header provided, filters to that customer's orders

Quick start (PowerShell)

```powershell
cd server
npm install
# Create a .env file from the example and set a JWT_SECRET (at least 32 chars)
copy .env.example .env
npm run dev
```

The server will run on http://localhost:4000 by default (or the port set in your `.env`).

Notes

- This is a demo backend that stores orders in a JSON file under `server/data/orders.json` when MongoDB is not configured. It's not production-ready.
- Authentication uses JWT tokens signed with `JWT_SECRET`. For development, set a long random string in your `.env`. Do not commit `.env` to source control.

Frontend integration

- The frontend reads the API base URL from the Vite env `VITE_API_URL` (or falls back to `http://localhost:4000/api`).
- To run the frontend using the backend locally, create a `.env` file at the project root with:

```
VITE_API_URL=http://localhost:4000/api
```

Then from the project root run your frontend dev server (Vite):

```powershell
npm install
npm run dev
```

This will make the frontend call the backend endpoints for products, auth, and orders.
