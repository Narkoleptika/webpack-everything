const { pubsub } = require('../../helpers')

// Super minimal database
let currentCount = 0

const counterChanged = ()=> {
    pubsub.publish('counterChanged')
    return { currentCount }
}

module.exports = {
    Query: {
        getCounter() {
            return {
                currentCount
            }
        }
    },
    Mutation: {
        incrementCounter(_, { amt = 1 }) {
            currentCount += amt
            return counterChanged()
        },
        decrementCounter(_, { amt = 1 }) {
            currentCount -= amt
            return counterChanged()
        },
        resetCounter() {
            currentCount = 0
            return counterChanged()
        }
    },
    Subscription: {
        counterChanged: {
            resolve: ()=> ({ currentCount }),
            subscribe() {
                return pubsub.asyncIterator('counterChanged')
            }
        }
    }
}
