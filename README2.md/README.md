# 🚀 Product API – Express.js CRUD Project

This project is a RESTful API built using Express.js. It supports standard CRUD operations on a `products` resource, includes middleware for logging, authentication, validation, and custom error handling, and implements advanced features like filtering, pagination, search, and statistics.



// Setup Instructions

1. Clone the repository
   ```bash
   git clone <your-github-repo-url>
   cd express-week2-api
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`
   ```
   PORT=3000
   API_KEY=mysecretkey123
   ```

4. Run the server
   ```bash
   node server.js
   ```


// API Endpoints

// Public Routes

| Method | Route                    | Description                                     |
|--------|--------------------------|-------------------------------------------------|
| GET    | `/api/products`          | List all products (supports filtering & search) |
| GET    | `/api/products/:id`      | Get a product by ID                             |
| GET    | `/api/products/stats`    | Get product statistics by category              |

// Query Parameters for `/api/products`

- `category` → filter by category (e.g. `?category=kitchen`)
- `search` → search by product name (e.g. `?search=laptop`)
- `page` → paginate results (default: 1)
- `limit` → limit number of results (default: 10)

---

// Protected Routes (require API key)

All protected routes must include a header:
```
x-api-key: mysecretkey123
```

| Method | Route                    | Description             |
|--------|--------------------------|-------------------------|
| POST   | `/api/products`          | Create a product        |
| PUT    | `/api/products/:id`      | Update a product        |
| DELETE | `/api/products/:id`      | Delete a product        |

---

// Product Schema

Each product has the following structure:

```json
{
  "id": "string (UUID)",
  "name": "string",
  "description": "string",
  "price": "number",
  "category": "string",
  "inStock": "boolean"
}


//Example Requests

//Create a Product
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: mysecretkey123" \
  -d '{
    "name": "Fan",
    "description": "Portable electric fan",
    "price": 300,
    "category": "electronics",
    "inStock": true
  }'
```

//Get Products
```bash
curl http://localhost:3000/api/products
```

// Get Product Stats
```bash
curl http://localhost:3000/api/products/stats


