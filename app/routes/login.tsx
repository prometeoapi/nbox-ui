import {json, type LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Form, useActionData} from "@remix-run/react";

import {redirectIfLoggedInLoader, setAuthOnResponse} from "~/adapters/auth";
import {Button} from "~/components/ui/button";
import {Input} from "~/components/ui/input";
import {Label} from "~/components/ui/label";
import {BASE_URL} from "~/configuration/settings";
import {Box} from "lucide-react";


async function login(username: string, password: string) {
    const res = await fetch(
        `${BASE_URL}/api/auth/token`,
        {
            method: "POST",
            body: JSON.stringify({username: username, password: password}),
            headers: {'Content-Type': 'application/json',}
        }
    )

    if (!res.ok) {
        return ""
    }
    const {token} = await res.json()
    return token
}

function validate(username: string, password: string) {
    const errors: { username?: string; password?: string } = {};

    if (!username) {
        errors.username = "user is required.";
    }

    if (!password) {
        errors.password = "Password is required.";
    }

    return Object.keys(errors).length ? errors : null;
}


export const loader = redirectIfLoggedInLoader;

export const meta = () => {
    return [{title: "nbox login"}];
};

export async function action({request}: LoaderFunctionArgs) {
    const formData = await request.formData();
    const username = String(formData.get("username") || "");
    const password = String(formData.get("password") || "");

    const errors = validate(username, password);
    if (errors) {
        return json({ok: false, errors}, 400);
    }

    const token = await login(username, password);
    if (token === "") {
        return json(
            {ok: false, errors: {password: "Invalid credentials"}},
            400,
        );
    }

    const response = redirect("/");
    return setAuthOnResponse(response, token);
}

// export function Layout(){
//     return <></>
// }

export default function Signup() {
    const actionResult = useActionData<typeof action>();

    return (
        <div className="flex min-h-full flex-1 flex-col mt-20 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-8">
                <div className="text-yellow-500 text-5xl mb-2">
                    <Box className="h-12 w-12 text-yellow-500"/>
                </div>
                <h1 className="text-yellow-500 text-2xl font-bold">nbox</h1>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
                <div className="bg-gray-900/50 px-6 py-12 shadow sm:rounded-lg sm:px-12">
                    <Form className="space-y-6" method="post">
                        <div>
                            <Label htmlFor="username" className="text-lg text-white">
                                username{" "}
                                {actionResult?.errors?.username && (
                                    <span id="username-error" className="text-sm text-red-700">
                    {actionResult.errors.email}
                  </span>
                                )}
                            </Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                aria-describedby={
                                    actionResult?.errors?.username ? "username-error" : "login-header"
                                }
                                required
                                className="bg-gray-700/50 border focus:border-gray-600 border-gray-500 rounded-md"
                            />
                        </div>

                        <div>
                            <Label htmlFor="password" className="text-lg text-white">
                                password{" "}
                                {actionResult?.errors?.password && (
                                    <span id="password-error" className="text-sm text-red-700">
                    {actionResult.errors.password}
                  </span>
                                )}
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-describedby="password-error"
                                required
                                className="bg-gray-700/50 border focus:border-gray-600 border-gray-500 rounded-md"
                            />
                        </div>

                        <div>
                            <Button type="submit" className="text-xl border border-gray-600">Sign in</Button>
                        </div>
                    </Form>
                </div>
            </div>
        </div>
    );
}