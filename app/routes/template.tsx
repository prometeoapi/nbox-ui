import {Link, Outlet, useLoaderData, useLocation, useParams, useRouteError} from "@remix-run/react";
import {ScrollArea} from "~/components/ui/scroll-area";
import {json, LoaderFunctionArgs} from "@remix-run/node";
import {Box} from "~/domain/box";
import {Accordion, AccordionItem, AccordionTrigger} from "~/components/ui/accordion";
import {AccordionContent} from "@radix-ui/react-accordion";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {FC, useEffect, useState} from "react";
import {Plus, SlashIcon} from "lucide-react";
import {cn} from "~/lib/utils";
import {requireAuthCookie} from "~/adapters/auth";
import {Repository} from "~/adapters";

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error)
    return <div>Internal Error</div>;
}

export async function loader({request}: LoaderFunctionArgs) {
    await requireAuthCookie(request)

    const boxes = await Repository.template.templates(request)
    return json<{ boxes: Box[] }>({boxes})
}


const TemplateBreadcrumb: FC<{ stage?: string, service?: string }> = ({stage, service}) => {
    const location = useLocation();
    return (
        <Breadcrumb className="mt-2 pb-2 ml-6">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink href={`/template`}>
                    <span className={cn('text-lg', stage ? '' : 'text-orange-400')}>
                        {location.pathname === "/template/new" && 'New '} template
                    </span>
                    </BreadcrumbLink>
                </BreadcrumbItem>

                {stage && <>
                    <BreadcrumbSeparator>
                        <SlashIcon/>
                    </BreadcrumbSeparator>

                    <BreadcrumbItem>
                        <BreadcrumbPage className="text-orange-400 text-lg">
                            {service} - {stage}
                        </BreadcrumbPage>
                    </BreadcrumbItem>
                </>}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export default function TemplateRoute() {
    const {boxes = []} = useLoaderData<typeof loader>();
    const params = useParams()
    const location = useLocation();
    const [defaultOpenItems, setDefaultOpenItems] = useState(params.service)

    useEffect(() => {
        setDefaultOpenItems(params.service)
    }, [params]);

    return (
        <div className="flex h-screen">
            <nav className="w-96 bg-background border-r border-r-gray-600 h-screen">
                <div className="p-4 border-b border-b-gray-600">
                    <div className="flex justify-between items-center w-full">
                        <h1 className="text-xl font-bold">Services</h1>
                        <Link to={params?.service ? `/template/${params?.service}/new` :`/template/new`}>
                            <Plus className={cn("mr-2 h-6 w-6 font-bold hover:text-orange-400 ", location.pathname === "/template/new" ? "text-orange-400" : "")} />
                        </Link>
                    </div>


                </div>
                <ScrollArea className="h-[calc(100vh-5rem)] py-2">
                    <Accordion type="single" collapsible className="w-full" defaultValue={defaultOpenItems}>
                        {boxes.map(((box) => (
                                    <AccordionItem value={box.service} key={box.service} data-state="open"
                                                   className="mr-6 border-b border-b-gray-500">
                                        <AccordionTrigger className="text-lg font-semibold">
                                            {box.service}
                                        </AccordionTrigger>
                                        <AccordionContent>
                                            <ul className="list-none pl-2 mb-4">
                                                {Object.entries(box.stage).map(([stageName, tpl], id) => (
                                                    <li key={id} className="list-none mb-1">
                                                        <Link key={`${box.service}-${stageName}`}
                                                              to={`/template/${box.service}/${stageName}/${tpl.template.value}`}
                                                              className={cn("mb-1 hover:text-orange-400", (params.service === box.service && params.stage === stageName) ? "text-orange-400" : "")}>
                                                            {stageName}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            )
                        )}
                    </Accordion>
                </ScrollArea>
            </nav>

            <div className="flex-1 flex flex-col">
                <header className="bg-background border-b border-b-gray-600 p-2">
                    <TemplateBreadcrumb stage={params.stage} service={params.service}/>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <main className="flex-1 overflow-auto p-6">
                        {/*<div className="flex flex-col ">*/}
                        <Outlet/>
                        {/*</div>*/}
                    </main>

                </div>
            </div>
        </div>
    )
}