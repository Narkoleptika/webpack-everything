<template>
    <div class="not-found center" id="not-found">
        <h1>404</h1>
        <router-link :to="{name: 'Home'}">Return Home</router-link>
    </div>
</template>
<script>
    import { titleMixin } from 'mixins'
    export default {
        mixins: [titleMixin],
        name: 'NotFound',
        title: '404'
    }
</script>
