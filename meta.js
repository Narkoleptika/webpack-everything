module.exports = {
    prompts: {
        project: {
            type: 'string',
            required: true,
            message: 'Project name'
        },
        authorName: {
            type: 'string',
            required: true,
            message: 'Author Name'
        }
    },
    helpers: {
        year: ()=> new Date().getFullYear()
    },
    completeMessage: `To get started:

cd {{destDirName}}
npm install || yarn
npm run dev

More info in the README`
};
