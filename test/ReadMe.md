# Yantra Test Suite

This repository hosts the integration test suite for Yantra's SDK and Production API. It includes various test cases to ensure the functionality and reliability of the Yantra serverless physics platform.

## Getting Started

1. Clone this repository to your local machine.
2. Navigate to the `tests` directory.
3. Install the necessary dependencies using `npm install`.
4. Run the tests using `npm test`.

## Test Structure

The tests are organized into separate files under the `tests` directory, each focusing on a particular aspect of the SDK such as player state, body state, etc. 

- `test-player-state.js`: Tests related to player state.
- `test-body-state.js`: Tests related to body state.

Helper functions and utilities for running the tests are located in the `helpers` directory.

## Running Tests

Run all tests in sequence with the following command:

```bash
npm test
```

Copyright Yantra Works 2023