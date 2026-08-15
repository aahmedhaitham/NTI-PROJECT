# PartLink – Online Marketplace for Car Spare Parts

## Project Description

PartLink is a web-based marketplace that connects buyers of car spare parts with sellers across Egypt. Buyers can search for spare parts by car make, model, year, and category, while sellers can list and manage their products. Administrators manage users, categories, and listings to ensure a secure and organized platform.

---

## User Roles

### Admin
- Manage users
- Approve or suspend sellers
- Manage products and categories
- View and manage all orders
- Moderate listings

### Seller
- Create, edit, and delete product listings
- Upload product images
- Manage inventory
- View and process customer orders

### Buyer
- Register and log in
- Browse and search products
- Add products to cart
- Place orders
- Track orders
- Leave reviews and ratings

---

## Features (Full Project Scope)

### Authentication
- Register
- Login
- Logout
- Forgot Password
- Email Verification

### Authorization
- Role-based access control
- Admin Dashboard
- Seller Dashboard
- Buyer Dashboard
- Protected routes

### CRUD Operations
- Products (Create, Read, Update, Delete)
- Categories (Create, Read, Update, Delete)
- Orders (Create, Read, Update, Cancel)
- Users (Admin Management)
- Reviews (Create, Read, Delete)

### Image & File Upload
- User profile images
- Product images
- Seller verification documents

---

## Main Pages

- Home Page
- Login Page
- Register Page
- Product Listing Page
- Product Details Page
- Shopping Cart
- Buyer Dashboard
- Seller Dashboard
- Admin Dashboard
- Add/Edit Product Page
- User Management Page
- Category Management Page

---

## UI Design

Figma Design:
https://www.figma.com/design/xFvbtM7asvtV7tBJ2TKIOM/Untitled?node-id=1-3&t=fhcjtSXjdubA53Ei-1

---

## Backend Module Progress: Product (entity-module)

This is the first backend module built toward the full project above, using Node.js, Express, and MongoDB (Mongoose).

### Features Implemented

- Full CRUD for the `Product` entity (Create, Read all, Read one, Update, Delete)
- **Image upload with Multer** — sellers can attach a product photo when creating or updating a product
  - Images are stored on disk in the `/uploads` folder with a unique filename (timestamp + random suffix) to avoid collisions
  - Only image files are accepted (`jpeg`, `jpg`, `png`, `webp`), max 5MB, enforced via Multer's `fileFilter` and `limits`
  - The saved filename is stored on the `image` field of the Product document
  - Uploaded images are served statically at `/uploads/<filename>` so they can be viewed directly in the browser or embedded in a frontend `<img>` tag
- All routes use `async/await` with `try/catch` and return consistent JSON responses

### Entity Chosen: Product

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

### Routes Summary

Base path: `/products`

| Method | Route | Description |
|---|---|---|
| POST | `/products` | Create a new product |
| GET | `/products` | Get all products |
| GET | `/products/:id` | Get a single product by ID |
| PATCH | `/products/:id` | Update a product by ID |
| DELETE | `/products/:id` | Delete a product by ID |

All routes use `async/await` with `try/catch` and return JSON in the shape `{ success, data|message }`.

### How to Run Locally

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

### API Usage Examples (Postman)

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

Screenshots of Postman requests/responses for each route (including the file upload) are in the `/screenshots` folder.

### Next Steps

This module will be extended with user authentication (register/login/JWT) and role-based access control (Admin/Seller/Buyer) in a later stage.
