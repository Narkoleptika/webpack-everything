<template>
    <div class="not-found center" id="not-found">
        <h1>404</h1>
        <router-link :to="{name: 'Home'}">Return Home</router-link>
    </div>
</template>
<script>
    export default {
        name: 'NotFound',
        preFetch() {
            return this.methods.meta()
        },
        beforeMount() {
            this.$emit('view', this.meta())
        },
        methods: {
            meta: ()=> ({
                title: '404 | {{ project }}',
                description: 'The page could not be found',
                keywords: 'lost, 404, not found'
            })
        }
    }
</script>
