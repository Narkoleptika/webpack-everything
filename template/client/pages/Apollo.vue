<template>
    <div class="apollo" id="apollo">
        <h1>Apollo</h1>
        <p>Open a new incognito window to this page and change the counter value in your original browser window to see the subscription update the value in both windows</p>
        <div class="counter">
            <div class="counter__display">
                {{ count }}
            </div>
            <button @click="incrementCounter(1)">+1</button>
            <button @click="incrementCounter(5)">+5</button>
            <button @click="incrementCounter(10)">+10</button>
            <br>
            <button @click="decrementCounter(1)">-1</button>
            <button @click="decrementCounter(5)">-5</button>
            <button @click="decrementCounter(10)">-10</button>
            <br>
            <button @click="resetCounter">Reset</button>
        </div>
    </div>
</template>
<script>
    import { titleMixin } from 'mixins'
    import gql from 'graphql-tag'
    export default {
        mixins: [titleMixin],
        name: 'Apollo',
        title() {
            return `${this.count} Apollo`
        },
        computed: {
            count() {
                return this.getCounter ? this.getCounter.currentCount : 0
            }
        },
        apollo: {
            getCounter: {
                query: gql`{
                    getCounter {
                        currentCount
                    }
                }`,
                prefetch: true
            }
        },
        methods: {
            incrementCounter(amt) {
                this.$apollo.mutate({
                    mutation: gql`
                        mutation incrementCounter($amt: Int) {
                            incrementCounter(amt: $amt) {
                                currentCount
                            }
                        }
                    `,
                    variables: {
                        amt
                    }
                }).then(({ data: { incrementCounter: { currentCount } } })=> {
                    console.log(currentCount)
                    console.log('incremented')
                }).catch(err=> {
                    console.log(err)
                })
            },
            decrementCounter(amt) {
                this.$apollo.mutate({
                    mutation: gql`
                        mutation decrementCounter($amt: Int) {
                            decrementCounter(amt: $amt) {
                                currentCount
                            }
                        }
                    `,
                    variables: {
                        amt
                    }
                }).then(({ data: { decrementCounter: { currentCount } } })=> {
                    console.log(currentCount)
                    console.log('decremented')
                }).catch(err=> {
                    console.log(err)
                })
            },
            resetCounter() {
                this.$apollo.mutate({
                    mutation: gql`
                        mutation resetCounter {
                            resetCounter {
                                currentCount
                            }
                        }
                    `
                }).then(({ data: { resetCounter: { currentCount } } })=> {
                    console.log(currentCount)
                    console.log('reset')
                }).catch(err=> {
                    console.log(err)
                })
            }
        },
        beforeMount() {
            this.$apollo.queries.getCounter.subscribeToMore({
                document: gql(`subscription {
                    counterChanged {
                        currentCount
                    }
                }`),
                updateQuery: (
                    previousResult,
                    { subscriptionData: { data: { counterChanged: getCounter }}}
                )=> ({ getCounter })
            })
        }
    }
</script>
