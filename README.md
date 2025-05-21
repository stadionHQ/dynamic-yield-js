# Dynamic Yield JavaScript Client

A TypeScript/JavaScript client for the Dynamic Yield API, providing a simple and type-safe way to interact with Dynamic Yield's services.

## Installation

```bash
# Using npm
npm install @stadionhq/dynamic-yield-js

# Using yarn
yarn add @stadionhq/dynamic-yield-js

# Using bun
bun add @stadionhq/dynamic-yield-js
```

## Usage

```typescript
import { DynamicYieldClient } from '@stadionhq/dynamic-yield-js';

// Initialize the client
const client = new DynamicYieldClient({
  apiKey: 'your-api-key',
  dataCenter: 'us', // or 'eu', defaults to 'us'
  version: 'v2', // optional, defaults to 'v2'
  extraHeaders: {} // optional additional headers
});

// Example: Choose variations
const variations = await client.chooseVariations({
  user: { id: 'user123' },
  context: { page: 'home' },
  options: {
    variations: [{ id: 'variation1' }]
  }
});

// Example: Track pageview
await client.trackPageviews({
  user: { id: 'user123' },
  context: { page: 'product' }
});
```

## Available Methods

The client provides methods for all Dynamic Yield API endpoints:

- `chooseVariations()` - Choose variations for a user
- `trackPageviews()` - Track page views
- `trackEngagement()` - Track user engagement
- `search()` - Perform search operations
- `trackEvents()` - Track custom events
- `updateProductFeed()` - Update product feed
- `trackTransactionStatusSpecificItem()` - Track transaction status for specific items
- `trackTransactionStatusWholeTransaction()` - Track transaction status for whole transactions
- `updateBranchFeed()` - Update branch feed
- `reportOutages()` - Report outages
- `userDataApi()` - User data operations
- `externalEventsApi()` - Track external events
- `profileAnywhere()` - Access user profile data

## Configuration

The client accepts the following configuration options:

```typescript
interface DYApiConfig {
  apiKey: string;           // Your Dynamic Yield API key
  dataCenter?: 'us' | 'eu'; // Data center to use (defaults to 'us')
  version?: string;         // API version (defaults to 'v2')
  extraHeaders?: Record<string, string>; // Additional headers to include
}
```

## Error Handling

All API calls will throw an error if the request fails. The error message will include the HTTP status code:

```typescript
try {
  await client.chooseVariations({/*...*/});
} catch (error) {
  console.error('API call failed:', error.message);
}
```

## Development

```bash
# Install dependencies
yarn install

# Run tests
yarn test

# Run tests in watch mode
yarn test:watch

# Build the project
yarn build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

[GitHub Repository](https://github.com/stadionhq/dynamic-yield-js) 