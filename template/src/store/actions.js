export default {
    // Fake Async API Calls
    getTestTitle: ({ commit })=> new Promise(resolve=> {
        setTimeout(()=> {
            commit('SET_TEST_TITLE', 'Test | {{ project }}')
            resolve()
        }, 1000)
    }),
    getTestContent: ({ commit })=> new Promise(resolve=> {
        setTimeout(()=> {
            commit('SET_TEST_CONTENT', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nam recusandae, repudiandae corrupti dolor earum quibusdam molestiae obcaecati perspiciatis repellendus sequi a quod ea praesentium maxime unde architecto dignissimos non ipsum mollitia, fugiat qui, quo enim accusamus. Id similique voluptatibus facilis, ad perferendis distinctio consequatur impedit, dolorem repellendus ab ipsa. Necessitatibus.')
            resolve()
        }, 1000)
    })
}
