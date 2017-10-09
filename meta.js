module.exports = {
    prompts: {
        project: {
            type: 'string',
            required: true,
            message: 'Pretty Project name'
        },
        preprocessor: {
            type: 'list',
            message: 'Choose a css preprocessor',
            choices: [
                'stylus',
                'scss'
            ]
        },
        eslint: {
            type: 'confirm',
            message: 'Use ESLint?'
        }
    },
    filters: {
        'client/assets/stylus/**/*': 'preprocessor === "stylus"',
        'client/assets/scss/**/*': 'preprocessor === "scss"',
        '.eslintrc.js': 'eslint === true'
    },
    helpers: {
        htmlTitle: ()=> '{{title}}',
        htmlResourceHints: ()=> '{{{ renderResourceHints() }}}',
        htmlStyles: ()=> '{{{ renderStyles() }}}',
        htmlState: ()=> '{{{ renderState() }}}',
        htmlScripts: ()=> '{{{ renderScripts() }}}',
        year: ()=> new Date().getFullYear(),
        preprocessorExtension({ data }) {
            let ret
            switch (data.root.preprocessor) {
            case 'stylus':
                ret = 'styl'
                break
            case 'scss':
                ret = 'scss'
                break
            default:
                break
            }
            return ret
        }
    },
    skipInterpolation: 'client/pages/Test.vue',
    completeMessage: `To get started:

{{#inPlace}}npm install && npm run dev{{else}}cd {{destDirName}} && npm install && npm run dev{{/inPlace}}
      - or -
{{#inPlace}}yarn && npm run dev{{else}}cd {{destDirName}} && yarn && npm run dev{{/inPlace}}

More info in the README`
}
