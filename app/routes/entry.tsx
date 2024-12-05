import {ActionFunctionArgs, json, LoaderFunctionArgs} from "@remix-run/node";
import { useActionData, useLoaderData, useRouteError} from "@remix-run/react";
import {EnvironmentRecords} from "~/domain/event";
import {EntryRecord, EntryRecords} from "~/domain/entry";
import {useEffect, useState} from "react";

import {ScrollArea} from "~/components/ui/scroll-area";
import {EntryBreadcrumb} from "~/components/local/entry-breadcrumb";
import {Variables} from "~/components/local/entry-variables";
import {Prefixes} from "~/components/local/entry-prefixes";
import ToolBar from "~/components/local/tool-bar";
import {useToast} from "~/hooks/use-toast";
import {requireAuthCookie} from "~/adapters/auth";
import {Repository} from "~/adapters";


type Exchange = {
    prefixes: EnvironmentRecords
    prefix: string | null
    entries: EntryRecords
}


export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error)
    return <div>Internal Error</div>;
}

function getPrefix(request: Request) {
    const url = new URL(request.url);
    return url.searchParams.get("prefix");
}


export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const [success, errors] = await Repository.entry.upsert(formData, request);
    return json({errors, success})
}

export async function loader({request}: LoaderFunctionArgs) {
    await requireAuthCookie(request)

    const prefix = getPrefix(request)
    const [entries, prefixes] = await Repository.entry.retrieve(request, prefix)

    return json<Exchange>({
        prefixes: prefixes,
        prefix,
        entries,
    });
}

// export const clientAction = async ({serverAction,}: ClientActionFunctionArgs) => {
//     const data = await serverAction<typeof action>();
//     return data
// }


export default function Entry() {
    // const { errors } = useActionData<typeof action>();
    const {prefixes = [], prefix, entries = []} = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();
    const {toast} = useToast()


    const [query, setQuery] = useState(prefix || "");
    const [isEditable, updateIsEditable] = useState<{ [key: string]: boolean }>(
        {}
    )
    const [isEditableAll, setIsEditableAll] = useState<boolean>(false)
    const [newEntries, setNewEntries] = useState<EntryRecord[]>([])


    useEffect(() => {

        if (Object.keys(actionData?.errors || {}).length === 0) {
            updateIsEditable({})
            setIsEditableAll(false)
            setNewEntries([])
        }

        const errors: string[] = []
        for (const [k, v] of Object.entries(actionData?.errors || {})) {
            errors.push( `${k}: ${v}`)
        }

        if (errors.length >=0){
            toast({
                variant: "destructive",
                title: `Errors`,
                description: `${errors.join("\n")}`,
            })
        }

        if (actionData?.success ) {
            toast({
                // variant: "destructive",
                title: `Saved`,
                description: `${actionData?.success.join("\n")}`,
                className: "bg-gray-700 border border-gray-800",
            })
        }

    }, [actionData]);

    const toggleEdit = (id: string) => {
        updateIsEditable((prevState) => ({...prevState, [id]: !prevState[id]}))
    }

    const toggleEditAll = () => {
        updateIsEditable(
            Object.assign(
                {}, ...entries.map<{ [key: string]: boolean }>(e => ({[e.key]: !isEditableAll}))
            ))
        setIsEditableAll(!isEditableAll)
    }

    const handleDownload = () => {
        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(entries?.filter(e => !e.key.endsWith("/")), null, 4)
        )}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `entries-${prefix?.split("/").slice(0, -1).join("-")}.json`;
        link.click();
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                toast({
                    description: "copied to clipboards",
                    className: "bg-gray-700 border border-gray-800",
                })
            })
    }

    const handleImport = (json: any) => {
        console.log('onImport', json)
        setNewEntries(prevState => (
                Object.values(Object.assign({}, ...[...prevState, ...json].map(e => ({[`${e.path}/${e.key}`]: e}))))
            )
        )
    }

    useEffect(() => {
        setQuery(prefix || "");
    }, [prefix]);

    return (
        <div className="flex h-screen">
            <nav className="w-96 bg-background border-r border-r-gray-600 h-screen">
                <div className="p-4 border-b border-b-gray-600">
                    <h1 className="text-xl font-bold">path</h1>
                </div>
                <ScrollArea className="h-[calc(100vh-5rem)] py-2">
                    <Prefixes prefixes={prefixes} query={query}/>
                </ScrollArea>
            </nav>

            <div className="flex-1 flex flex-col">
                <header className="bg-background border-b border-b-gray-600 p-2">
                    <EntryBreadcrumb path={query}/>
                </header>
                <div className="flex-1 flex overflow-hidden">
                    <main className="flex-1 overflow-auto p-6">
                        <div className="flex flex-col ">
                            <ToolBar
                                show={entries.length > 0}
                                isEditableAll={isEditableAll}
                                onEditable={toggleEditAll}
                                onDownload={handleDownload}
                                onImport={handleImport}
                            />
                        </div>
                        <Variables
                            // ref={form}
                            entries={entries}
                            newEntries={newEntries}
                            onEditable={toggleEdit}
                            onCopy={handleCopy}
                            isEditable={(id: string) => isEditable[id]}
                        />
                    </main>

                </div>
            </div>
        </div>
    )
}