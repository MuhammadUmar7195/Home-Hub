# 🏠 Real Estate Listing App

This is a full-stack real estate web application where users can **list properties** for **rent or sale**. The platform provides a smooth user experience with features like Google OAuth authentication, secure password management, and efficient image uploads.

---

## 🚀 Tech Stack

### Frontend
- **Vite + React.js** – Fast and modern frontend framework
- **Tailwind CSS** – Utility-first styling
- **Redux** – State management
- **Google OAuth** – User authentication
- **Supabase** – Image upload handling

### Backend
- **Node.js + Express.js** – RESTful API backend
- **MongoDB** – NoSQL database
- **jsonwebtoken** – For authentication via cookies
- **argon2** – Password hashing for security

---

## 🔧 How to Run the Project

### 1. Clone the Repository
```bash
git clone your_project_url

# 2. Setup Frontend
```bash
cd client
npm install
npm run dev

# 3. Setup Backend
Before starting the backend:

Delete the dist folder inside the server directory (used for production).

Then:
```bash
cd server
npm install
npm start

# 4. Environment Variables
For Frontend: 
```ini
PORT=your_port
DB_URL=your_mongodb_cluster_url
JWT_SECRET=your_jwt_secret_key

For backend: 
```ini
VITE_FIREBASE_API_KEY = YOUR_FIREBASE_API
VITE_SUPABASE_API_KEY = YOUR_SUPABASE_API

🤝 Contribution
Contributions are welcome and appreciated! Feel free to fork the repo, make your changes, and create a pull request.

