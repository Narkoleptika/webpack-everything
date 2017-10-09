module.exports = {
    types: `
        type Counter {
            currentCount: Int!
        }
    `,
    queries: `
        getCounter: Counter!
    `,
    mutations: `
        incrementCounter(amt: Int): Counter!
        decrementCounter(amt: Int): Counter!
        resetCounter: Counter!
    `,
    subscriptions: `
        counterChanged: Counter!
    `
}
