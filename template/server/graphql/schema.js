const { mergeDeep } = require('../helpers')

const schemaBase = [
    require('./counter')
]

let query = false
let mutation = false
let subscription = false

const typeDefs = schemaBase.reduce((sum, { types })=> {
    sum[0] += types.types || ''
    sum[1] += types.queries || ''
    sum[2] += types.mutations || ''
    sum[3] += types.subscriptions || ''
    if (sum[1].length) {
        query = true
    }
    if (sum[2].length) {
        mutation = true
    }
    if (sum[3].length) {
        subscription = true
    }
    return sum
}, ['', '', '', '']).reduce((sum, type, i)=> {
    switch (i) {
    case 0:
    default:
        sum += type
        break
    case 1:
        if (query) {
            sum += `\ntype Query {\n${type}\n}`
        }
        break
    case 2:
        if (mutation) {
            sum += `\ntype Mutation {\n${type}\n}`
        }
        break
    case 3:
        if (subscription) {
            sum += `\ntype Subscription {\n${type}\n}`
        }
        break
    }
    return sum
}, '') + `
    schema {
        ${query ? 'query: Query' : ''}
        ${mutation ? 'mutation: Mutation' : ''}
        ${subscription ? 'subscription: Subscription' : ''}
    }
`
const resolvers = schemaBase.reduce((sum, { resolvers })=> mergeDeep(sum, resolvers), {})

module.exports = {
    typeDefs,
    resolvers
}
