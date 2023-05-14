# New Relic NerdGraph API Client

A Node.js API Client for [NerdGraph](https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-nrql-tutorial/), the GraphQL API of New Relic that supports both synchronous and asynchronous NRQL queries. [Learn more about NerdGraph](https://docs.newrelic.com/docs/apis/nerdgraph/get-started/introduction-new-relic-nerdgraph/) or try it out — [api.newrelic.com/graphiql](https://api.newrelic.com/graphiql)

[![npm](https://img.shields.io/npm/v/newrelic-nerdgraph-client?label=npm&logo=npm)](https://www.npmjs.com/package/newrelic-nerdgraph-client) [![](https://img.shields.io/badge/NerdGraph-API-green?logo=newrelic)](https://docs.newrelic.com/docs/apis/nerdgraph/get-started/introduction-new-relic-nerdgraph/) ![node-current](https://img.shields.io/node/v/newrelic-nerdgraph-client?logo=node.js)

## Installation
Install using npm:
```bash
npm i newrelic-nerdgraph-client
```

## Usage

First, you need to obtain a [User API key from New Relic](https://docs.newrelic.com/docs/apis/intro-apis/new-relic-api-keys/). You can create one by logging into your New Relic account and navigating to **Account settings** > **API keys**.

After obtaining the API key, you can create an instance of `NerdGraph` by passing it as a parameter to the constructor:

```js
const NerdGraph = require('newrelic-nerdgraph-api');

const apiKey = '<YOUR_API_KEY_HERE>';
const client = new NerdGraph(apiKey);
```

### Sync Query

You can make a synchronous NRQL query using the `query` method:

```js
const options = {
  account: '<YOUR_ACCOUNT_ID_HERE>',
  query: 'SELECT * FROM Transaction SINCE 1 day ago'
};

client.query(options)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

### Async Query

NerdGraph also supports [asynchronous NRQL query](https://docs.newrelic.com/docs/apis/nerdgraph/examples/async-queries-nrql-tutorial/). Asynchronous queries run in the background, and you can make follow-up requests to retrieve query results or the query status. This type of query avoids a query being interrupted by issues like browser timeouts or HTTP connection timeouts. It's especially useful for **running queries that may take a long time to complete**.

You can make an asynchronous NRQL query using the `query` method with the `async` option set to `true`:

```js
const options = {
  account: '<YOUR_ACCOUNT_ID_HERE>',
  query: 'SELECT * FROM Transaction SINCE 1 day ago',
  async: true
};

client.query(options)
  .then((data) => {
    const queryId = data?.queryId;

    if (!queryId) {
      // Poll the results using this queryId
    } else {
      console.log(data);
    }
  })
  .catch((error) => {
    console.error(error);
  });
```

### Polling Async Query

You can poll for the results of an asynchronous NRQL query using the `poll` method:

```js
const options = {
  account: '<YOUR_ACCOUNT_ID_HERE>',
  queryId: '<YOUR_QUERY_ID_HERE>'
};

client.poll(options)
  .then((data) => {
    if (data.queryId) {
      // Poll it again
    } else {
      console.log(data);
    } 
  })
  .catch((error) => {
    console.error(error);
  });
```

### Callback

You can use a callback function instead of a promise by passing it as a second parameter:

```js
const options = {
  account: '<YOUR_ACCOUNT_ID_HERE>',
  query: 'SELECT * FROM Transaction SINCE 1 day ago'
};

client.query(options, (error, data) => {
  if (error) {
    console.error(error);
  } else {
    console.log(data);
  }
});
```

### Complete NRQL Response

You can get complete NRQL response with `completeResponse` option set to `true`:

```javascript
const options = {
  account: '<YOUR_ACCOUNT_ID_HERE>',
  query: 'SELECT * FROM Transaction SINCE 1 day ago',
  completeResponse: true
};

client.query(options)
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error(error);
  });
```

Below is a sample NRQL response:

```json
{
  "data": {
    "actor": {
      "account": {
        "nrql": {
          "results": []
        }
      }
    }
  }
}
```

## API Reference

### `NerdGraph(apiKey: string)`

Creates a new instance of the NewRelicNerdGraphAPI class.

**Parameters:**

- `apiKey` The API key to use when making requests to New Relic.

### `query(options: Object, callback?: Function): Promise`

Calls the NerdGraph API with the provided options and either invokes the provided callback or returns a promise.

**Parameters:**

- `options` The options to use when calling the API.
- `options.account` The account ID to use when calling the API.
- `options.query` The NRQL query to execute.
- `options.async` Whether or not to make an asynchronous query.
- `callback` The optional callback function to invoke with the results of the query.

**Returns:**

- A promise that resolves with the results of the query if no callback is provided.

### `poll(options: Object, callback?: Function): Promise`

Polls a NerdGraph query using the specified options.

**Parameters:**

- `options` The options to use when calling the API.
- `options.account` The account ID to use when calling the API.
- `options.queryId` The query ID to poll.
- `callback` The optional callback function to invoke with the results of the query.

**Returns:**

- A promise that resolves with the results of the query if no callback is provided.

## Contributing

Contributions to [newrelic-nerdgraph-client](https://github.com/vinitshahdeo/newrelic-nerdgraph-client) are most welcome!

please [open an issue](https://github.com/vinitshahdeo/newrelic-nerdgraph-client/issues/new) on the GitHub repository. If you want to contribute code, please [fork the repository](https://github.com/vinitshahdeo/newrelic-nerdgraph-client/fork), make your changes, and **submit a pull request**. Your contributions and feedback are most welcome!

## License

This library is authored by @[vinitshahdeo](https://github.com/vinitshahdeo) and released under the [MIT License](./LICENSE).

[![GitHub](https://img.shields.io/github/license/vinitshahdeo/newrelic-nerdgraph-client?logo=github)](./LICENSE) [![Twitter Follow](https://img.shields.io/twitter/follow/vinit_shahdeo?style=social)](https://twitter.com/Vinit_Shahdeo)

