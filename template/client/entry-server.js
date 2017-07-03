import createApp from './app'
import { generateHead } from 'helpers'

// This exported function will be called by `bundleRenderer`.
// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default context=> {
    const { app, router, store } = createApp()
    const s = Date.now()
    return new Promise((resolve, reject)=> {
        // set router's location
        router.push(context.url)

        router.onReady(()=> {
            const matchedComponents = router.getMatchedComponents()
            // no matched routes
            if (matchedComponents.reduce((a, c)=> a === true ? a : c.name === 'NotFound', false)) {
                if (context.url !== '/404') {
                    reject({
                        code: 404,
                        url: '/404',
                        manual: true
                    })
                }
            }
            // Call preFetch hooks on components matched by the route.
            // A preFetch hook dispatches a store action and returns a Promise,
            // which is resolved when the action is complete and store state has been
            // updated.
            return Promise.all(matchedComponents.map(component=> {
                return component.preFetch && component.preFetch(store)
            })).then((meta)=> {
                console.log(`data pre-fetch: ${Date.now() - s}ms`)
                // After all preFetch hooks are resolved, our store is now
                // filled with the state needed to render the app.
                // Expose the state on the render context, and let the request handler
                // inline the state in the HTML response. This allows the client-side
                // store to pick-up the server-side state without having to duplicate
                // the initial data fetching on the client.
                context.head = generateHead(meta[0])
                context.state = store.state
                resolve(app)
            }).catch(reject)
        })
    })
}
