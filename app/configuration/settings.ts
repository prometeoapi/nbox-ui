
export const BASE_URL: string = 'http://localhost:7337'
// export const BASE_URL: string = import.meta.env.BASE_URL != "" ? import.meta.env.BASE_URL : 'http://localhost:7337'

export const JSON_DEFAULT_ENTRY = JSON.stringify([
    {
        "path": "global/example",
        "key": "unique-key1",
        "value": "bla bla",
        "secure": false
    }
], null, 2)