# Signal E2E Tests

This directory contains comprehensive end-to-end tests for the Signal API endpoints and RabbitMQ message handling functionality.

## Test Files

### 1. `signal.e2e-spec.ts`
Main e2e test file covering:
- **POST /signal** - Signal creation endpoint
- **GET /signal** - Signal querying endpoint with filters
- Data validation and error handling
- Edge cases and boundary conditions

### 2. `signal-test.config.ts`
Test configuration and helper functions for:
- Test data generation
- Mock device tracking data
- Test environment setup

## Test Coverage

### Signal Creation (POST /signal)
- ✅ Successful signal creation with valid data
- ✅ Validation of required fields (deviceId, time, payload)
- ✅ Payload structure validation
- ✅ Data type validation
- ✅ Multiple signals for same device
- ✅ Large payload arrays (100+ items)
- ✅ Special characters in deviceId
- ✅ Extreme coordinate values

### Signal Querying (GET /signal)
- ✅ Retrieve all signals without filters
- ✅ Filter by deviceId
- ✅ Filter by startTime
- ✅ Filter by endTime
- ✅ Combined filters (deviceId + time range)
- ✅ Empty results for non-existent data
- ✅ Invalid query parameter handling

### Data Structure Validation
- ✅ Payload transformation (object to array format)
- ✅ Default value assignment (state, totalItems, createdAt)
- ✅ Data integrity preservation

## Running the Tests

### Prerequisites
1. MongoDB instance running (for test database)
2. RabbitMQ instance running (for message queue tests)
3. Node.js and npm installed

### Environment Setup
Create a `.env.test` file with test-specific configuration:
```env
TEST_MONGO_URI=mongodb://localhost:27017/signal-test
TEST_RABBIT_URI=amqp://guest:guest@localhost:5672
```

### Running Tests

#### Run all e2e tests:
```bash
npm run test:e2e
```

#### Run only signal tests:
```bash
npm run test:e2e signal.e2e-spec.ts
npm run test:e2e signal-rabbitmq.e2e-spec.ts
```

#### Run with watch mode:
```bash
npm run test:e2e:watch
```

#### Run with full Docker setup:
```bash
npm run test:e2e:full
```

## Test Data Structure

### Signal Creation DTO
```typescript
{
  deviceId: string;
  time: number;
  payload: Array<{
    time: number;
    latitude: number;
    longitude: number;
    speed: number;
  }>;
}
```

### Device Tracking Data (RabbitMQ)
```typescript
{
  [deviceId: string]: {
    time: number;
    data: Array<[
      time: number,
      [latitude: number, longitude: number, speed: number]
    ]>;
  };
}
```

## Test Scenarios

### Happy Path Scenarios
1. Create signal with valid data
2. Query signals with various filters
3. Process RabbitMQ messages successfully
4. Handle multiple devices in single message

### Error Scenarios
1. Missing required fields
2. Invalid data types
3. Empty payload arrays
4. Non-existent device queries

### Edge Cases
1. Very large payload arrays
2. Extreme coordinate values
3. Special characters in device IDs
4. Concurrent operations
5. Empty messages

## Database Cleanup

Tests automatically clean up the database after each test using the `clearDatabase` helper function. This ensures test isolation and prevents data leakage between tests.

## Performance Considerations

- Tests include appropriate wait times for database operations
- Large payload tests verify system can handle significant data volumes
- Concurrent processing tests verify system stability under load

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running on the expected port
   - Check connection string in `.env.test`

2. **RabbitMQ Connection Error**
   - Ensure RabbitMQ is running and accessible
   - Verify credentials in connection string

3. **Test Timeout**
   - Increase Jest timeout in `jest-e2e.json`
   - Check for slow database operations

4. **Data Persistence Between Tests**
   - Verify `clearDatabase` is working correctly
   - Check for proper test isolation

### Debug Mode
Run tests in debug mode for detailed logging:
```bash
npm run test:debug
```

## Contributing

When adding new tests:
1. Follow the existing test structure and naming conventions
2. Include both positive and negative test cases
3. Add appropriate error handling tests
4. Update this README with new test scenarios
5. Ensure proper database cleanup 