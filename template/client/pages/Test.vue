<template>
    <div class="test" id="test">
        <h1>Test</h1>
        <img class="img--responsive" src="~img/lorempixel.jpg" alt="lorempixel.com">
        <test-component />
        <p>{{content}}</p>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import { ucwords } from 'helpers'
    import { titleMixin } from 'mixins'
    import TestComponent from 'components/TestComponent'
    export default {
        mixins: [titleMixin],
        name: 'Test',
        title() {
            return this.testTitle
        },
        computed: {
            content() {
                return ucwords(this.testContent)
            },
            ...mapState([
                'testTitle',
                'testContent'
            ])
        },
        preFetch(store) {
            return store.dispatch('getData', ['getTestTitle', 'getTestContent'])
        },
        beforeMount() {
            this.getData(['getTestTitle', 'getTestContent'])
        },
        methods: {
            ...mapActions([
                'getData'
            ])
        },
        components: {
            TestComponent
        }
    }
</script>
