<template>
    <div class="home" id="home">
        <h1>Home</h1>
        <img src="~img/logo.png" class="img--responsive center--block" alt="Vue">
        <p>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ducimus soluta, quaerat voluptatibus sapiente
            dolor. Corporis aperiam laboriosam porro veniam officiis illum earum nulla ipsam, quia fugiat?
            Ipsa temporibus corporis alias sint itaque ex repellat libero quam deserunt quisquam! Velit laboriosam,
            cumque nam ex magnam. Repellat accusamus repellendus non quia, necessitatibus dicta beatae porro incidunt
            et eius numquam voluptatum dignissimos veritatis vel quibusdam, saepe nobis sunt tenetur officiis provident
            excepturi! Impedit error perspiciatis fugit excepturi quasi, minus perferendis quo aperiam soluta laboriosam
            sint fugiat et quaerat sed omnis consectetur quod iusto ipsa doloremque nostrum cumque tempore. Quia
            praesentium, adipisci, fuga minima recusandae deleniti molestiae, cum eos sequi asperiores iste.
            Molestias porro, eligendi tenetur ullam at natus unde, quis distinctio impedit, cupiditate officia
            provident. Dicta dolor beatae aut mollitia explicabo possimus reprehenderit, dolorum natus enim? Est
            esse quos corrupti magnam voluptatibus distinctio dolores recusandae eos molestiae, repellendus, quasi
            a error voluptatem ullam. In vitae sit modi accusantium rem porro iste iure! Incidunt blanditiis similique
            explicabo at iste ratione non rerum, rem labore omnis necessitatibus, officiis cupiditate cumque, libero
            tempore molestias laboriosam dolorem itaque hic voluptates! Fugit laboriosam delectus veniam repellendus,
            aliquid maxime. Dolorum ab quae nisi perspiciatis illum dolore, voluptatibus, unde ex necessitatibus et
            optio ut eaque ducimus qui pariatur ipsa, magnam non fuga quaerat suscipit veritatis ad quas doloremque.
            Voluptatum, quod quibusdam ipsa debitis earum nam delectus, officiis porro eligendi vero, ipsam accusamus?
            Nisi fugiat libero amet, consequatur veritatis eum natus minus necessitatibus culpa, consequuntur reiciendis
            temporibus qui, dolores magnam quisquam iure ea quas recusandae dolorum facere. Porro reprehenderit
            perspiciatis expedita repellendus minima? Quas dolore unde earum sequi ducimus distinctio, iure impedit
            nobis. Repudiandae dolore sapiente officiis magnam, delectus totam itaque doloribus non inventore,
            assumenda debitis maxime possimus voluptatem, laborum. Odio, soluta possimus dicta cumque magnam aut
        </p>
    </div>
</template>
<script>
    export default {
        name: 'Home',
        preFetch() {
            return this.methods.meta();
        },
        mounted() {
            this.$emit('view', this.meta());
        },
        methods: {
            meta() {
                return {
                    title: 'Home | {{ project }}',
                    description: 'This is the home page.',
                    keywords: 'home, page, internet'
                };
            }
        }
    };
</script>
