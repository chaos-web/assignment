# 📍 Device Tracking System

A scalable microservice-based **Device Tracking Platform** built with [NestJS](https://nestjs.com/), designed to generate, process, and store GPS tracking data. The system uses **MongoDB** for data persistence, **Redis** for message queuing, and **RabbitMQ** for asynchronous messaging, all containerized with **Docker** and **Docker Compose**.

---

## 🚀 Features

- 📡 **Real-time GPS Data Generation** - Simulates device tracking data with location and speed
- 📊 **Signal Processing** - Processes and stores tracking signals with state management
- 🔄 **Asynchronous Message Processing** - Uses Redis outbox pattern for reliable message delivery
- 📈 **Data Querying** - Filter signals by device ID, time ranges, and other criteria
- 🐳 **Containerized Architecture** - Full Docker support for easy deployment
- 🧪 **Comprehensive Testing** - Unit and end-to-end test coverage
- 📚 **API Documentation** - Swagger/OpenAPI integration

---

## 🏗️ Tech Stack

- **NestJS** — TypeScript-based backend framework
- **MongoDB** — NoSQL database for signal and tracking data
- **Redis** — In-memory database for message queuing (outbox pattern)
- **RabbitMQ** — Message broker for async communication
- **Docker & Docker Compose** — Containerization and orchestration
- **Jest** — Test framework for unit and e2e tests
- **Swagger** — API documentation

---

## 📁 Project Structure

```
src/
├── composer/           # GPS data generation service
│   ├── entities/       # Data models and interfaces
│   ├── dto/           # Data transfer objects
│   ├── composer.service.ts
│   ├── composer.controller.ts
│   └── composer.module.ts
├── signal/            # Signal processing service
│   ├── entities/      # Signal models and repositories
│   ├── dto/          # Signal DTOs
│   ├── signal.service.ts
│   ├── signal.controller.ts
│   └── signal.module.ts
├── rabbit-outbox/     # Message queuing system
│   ├── outbox.service.ts
│   └── outbox.module.ts
├── utils/            # Configuration and utilities
├── app.module.ts     # Main application module
└── main.ts          # Application entry point
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Docker and Docker Compose
- MongoDB
- Redis

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd assignment
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run start:dev
   
   # Production mode
   npm run start:prod
   ```

---

## 📡 API Endpoints

### Composer Service
- **POST** `/composer/generate` - Generate new device tracking data
- **GET** `/composer/health` - Health check

### Signal Service
- **POST** `/signal` - Create a new signal
- **GET** `/signal` - Query signals with filters
- **GET** `/signal/:id` - Get signal by ID

### Health Checks
- **GET** `/health` - Application health status

---

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL=mongodb://localhost:27017/device-tracking

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=amqp://localhost:5672

# Application
PORT=3000
NODE_ENV=development
```

### Docker Services

The application includes the following services:
- **PostgreSQL** - Database (port 5432)
- **pgAdmin** - Database management (port 80)
- **Redis** - Message queuing
- **RabbitMQ** - Message broker
- **Nginx Proxy** - Reverse proxy

---

## 📊 Data Models

### Device Tracking Data
```typescript
interface IDeviceTrackingData {
  [deviceId: string]: {
    data: Array<[
      time: number,
      [latitude: number, longitude: number, speed: number]
    ]>;
    time: number; // milliseconds
  };
}
```

### Signal Entity
```typescript
interface Signal {
  deviceId: string;
  payload: Array<[number, [number, number, number]]>;
  state: State;
  totalItems: number;
  createdAt: Date;
}
```

---

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov

# Full E2E test suite with Docker
npm run test:e2e:full
```

### Test Setup
```bash
# Start test environment
npm run test:e2e:setup

# Run tests
npm run test:e2e

# Cleanup
npm run test:e2e:teardown
```

---

## 🐳 Docker

### Build and Run
```bash
# Build the image
docker build -t device-tracking .

# Run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up -d

# Rebuild and restart
docker-compose down && docker-compose up --build -d
```

---

## 📈 Monitoring & Health Checks

The application includes built-in health checks:
- **Application Health** - `/health`
- **Database Connectivity** - MongoDB connection status
- **Redis Connectivity** - Message queue health
- **Service Status** - Individual service health endpoints

---

## 🔄 Message Flow

1. **Data Generation** - Composer service generates GPS tracking data
2. **Message Queuing** - Data is queued in Redis using outbox pattern
3. **Signal Processing** - Signal service processes and stores tracking data
4. **State Management** - Signals are tracked with different states (FETCHED, PROCESSED, etc.)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api` endpoint
- Review the test files for usage examples

