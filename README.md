# 📈 Stock-market

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Build Status](https://img.shields.io/github/actions/workflow/status/AbdullahBakouni/Stock-market/ci.yml?branch=main)]()
[![Issues](https://img.shields.io/github/issues/AbdullahBakouni/Stock-market)]()
[![Pull Requests](https://img.shields.io/github/issues-pr/AbdullahBakouni/Stock-market)]()
[![Stars](https://img.shields.io/github/stars/AbdullahBakouni/Stock-market?style=social)]()

> Track real-time stock prices, get personalized alerts and explore detailed company insights.

---

## 🖥️ Overview

Stock-market is a full-stack application that enables users to monitor stock market dynamics in real time, receive notifications based on custom rules, and dig into company fundamentals — all through a modern responsive UI.

---

## 🧱 Tech Stack

| Layer             | Technology                       |
|-------------------|----------------------------------|
| Frontend          | Next.js, React, Tailwind CSS     |
| Backend           | Next.js Server Actions    |
| Data / Streaming  | SSE, REST APIs      |
| Database          | PostgreSQL        |
| Alerts / Notifications | Email, Push, WebHooks, Cron Jobs       |
| Deployment        | Docker, Kubernetes, CI/CD        |

---

## ✨ Features

- 🕒 Real-time stock price tracking  
- 🔔 Customizable alerts when target prices are hit or metrics change  
- 📊 Company overview with detailed financials and history  
- 📱 Responsive design for mobile and desktop  
- 🧩 Modular architecture enabling easy extension  

---

## 🗺️ Architecture Diagram

```mermaid
flowchart TD
    U[User / Device] --> F[Frontend App]
    F --> B[Backend API]
    B --> D[(Database)]
    B --> S[(Stock Data Stream)]
    B --> N[(Notifications Service)]
    S --> D
    B --> U
    N --> U
```
# ⚙️ Installation
1️⃣ Clone the repository
```bash
git clone https://github.com/AbdullahBakouni/Stock-market.git
cd Stock-market
```
2️⃣ Install dependencies
```bash
npm install
# or
yarn install
```
3️⃣ Configure environment variables

Create a .env file at the root:
```env
NODE_ENV=Development
# MongoDB root credentials
MONGO_INITDB_ROOT_USERNAME=your userName
MONGO_INITDB_ROOT_PASSWORD=your Password
MONGO_INITDB_DATABASE=stock-market
MONGODB_URI=mongodb://userName:password@localhost:27017/stock-market?authSource=admin

# Mongo Express configuration
ME_CONFIG_MONGODB_URL=mongodb://userName:Password@mongo:27017/stock-market?authSource=admin
ME_CONFIG_BASICAUTH_ENABLED=true
ME_CONFIG_BASICAUTH_USERNAME=your userName
ME_CONFIG_BASICAUTH_PASSWORD=your Password

#BETTER AUTH SETUP
BETTER_AUTH_SECRET=your Secret
BETTER_AUTH_URL=http://localhost:3000 # Base URL of your app

#GEMINI API KEY
GEMINI_API_KEY=your Api Key

#NODEMAILER SETUP
NODEMAILER_EMAIL=your Email
NODEMAILER_PASSWORD=your Passsword

#FINNHUB API KEY
NEXT_PUBLIC_FINNHUB_API_KEY=Your APi Key

#REDIS URL FOR CRON JOBS
REDIS_URL=redis://127.0.0.1:6379
```
4️⃣ Run locally
```bash
npm run dev
# or
yarn dev
```
# 🐳 Docker Setup
Build and run locally
```bash
docker build -t stock-market .
docker run -p 3000:3000 --env-file .env stock-market
```
Or run via Docker Compose
```bash
docker-compose up -d
```
# ☁️ Kubernetes Deployment
1️⃣ Build Docker image
```bash
docker build -t your-dockerhub-username/stock-market:latest .
docker push your-dockerhub-username/stock-market:latest
```
2️⃣ Apply Kubernetes manifests
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```
3️⃣ (Optional) Deploy with Helm
```bash
helm install stock-market ./helm
```
# 🛣️ Roadmap

 Add multi-exchange support (NYSE, NASDAQ, etc.)

 Implement social sharing of watchlists

 Integrate historical charting & technical indicators

 Add machine learning predictions for stocks

 # 🤝 Contributing

Contributions are welcome!
Please follow this workflow:

Fork the repository

Create a feature branch (git checkout -b feature/your-feature)

Commit your changes (git commit -m "Add feature X")

Push to your branch (git push origin feature/your-feature)

Open a Pull Request and describe your changes.

# 📜 License

Licensed under the MIT License © 2025 [Abdullah Bakouni](https://github.com/AbdullahBakouni)

# 🌍 Visit My Website

Check My Project here 
👉 https://signalist-vert.vercel.app
