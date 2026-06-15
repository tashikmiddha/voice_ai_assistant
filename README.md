# AI Chatbot

Embeddable AI Assistant with a React frontend and Node.js backend.

## Requirements

* Node.js (LTS recommended)
* MongoDB database
* OpenAI API Key
* Firebase project (for Google Login)

---

# Project Structure

```bash
ai_chatbot/
├── client/
└── server/
```

---

# Quick Start

## 1. Clone the Repository

```bash
git clone <your-repository-url>
cd ai_chatbot
```

---

## 2. Backend Setup

```bash
cd server
npm install
```

Create a `.env` file:

```env
PORT=8000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-5-mini
```

Start the backend:

```bash
npm run dev
```

Backend will run on:

```bash
http://localhost:8000
```

---

## 3. Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file:

```env
VITE_SERVER_URL=http://localhost:8000
VITE_CLIENT_URL=http://localhost:5173
```

Start the frontend:

```bash
npm run dev
```

Frontend will run on:

```bash
http://localhost:5173
```

---

# Production Build

## Frontend

```bash
cd client
npm run build
```

Build files will be generated inside:

```bash
dist/
```

Deploy the contents of the `dist` folder to your preferred hosting provider.

---

# Deployment Checklist

### Frontend

Set:

```env
VITE_SERVER_URL=https://your-backend-domain.com
VITE_CLIENT_URL=https://your-frontend-domain.com
```

### Backend

Set:

```env
PORT=
MONGODB_URL=
JWT_SECRET=
OPENAI_API_KEY=
OPENAI_MODEL=
```

### CORS

Update backend CORS settings to allow requests from your frontend domain.

---

# Assistant Widget

After configuring your assistant in the dashboard, embed the generated script on your website:

```html
<script
  src="YOUR_FRONTEND_DOMAIN/assistant.js"
  data-user-id="YOUR_USER_ID"
  data-api-base="YOUR_BACKEND_DOMAIN"
></script>
```

---

# Important Notes

* MongoDB must be accessible by the backend.
* Firebase configuration must be set correctly for Google Login.
* OpenAI API key is required for AI responses.
* Ensure CORS is configured properly in production.
* Verify the widget can access your backend APIs after deployment.

---

# Available Scripts

## Backend

```bash
npm run dev
```

## Frontend

```bash
npm run dev
npm run build
npm run preview
```

---

# License

MIT
