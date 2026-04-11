# Zurl - Advanced URL Shortener



## 📝 Description
Zurl is a full-stack, highly scalable URL shortener application. It allows users to convert long, unwieldy links into clean, trackable short URLs. It is designed with robust analytics tracking, a modern minimalistic frontend, and secure JWT-based authentication. 

## ✨ Key Features
- **URL Shortening**: Generates short aliases for lengthy destination URLs.
- **Dynamic Redirection**: Automatically resolves and performs `302 Found` redirects when users visit the shortened endpoints.
- **Click Analytics Model**: Tracks the date and aggregate of clicks over localized date ranges.
- **Secure Authentication**: End-to-end user registration and JWT-based session configuration managed by Spring Security.
- **Link Management**: A premium, responsive Dashboard allowing users to search, instantly copy, and delete their generated links.

## 💻 Tech Stack
### Backend
- **Java 17** 
- **Spring Boot 4.0.4**
- **Spring Security** (JWT API)
- **Spring Data JPA & Hibernate**
- **MySQL Connector/J**

### Frontend
- **React 19**
- **Vite 8**
- **Tailwind CSS V4**
- **Axios** (API fetching)
- **Recharts** (Data visualization infrastructure)
- **Lucide React** (Iconography)

## 🏗️ Architecture Overview
The application is architected as a Client-Server application:
- **Client**: A Single Page Application (SPA) utilizing React Router for navigation and structured inside a unified monolithic styling system via Tailwind.
- **Gateway & Access**: The Spring Security context natively secures protected routes behind `/api/urls/**` using stateless JWT tokens parsed in authorization headers.
- **Data Persistence**: A relational Database Engine executing transactions using Hibernate ORM via `UrlMapping` and `ClickEvent` relational mappings. Note: The codebase relies natively on a unified MySQL data-source. 

## 📁 Folder Structure
```text
HakariLink/
├── HakariLink-frontend/          # React SPA directory
│   ├── src/
│   │   ├── components/           # Reusable UI elements (Buttons, Modals, Inputs)
│   │   ├── context/              # Global state (AuthContext.jsx)
│   │   ├── layouts/              # Routing wrappers (DashboardLayout.jsx) 
│   │   ├── lib/                  # Utilities and Axios integration
│   │   ├── pages/                # Page views (Dashboard, Links, Auth, etc)
│   │   └── index.css             # Tailwind token configuration
│   ├── package.json              # Frontend dependencies
│   └── vite.config.js            # Bundler configuration
├── shorter/                      # Spring Boot Backend directory
│   ├── src/main/java/com/url/shorter/
│   │   ├── Controller/           # API Endpoints (Auth & URL Mapping)
│   │   ├── dtos/                 # Data Transfer Objects
│   │   ├── models/               # Hibernate Entities (UrlMapping, User, ClickEvent)
│   │   ├── repository/           # JPA Repositories
│   │   └── services/             # Core business logic configuration
│   └── pom.xml                   # Maven dependencies and plugins
└── README.md                     # Project Documentation
```

## 🚀 Installation & Usage
### Prerequisites
- Java 17
- Node.js & npm
- A running MySQL Database on `localhost:3306`

### 1. Database Configuration
By default, the backend searches for a MySQL connection. Ensure your local MySQL instance contains a database named `urlshortnerdb` (or as defined in `application.properties`).

### 2. Running the Spring Boot Backend
Navigate to the backend directory and trigger the Maven wrapper:
```bash
cd shorter
./mvnw clean install
./mvnw spring-boot:run
```
The server will bind to `localhost:8080`.

### 3. Running the React Frontend
Open a new terminal and navigate to the frontend directory:
```bash
cd HakariLink-frontend
npm install
npm run dev
```
The frontend will spawn gracefully on `http://localhost:5173`. 

## 🔐 Environment Variables
### Backend (shorter/src/main/resources/application.properties)
Currently, variables are hardcoded or read directly from application properties. Ensure you align:
- `spring.datasource.url` (Default: `jdbc:mysql://localhost:3306/urlshortnerdb`)
- `spring.datasource.username`
- `spring.datasource.password`

### Frontend (.env)
*(Not explicitly found in codebase, but recommended for production deployment via `VITE_API_BASE_URL`)*. Currently routes proxy over Axios bindings natively.

## 🔌 API Documentation
### Public Endpoints
- `POST /api/auth/public/login` | **Payload:** `{ username, password }` | **Response:** JWT Token string
- `POST /api/auth/public/register` | **Payload:** User object

### Protected Endpoints (Requires `Authorization: Bearer <Token>`)
- `POST /api/urls/shorten` | **Payload:** `{ originalUrl: string }` | **Response:** URLMapping object featuring the `shortUrl`
- `GET /api/urls/myurls` | Returns full list of user URL mappings.
- `DELETE /api/urls/{id}` | Permanently cascades and purges URL mapping and related events.
- `GET /api/urls/totalClicks?startDate=xx&endDate=xx` | Provides absolute counts for localized charting ranges.

### Redirection
- `GET /{shortUrl}` | Reaches the frontend first, but must be configured or directly accessed via `:8080` to issue standard HTTP 302 resolutions overriding directly to `originalUrl`.

## 🤝 Contributing
The software relies on the standard GitHub Fork & PR protocol. Open issues in tracking before pushing massive feature overhauls.

## 📄 License
This project operates under the standard open-source framework *(No explicit license detected in codebase)*.

---
**Author**: S8Sankalp (Inferred from Git Configuration). 
