export const ucwords = str=> String(str).replace(/^(.)|\s+(.)/g, $1=> $1.toUpperCase())
