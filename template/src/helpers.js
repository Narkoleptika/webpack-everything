export const generateHead = ({title = '{{ project }}', description = null, keywords = null})=> `
${title ? `<title>${title}</title>` : ''}
${description ? `<meta name="description" contnet="${description}">` : ''}
${keywords ? `<meta name="keywords" contnet="${keywords}">` : ''}
`
