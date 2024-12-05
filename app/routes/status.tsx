import {HeadersFunction} from "@remix-run/node";

export const headers: HeadersFunction = () => ({
    "Content-Type": "application/html; charset=utf-8",
});


export async function loader() {
    return new Response("HEALTHY", { status: 200 });
}