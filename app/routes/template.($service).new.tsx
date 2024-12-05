import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {ClientOnly} from "remix-utils/client-only"

import {EnvironmentRecords} from "~/domain/event";
import {Form, useLoaderData, useRouteError} from "@remix-run/react";
import {Button} from "~/components/ui/button";
import {Save} from "lucide-react";
import {Editor, OnMount} from "@monaco-editor/react";
import {useRef, useState} from "react";
import {Input} from "~/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "~/components/ui/select";
import {Repository} from "~/adapters";


export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error)
    return <div>Internal Error</div>;
}

export const action = async ({request}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const template = formData.get("template")
    const stage = formData.get("stage")
    const service = formData.get("service")
    const templateName = formData.get("templateName")

    if (typeof template !== "string") throw new Error('template is empty')
    if (typeof stage !== "string") throw new Error('stage is empty')
    if (typeof service !== "string") throw new Error('service is empty')

    const [res, err] = await Repository.template.upsert(
        {
            template,
            stage,
            service,
            templateName: typeof templateName !== "string" ? "task_definition.json" : templateName
        },
        request
    )

    if (err !== null) {
        throw err
    }

    if (res.length === 0) return redirect(`/template`)

    const [servideSaved, stageSaved, templateSaved] = res[0].split("/")
    return redirect(`/template/${servideSaved}/${stageSaved}/${templateSaved}`, {})
}


export async function loader({request, params}: LoaderFunctionArgs) {
    const environments: EnvironmentRecords = await Repository.template.environments(request)
    const {service = ""} = params

    return json({
        service,
        environments
    })
}

export default function NewTemplate() {
    const {environments = [], service} = useLoaderData<typeof loader>();

    const [template, setTemplate] = useState<string>("")

    const editorRef = useRef<any>(null)

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
    }

    const handleEditorChange = (value: string | undefined) => {
        const newValue = value || ''
        setTemplate(newValue)
    }

    return (
        <>
            <Form method="post">
                <input type="hidden" name="template" defaultValue={template}/>
                <div
                    className="flex justify-between items-center w-full space-x-2 p-3 shadow-lg mb-4">

                    <div className="flex flex-row">
                        <input type="hidden" defaultValue={template} name="template"/>

                        <Input type="text" name="service" placeholder="service name"
                               defaultValue={service}
                               className="mr-6 bg-gray-700/50 border focus:border-gray-600 border-gray-500 rounded-md"/>

                        <Select name="stage">
                            <SelectTrigger className="w-64 mr-6">
                                <SelectValue placeholder="Select a environments"/>
                            </SelectTrigger>
                            <SelectContent className="w-64 bg-gray-700/60 border-gray-700 rounded-md">
                                <SelectGroup>
                                    <SelectLabel>Environments</SelectLabel>
                                    {environments.map(env =>
                                        <SelectItem key={env} value={env}>{env}</SelectItem>
                                    )}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <Input type="text" name="templateName" placeholder="template name"
                               defaultValue="task_definition.json"
                               readOnly={true}
                               className="bg-gray-700/50 border focus:border-gray-600 border-gray-500 rounded-md"/>
                    </div>

                    <Button type="submit"
                            className=" border ml-6 border-gray-600 rounded-md  mt-3 hover:bg-gray-600 hover:text-orange-400">
                        <Save className="mr-2 h-4 w-4"/> Save
                    </Button>
                </div>


                <ClientOnly>
                    {() =>
                        <div className="border border-gray-900 bg-neutral-900 h-[70vh] w-full flex flex-col">
                            <div className="flex-grow border rounded-md overflow-hidden border-gray-700">
                                <Editor
                                    height="100%"
                                    width="100%"
                                    language="json"
                                    theme={"vs-dark"}
                                    onChange={handleEditorChange}
                                    onMount={handleEditorDidMount}
                                    options={{
                                        minimap: {enabled: false},
                                        fontSize: 14,
                                        wordWrap: 'on',
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        cursorStyle: 'block'
                                    }}
                                /></div>
                        </div>}
                </ClientOnly>
            </Form>
        </>
    )
}