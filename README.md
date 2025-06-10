# 🛍️ E-commerce Sales Chatbot

A full-stack, responsive e-commerce chatbot application that allows users to interact with a smart assistant to search, filter, and explore products in a natural way. This project features a Flask backend with PostgreSQL and a modern React + Tailwind CSS frontend.

---

## 📌 Table of Contents

- [🚀 Features](#-features)
- [🧱 Tech Stack](#-tech-stack)
- [🧠 Architecture Overview](#-architecture-overview)
- [📁 Folder Structure](#-folder-structure)
- [⚙️ Setup & Installation](#️-setup--installation)
- [📡 API Endpoints](#-api-endpoints)
- [🔐 Authentication](#-authentication)
- [📈 Challenges & Learnings](#-challenges--learnings)
- [📌 Potential Improvements](#-potential-improvements)

---

## 🚀 Features

- 🔐 Secure user authentication using JWT
- 💬 Chatbot interface to search and explore products
- 🛍️ Mock inventory with filtering and search
- 🧠 Session tracking with timestamps
- 🌐 RESTful API integration between frontend and backend
- 📱 Responsive design for all screen sizes

---

## 🧱 Tech Stack

| Layer     | Technology                |
| --------- | ------------------------- |
| Frontend  | React + Vite, TailwindCSS |
| Backend   | Flask                     |
| Auth      | JWT, Flask-JWT-Extended   |
| Database  | PostgreSQL                |
| Dev Tools | VSCode, Postman, dotenv   |

---

## 🧠 Architecture Overview

\`\`\`text
Frontend (React + Tailwind)
|
|---> Axios (REST API, JWT)
|
Backend (Flask)
|
|---> PostgreSQL (Product + User Data)
\`\`\`

---

## 📁 Folder Structure

\`\`\`plaintext
Ecommerce-sales-chatbot/
├── backend/
│ ├── routes/
│ ├── .env
│ ├── app.py
│ ├── blacklist.py
│ ├── config.py
│ ├── models.py
│ ├── requirements.txt
├── frontend/
│ ├── public/
│ ├── src/
│ ├── .env
│ ├── vite.config.js
│ ├── index.html
├── .gitignore
├── README.md
\`\`\`

---

## ⚙️ Setup & Installation

### Backend (Flask + PostgreSQL)

\`\`\`bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt

# Create .env file

# for backend

DB_USER=example_user
DB_PASSWORD=example_pass
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_chatbot_db
JWT_SECRET_KEY=supersecretkey123

# for frontend

FRONTEND_URL=http://localhost:5173

# Run server

flask run
\`\`\`

### Frontend (React + Vite + Tailwind)

\`\`\`bash
cd frontend
npm install

# Start development server

npm run dev
\`\`\`

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint    | Description               |
| ------ | ----------- | ------------------------- |
| POST   | `/register` | Register a new user       |
| POST   | `/login`    | Log in and receive JWT    |
| POST   | `/logout`   | Log out and blacklist JWT |
| GET    | `/me`       | Get current user details  |

---

### 🛒 Cart Management

| Method | Endpoint                          | Description                              |
| ------ | --------------------------------- | ---------------------------------------- |
| GET    | `/cart/items`                     | Get all items in the user's cart         |
| POST   | `/cart/add`                       | Add a product to the cart                |
| DELETE | `/cart/remove/<int:product_id>`   | Remove a product from the cart           |
| PUT    | `/cart/<int:product_id>/quantity` | Update quantity of a product in the cart |

---

### 🛍️ Product Browsing

| Method | Endpoint            | Description                            |
| ------ | ------------------- | -------------------------------------- |
| GET    | `/products`         | Get all products or search using `?q=` |
| GET    | `/product/<int:id>` | Get a single product by its ID         |
| GET    | `/categories`       | List all product categories            |

---

## 🔐 Authentication

- User credentials stored with hashed passwords.
- JWTs issued on login and required for all protected routes.
- A blacklist.py module is used to invalidate tokens upon logout.

\`\`\`python

# blacklist.py

BLACKLIST = set()
\`\`\`

---

## 📈 Challenges & Learnings

| Challenge          | Solution                                     |
| ------------------ | -------------------------------------------- |
| CORS Issues        | Used Flask-CORS with dynamic origin via .env |
| Token Invalidation | Implemented token blacklist after logout     |
| Responsive Design  | TailwindCSS utilities for adaptive layout    |

---

## 📌 Potential Improvements

- Add real-time chat with WebSockets
- Integrate payment simulation flow
- Improve chatbot with NLP or LLMs
- Admin panel for product management
- Persistent chat history with filters
