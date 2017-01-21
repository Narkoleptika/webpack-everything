<template>
    <div class="test" id="test">
        <h1>Test</h1>
        <img class="img--responsive" src="~img/lorempixel.jpg" alt="lorempixel.com">
        <test-component />
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam recusandae, repudiandae corrupti dolor earum
            quibusdam molestiae obcaecati perspiciatis repellendus sequi a quod ea praesentium maxime unde architecto
            dignissimos non ipsum mollitia, fugiat qui, quo enim accusamus. Id similique voluptatibus facilis, ad
            perferendis distinctio consequatur impedit, dolorem repellendus ab ipsa. Necessitatibus.
        </p>
    </div>
</template>
<script>
    import TestComponent from 'components/TestComponent';
    export default {
        name: 'Test',
        preFetch() {
            return this.methods.meta();
        },
        mounted() {
            this.$emit('view', this.meta());
        },
        methods: {
            meta() {
                return {
                    title: 'Test | {{ project }}',
                    description: 'This is the Test page.',
                    keywords: 'test, page, internet'
                };
            }
        },
        components: {
            TestComponent
        }
    };
</script>
