import {json} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {EnvironmentRecord} from "~/domain/event";
import {BASE_URL} from "~/configuration/settings";
import {Retrieve} from "~/adapters/external";

export async function loader() {
    // // read a cookie
    // const cookie = request.headers.get("Cookie");
    //
    // // parse the search params for `?q=`
    // const url = new URL(request.url);
    // const query = url.searchParams.get("q");
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa('user:pass')}`,
    }
    const res = await fetch(`${BASE_URL}/api/static/environments`, {headers});

    // Retrieve("/api/static/environments")

    return json<EnvironmentRecord>(await res.json());
}


export default function Entry() {
    const records = useLoaderData<typeof loader>();
    return (
        <ul>
            {records.map(env => (
                <li key={env}>
                    {env}
                </li>
            ))}
        </ul>
    );
}