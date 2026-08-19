# entity-module — Product (PartLink)

Backend module for **PartLink**, an online marketplace connecting buyers and sellers of car spare parts in Egypt. Built with Node.js, Express, and MongoDB (Mongoose).

## Features Implemented

- Full CRUD for the `Product` entity (Create, Read all, Read one, Update, Delete)
- **Image upload with Multer** — sellers can attach a product photo when creating or updating a product
  - Images are stored on disk in the `/uploads` folder with a unique filename (timestamp + random suffix) to avoid collisions
  - Only image files are accepted (`jpeg`, `jpg`, `png`, `webp`), max 5MB, enforced via Multer's `fileFilter` and `limits`
  - The saved filename is stored on the `image` field of the Product document
  - Uploaded images are served statically at `/uploads/<filename>` so they can be viewed directly in the browser or embedded in a frontend `<img>` tag
- All routes use `async/await` with `try/catch` and return consistent JSON responses

## Entity Chosen: Product

I chose **Product** because it is the core entity of PartLink — every buyer search, seller listing, order, and review revolves around it. Getting the Product CRUD right first makes it straightforward to layer Category, Order, and User modules on top later.

### Product Fields

| Field | Type | Notes |
|---|---|---|
| `name` | String | Product name, required |
| `description` | String | Product description, required |
| `category` | String | Enum: Engine, Brakes, Suspension, Electrical, Body, Other |
| `price` | Number | Required, minimum 0 |
| `carMake` | String | e.g. Toyota, Hyundai |
| `carModel` | String | e.g. Corolla, Elantra |
| `carYear` | Number | Compatible model year |
| `stock` | Number | Inventory count, defaults to 0 |
| `image` | String | Filename of the uploaded product image (set automatically by Multer), null if none |
| `createdAt` / `updatedAt` | Date | Auto-managed via Mongoose timestamps |

## Routes Summary

Base path: `/products`

| Method | Route | Description |
|---|---|---|
| POST | `/products` | Create a new product |
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get a single product by ID |
| PATCH | `/products/:id` | Update a product by ID |
| DELETE | `/products/:id` | Delete a product by ID |

All routes use `async/await` with `try/catch` and return JSON in the shape `{ success, data|message }`.

## How to Run Locally

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Copy `.env.example` to `.env` and adjust if needed:
   ```bash
   cp .env.example .env
   ```
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/partlink
   ```
   Make sure MongoDB is running locally, or use a MongoDB Atlas connection string instead.

3. **Start the server**
   ```bash
   npm run dev
   ```
   (or `npm start` if you don't have nodemon set up)

4. **Test the API**
   Server runs at `http://localhost:5000`.

## API Usage Examples (Postman)

**Create a product with an image** — `POST http://localhost:5000/products`
Set the request body type to `form-data` (not raw JSON, since we're sending a file). Add each field as a text key, plus one file key:
- `name` (text) → e.g. "Front Brake Pad Set"
- `description` (text) → e.g. "OEM-quality ceramic brake pads"
- `category` (text) → e.g. "Brakes"
- `price` (text) → e.g. "850"
- `carMake` (text) → e.g. "Toyota"
- `carModel` (text) → e.g. "Corolla"
- `carYear` (text) → e.g. "2018"
- `stock` (text) → e.g. "25"
- `image` (file) → attach a `.jpg`/`.png`/`.webp` file from your computer

The response returns the created product with an `image` field containing the stored filename. You can view the uploaded image by visiting `http://localhost:5000/uploads/<that filename>` in a browser.

**Get all products** — `GET http://localhost:5000/products` (no body needed)

**Get one product** — `GET http://localhost:5000/products/:id` (replace `:id` with a real product `_id`)

**Update a product (optionally replacing the image)** — `PATCH http://localhost:5000/products/:id`
Same as create: use `form-data`, include only the fields you want to change, and attach a new `image` file if you want to replace the existing photo.

**Delete a product** — `DELETE http://localhost:5000/products/:id`

Screenshots of Postman requests/responses for each route (including the file upload) are in the `/screenshots` folder (add your own after testing locally).

## Next Steps

This module will be extended with role-based access on product routes and user profile photos (via Multer) in a later stage.

---

## Backend Module: Authentication (auth-module)

### What This Module Does

Adds a `User` model plus signup/login routes with hashed passwords and JWT-based authentication, so future routes (like `/products`) can be restricted by logged-in user and role.

### User Roles Chosen

- **admin** — manages users, products, and categories
- **seller** — creates and manages their own product listings
- **buyer** — browses and orders products (default role if none is specified)

### User Fields

| Field | Type | Notes |
|---|---|---|
| `name` | String | Required |
| `email` | String | Required, unique, lowercased |
| `password` | String | Required, min 6 chars, hashed with bcryptjs, never returned in queries by default |
| `role` | String | Enum: admin, seller, buyer — defaults to buyer |
| `phone` | String | Optional |
| `createdAt` / `updatedAt` | Date | Auto-managed via Mongoose timestamps |

### Routes Summary

| Method | Route | Description |
|---|---|---|
| POST | `/signup` | Register a new user, returns a JWT token |
| POST | `/login` | Authenticate an existing user, returns a JWT token |
| GET | `/me` | Protected route — returns the logged-in user's data (requires a valid token) |
| GET | `/users/profile` | Protected route — same as `/me`, example of a named protected resource (requires a valid token) |

### How Authentication Works

- Passwords are hashed with `bcryptjs` before being saved — the plain password is never stored
- On successful signup or login, a JWT is generated with the user's id and role, signed using `JWT_SECRET`, expiring in 7 days

### Route Protection Middleware

`middleware/authMiddleware.js` guards any route it's attached to (currently `/me` and `/users/profile`, as an example — apply it to any future route the same way):

1. Reads the `Authorization` header off the incoming request
2. Expects the format `Bearer <token>` and extracts just the token part
3. Verifies the token using `jwt.verify()` and `JWT_SECRET` — rejects with a 401 if missing, invalid, or expired
4. On success, attaches the decoded payload (`{ id, role }`) to `req.user` so the route handler knows who's calling and what role they have
5. Calls `next()` to let the request continue to the actual route handler

### API Usage Examples (Postman)

**Register a user** — `POST http://localhost:5000/signup`
Body → raw JSON:
```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@example.com",
  "password": "password123",
  "role": "seller",
  "phone": "0100000000"
}
```
Response includes a `token` — copy it for the next steps.

**Login** — `POST http://localhost:5000/login`
Body → raw JSON:
```json
{
  "email": "ahmed@example.com",
  "password": "password123"
}
```
Returns a fresh `token` on success. Using a wrong password or unregistered email returns a 401 with an "Invalid email or password" message.

**Access a protected route** — `GET http://localhost:5000/users/profile` (or `GET /me`, same behavior)
In Postman, go to the Authorization tab, choose type "Bearer Token", and paste in the token from signup/login. The middleware verifies it and returns the logged-in user's data. Without a valid token (missing, malformed, or expired), this route returns a 401.

Screenshots of the signup, login (success + failure), and protected-route requests (with and without a token) are in the `/screenshots` folder.
