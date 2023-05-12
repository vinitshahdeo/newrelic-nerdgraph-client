const axios = require('axios'),
    {
        BASE_NRQL_QUERY,
        BASE_NRQL_ASYNC_QUERY,
        BASE_NRQL_POLL_ASYNC_QUERY
    } = require('./queries'),
    NEWRELIC_GRAPHQL_ENDPOINT = 'https://api.newrelic.com/graphql';

/**
 * A client for NerdGraph — GraphQL API of New Relic that supports both sync and async NRQL queries.
 */
class NewRelicNerdGraphAPI {
    // Private variables
    #endpoint;
    #headers;

    /**
     * Creates a new instance of the NewRelicNerdGraphAPI class.
     * @param {string} apiKey - The API key to use when making requests to New Relic.
     */
    constructor(apiKey) {
        if (!apiKey) {
            throw new Error('Please provide New Relic API key');
        }

        /**
         * The endpoint for the NerdGraph API.
         * @type {string}
         */
        this.#endpoint = NEWRELIC_GRAPHQL_ENDPOINT;

        /**
         * The headers to include with each request.
         * @type {Object}
         */
        this.#headers = {
            'Content-Type': 'application/json',
            'API-Key': apiKey
        };
    }

    // Private method to check if account ID is present in options or not.
    #validateAccount(options) {
        if (!options.account) {
            throw new Error('Provide New Relic Account ID');
        }
    };

    #parseResults(response) {
        return response?.data?.actor?.account?.nrql?.results;
    }

    /**
     * Calls the NerdGraph API with the provided options and either invokes the provided callback or returns a promise.
     * @param {Object} options - The options to use when calling the API.
     * @param {boolean} options.async - Whether or not to make an asynchronous query.
     * @param {boolean} options.poll - Whether or not to poll for the results of an async query.
     * @param {Function} [callback] - The optional callback function to invoke with the results of the query.
     * @returns {Promise} - A promise that resolves with the results of the query if no callback is provided.
     */
    #call(options, callback) {
        const reqOptions = {
            headers: this.#headers
        },
            payload = {
                query: options.async ? BASE_NRQL_ASYNC_QUERY : BASE_NRQL_QUERY,
                variables: options
            };

        if (options.poll) {
            payload.query = BASE_NRQL_POLL_ASYNC_QUERY;
        }

        axios
            .post(this.#endpoint, payload, reqOptions)
            .then((response) => {
                return callback(null, options.completeResponse ? response.data : this.#parseResults(response.data));
            })
            .catch((error) => {
                return callback(error);
            });
    }

    /**
     * Calls the NerdGraph API asynchronously with the provided options and returns a promise.
     * @param {Object} options - The options to use when calling the API.
     * @returns {Promise} - A promise that resolves with the results of the query.
     */
    #callAsync(options) {
        return new Promise((resolve, reject) => {
            this.#call(options, (error, data) => {
                error ? reject(error) : resolve(data);
            });
        });
    }

    /**
     * Calls the NerdGraph API with the provided options and either invokes the provided callback or returns a promise.
     * @param {Object} options - The options to use when calling the API.
     * @param {Function} [callback] - The optional callback function to invoke with the results of the query.
     * @returns {Promise} - A promise that resolves with the results of the query if no callback is provided.
     */
    query(options = {}, callback) {
        this.#validateAccount(options);

        if (!options.query) {
            throw new Error('Provide NRQL query');
        }

        if (callback) {
            return this.#call(options, callback);
        }
        return this.#callAsync(options);
    }

    /**
     * Polls a NerdGraph query using the specified options.
     * If a callback is provided, the method will use callbacks to handle the response.
     * If no callback is provided, the method will return a promise that you can use to handle the response.
     */
    poll(options = {}, callback) {
        this.#validateAccount(options);

        if (!options.queryId) {
            throw new Error('Provide a valid query ID');
        }

        options.poll = true;

        if (callback) {
            return this.#call(options, callback);
        }

        return this.#callAsync(options);
    }
}

module.exports = NewRelicNerdGraphAPI;
