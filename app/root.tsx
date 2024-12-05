import {Link, Links, Meta, NavLink, Outlet, Scripts, ScrollRestoration, useLoaderData,} from "@remix-run/react";
import {json, LinksFunction, LoaderFunctionArgs, MetaFunction} from "@remix-run/node";


import stylesheet from "~/tailwind.css?url";
import {Toaster} from "~/components/ui/toaster";
import {Box, LogOut, User} from "lucide-react";
import {decodeToken, getAuthFromRequest} from "~/adapters/auth";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "~/components/ui/dropdown-menu";
import {GlobalLoading} from "~/components/local/global-loading";

type NavItem = {
    title: string
    href: string
}

export const meta: MetaFunction = () => {
    return [
        {title: "nbox"},
        {name: "description", content: "Welcome to nbox!"},
    ];
};

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await getAuthFromRequest(request);
    const claims = await decodeToken(token)
    return json(claims)
}


export const links: LinksFunction = () => [
    {rel: "stylesheet", href: stylesheet},
    {rel: "preconnect", href: "https://fonts.googleapis.com"},
    {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
    },
    {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Courier+Prime:ital,wght@0,400;0,700;1,400;1,700&display=swap",
    },
    // {
    //     rel: "stylesheet",
    //     href: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap",
    // },
];


export function Layout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <meta charSet="utf-8"/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <Meta/>
            <Links/>
        </head>
        <body>
        {children}
        <GlobalLoading />
        <ScrollRestoration/>
        <Toaster/>
        <Scripts/>
        </body>
        </html>
    );
}


const navItems: NavItem[] = [
    { title: 'Home', href: '/'},
    { title: 'Templates', href: '/template'},
    { title: 'Entry', href: '/entry'},
]

export default function App() {
    const claims = useLoaderData<typeof loader>();
    return (
        <div className="min-h-full">
            {(claims && claims.username) && (
            <nav className="bg-gray-900 border-b border-slate-700 mx-1">
                <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 items-center justify-between">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Box className="h-6 w-6 text-yellow-500"/>
                                <span className="h-8 w-8 text-lg text-yellow-500">nbox</span>

                                {/*<img className="h-8 w-8"*/}
                                {/*     src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=500"*/}
                                {/*     alt="Your Company"/>*/}
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    {navItems.map(item => (
                                        <NavLink
                                            key={item.title}
                                            className={({isActive}) =>
                                                `rounded-md px-3 py-2 text-lg font-medium ${isActive ? "bg-gray-600  text-orange-400" : "text-gray-300 hover:bg-gray-700 hover:text-white"}`
                                            }
                                            to={item.href}
                                        >
                                            {item.title}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="-mr-2 flex md:hidden">
                            <button type="button"
                                    className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                    aria-controls="mobile-menu" aria-expanded="false">
                                <span className="absolute -inset-0.5"></span>
                                <span className="sr-only">Open main menu</span>
                                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                     stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>
                                </svg>
                                <svg className="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                                     stroke="currentColor" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                            </button>
                        </div>

                        <div className="hidden sm:ml-6 sm:flex sm:items-center">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <span  className="flex items-center text-sm font-medium">
                                        <User className="h-5 w-5 mr-2"/>
                                        {claims?.username}
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-gray-900 border-0">
                                    <DropdownMenuItem>
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        <Link to="/logout">logout</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </nav>)}

            <main>
                <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
                    <Outlet/>
                </div>
            </main>
        </div>
    )
}
