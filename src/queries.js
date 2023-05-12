const BASE_NRQL_QUERY = `query ($account: Int!, $query: Nrql!) {
    actor {
      account(id: $account) {
        name
        nrql(query: $query) {
          results
        }
      }
      user {
        name
        id
      }
    }
  }`;

const BASE_NRQL_ASYNC_QUERY = `query ($account: Int!, $query: Nrql!) {
      actor {
        account(id: $account) {
          name
          nrql(query: $query, async: true) {
            results
            queryProgress {
              queryId
              completed
              retryAfter
              retryDeadline
              resultExpiration
            }
          }
        }
        user {
          name
          id
        }
      }
    }
  `;

const BASE_NRQL_POLL_ASYNC_QUERY = `query ($account: Int!, $queryId: ID!) {
      actor {
          account(id: $account) {
            nrqlQueryProgress(queryId: $queryId) {
              results
              queryProgress {
                queryId
                completed
                retryAfter
                retryDeadline
                resultExpiration
              }
            }
          }
      }
    }
  `;

module.exports = {
    BASE_NRQL_QUERY,
    BASE_NRQL_ASYNC_QUERY,
    BASE_NRQL_POLL_ASYNC_QUERY
};
