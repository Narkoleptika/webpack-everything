<template>
    <div class="test" id="test">
        <h1>Test</h1>
        <img class="img--responsive" src="~img/lorempixel.jpg" alt="lorempixel.com">
        <test-component />
        <p>{{testContent}}</p>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex'
    import TestComponent from 'components/TestComponent'
    export default {
        name: 'Test',
        computed: {
            ...mapState([
                'testContent'
            ])
        },
        preFetch(store) {
            return store.dispatch('getData', ['getTestTitle', 'getTestContent']).then(()=> {
                return this.methods.meta(store)
            })
        },
        beforeMount() {
            this.getData(['getTestTitle', 'getTestContent']).then(()=> {
                this.$emit('view', this.meta(this.$store))
            })
        },
        methods: {
            meta: store=> ({
                title: store.state.testTitle,
                description: 'This is the Test page.',
                keywords: 'test, page, internet'
            }),
            ...mapActions([
                'getData'
            ])
        },
        components: {
            TestComponent
        }
    }
</script>
