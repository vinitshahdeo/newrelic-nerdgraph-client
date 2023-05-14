# New Relic NerdGraph API

A Node.js API Client for [NerdGraph](https://docs.newrelic.com/docs/apis/nerdgraph/examples/nerdgraph-nrql-tutorial/), the GraphQL API of New Relic that supports both synchronous and asynchronous NRQL queries. [Learn more about NerdGraph](https://docs.newrelic.com/docs/apis/nerdgraph/get-started/introduction-new-relic-nerdgraph/) or try it out — [api.newrelic.com/graphiql](https://api.newrelic.com/graphiql)

## Installation
Install using npm:
```bash
npm install newrelic-nerdgraph-api
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

## Options

Pass `options.completeResponse: true` for getting complete NRQL response.

## License

This library is released under the MIT License.