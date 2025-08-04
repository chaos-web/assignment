# End-to-End Tests for Offer API

This directory contains end-to-end tests for the Offer API, testing the complete flow from HTTP requests to database operations and RabbitMQ message processing.

## Test Files

- `offer.e2e-spec.ts` - Comprehensive e2e tests for the Offer API
- `app.e2e-spec.ts` - Basic app health check tests
- `setup.ts` - Test configuration and utilities

## Prerequisites

Before running the e2e tests, ensure you have the following services running:

### 1. MongoDB
```bash
# Using Docker
docker run -d --name mongodb-test \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=root \
  mongo:latest

# Or using the existing docker-compose
docker-compose up -d mongodb
```

### 2. RabbitMQ
```bash
# Using Docker
docker run -d --name rabbitmq-test \
  -p 5672:5672 \
  -p 15672:15672 \
  rabbitmq:3-management

# Or using the existing docker-compose
docker-compose up -d rabbitmq
```

## Environment Variables

Create a `.env.test` file in the root directory:

```env
TEST_MONGO_URI=mongodb://root:root@localhost:27017/test-db
TEST_RABBIT_URI=amqp://localhost:5672
```

## Running Tests

### Run all e2e tests
```bash
npm run test:e2e
```

### Run specific test file
```bash
npm run test:e2e -- offer.e2e-spec.ts
```

### Run tests in watch mode
```bash
npm run test:e2e -- --watch
```

### Run tests with verbose output
```bash
npm run test:e2e -- --verbose
```

## Test Coverage

The `offer.e2e-spec.ts` file includes comprehensive tests for:

### 1. GET /offer Endpoint Tests
- **Empty Results**: Verifies empty array is returned when no offers exist
- **All Offers**: Tests retrieval of all offers without filters
- **Company Filter**: Tests filtering by company name
- **Location Filter**: Tests filtering by location
- **Salary Filters**: Tests minimum and maximum salary filtering
- **Salary Range**: Tests combined min/max salary filtering
- **Date Filter**: Tests filtering by issued date
- **Pagination**: Tests pagination functionality (10 items per page)
- **Combined Filters**: Tests multiple filters applied simultaneously

### 2. RabbitMQ Integration Tests
- **Harvester Data Processing**: Tests the complete flow from RabbitMQ message to offer creation
- **Data Transformation**: Verifies harvester data is properly transformed to offer format

### 3. Error Handling Tests
- **Invalid Parameters**: Tests handling of invalid query parameters
- **Invalid Dates**: Tests handling of malformed date parameters

## Test Data

The tests use realistic job offer data including:
- Software engineering positions
- Data science roles
- Various salary ranges
- Different companies and locations
- Timestamped data for date filtering

## Test Structure

Each test follows this pattern:
1. **Setup**: Clear database and prepare test data
2. **Action**: Make HTTP request or publish RabbitMQ message
3. **Assertion**: Verify expected response and database state

## Database Cleanup

Tests automatically clean up the database between runs:
- `beforeEach`: Clears all offers before each test
- `afterAll`: Closes application and connections

## Troubleshooting

### Common Issues

1. **Connection Refused**: Ensure MongoDB and RabbitMQ are running
2. **Authentication Failed**: Check MongoDB credentials in connection string
3. **Timeout Errors**: Increase timeout values for slow environments
4. **Port Conflicts**: Ensure test services use different ports than development

### Debug Mode

Run tests with debug logging:
```bash
DEBUG=* npm run test:e2e
```

### Manual Testing

To manually test the API:
```bash
# Start the application
npm run start:dev

# Test the offer endpoint
curl http://localhost:3000/offer

# Test with filters
curl "http://localhost:3000/offer?company=Tech%20Corp&minSalary=80000"
```

## Performance Considerations

- Tests use a separate test database to avoid affecting development data
- Database cleanup happens between tests for isolation
- RabbitMQ messages are processed asynchronously with appropriate wait times
- Large datasets are used to test pagination and performance

## Contributing

When adding new tests:
1. Follow the existing test structure
2. Use descriptive test names
3. Include both positive and negative test cases
4. Test edge cases and error conditions
5. Ensure proper cleanup in `beforeEach` hooks 