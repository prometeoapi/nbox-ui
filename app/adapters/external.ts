import {BASE_URL} from "~/configuration/settings";

export const Retrieve = async <T>(endpoint: string) => {
    const res = await fetch(
        `${BASE_URL}${endpoint}`,
        {
            headers: {...basicAuth()}
        }
    );
    return await res.json()
}


const basicAuth = (): Record<string, string> => {
    return {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${btoa('user:pass')}`,
    }
}