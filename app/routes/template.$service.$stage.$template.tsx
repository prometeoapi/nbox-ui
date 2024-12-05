import {ActionFunctionArgs, json, LoaderFunctionArgs, redirect} from "@remix-run/node";
import {Form, Link, useLoaderData, useRouteError} from "@remix-run/react";
import {ClientOnly} from "remix-utils/client-only"

import {Editor, OnMount} from "@monaco-editor/react";
import {FC, useRef, useState} from "react";
import {Button} from "~/components/ui/button";
import {Braces, Pencil, Play, SaveAll} from "lucide-react";
import {cn} from "~/lib/utils";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "~/components/ui/sheet";
import {Repository} from "~/adapters";

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error)
    return <div>Internal Error</div>;
}

export const action = async ({request, params}: ActionFunctionArgs) => {
    const formData = await request.formData();
    const template = formData.get("template")

    const {stage, service, template: templateName} = params

    if (typeof template !== "string") throw new Error('template is empty')
    if (typeof stage !== "string") throw new Error('stage is empty')
    if (typeof service !== "string") throw new Error('service is empty')
    if (typeof templateName !== "string") throw new Error('templateName is empty')

    const [res, err] = await Repository.template.upsert({
        template,
        stage: stage,
        service: service,
        templateName: templateName
    }, request)


    if (err !== null) {
        throw err
    }

    if (res.length === 0) return redirect(`/template`)

    const [serviceSaved, stageSaved, templateSaved] = res[0].split("/")
    return redirect(`/template/${serviceSaved}/${stageSaved}/${templateSaved}`, {})

}

export async function loader({request, params}: LoaderFunctionArgs) {
    if (typeof params.template !== "string") throw new Error('template is empty')
    if (typeof params.stage !== "string") throw new Error('stage is empty')
    if (typeof params.service !== "string") throw new Error('service is empty')

    const {service, stage, template} = params
    const result = await Repository.template.retrieve({service, stage, template}, request)
    const vars = await Repository.template.vars({service, stage, template}, request)
    return json<{ template: string, vars: string[], service: string | undefined, stage: string | undefined, templateName: string | undefined}>({
        template: result, vars, service, stage, templateName: template
    })
}


const Vars: FC<{ vars: string[] }> = ({vars= []}) => (
    <Sheet>
        <SheetTrigger>
            <Button variant="outline" className="ml-4 bg-gray-900/50 border-gray-700 hover:bg-gray-600">
                <Braces className="mr-2 h-4 w-4"/> Show vars
            </Button>
        </SheetTrigger>
        <SheetContent className="border border-gray-900 bg-neutral-900 w-[500px]">
            <SheetHeader>
                <SheetTitle>templates vars</SheetTitle>
                {vars?.map(v =>
                    <p key={v}>{v}</p>
                )}
            </SheetHeader>
        </SheetContent>
    </Sheet>
)

export default function TemplateRoute() {
    const {template = "", vars = [], templateName, stage, service} = useLoaderData<typeof loader>();
    const editorRef = useRef<any>(null)
    const [isEditable, setEditable] = useState<boolean>(false)

    const [templateChange, setTemplateChange] = useState<string>("")

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
    }

    const handleEditorChange = (value: string | undefined) => {
        const newValue = value || ''
        setTemplateChange(newValue)
    }

    return (
        <>
            <div className="flex justify-between items-center w-full space-x-2 p-3 shadow-lg mb-4">
                <div className="flex flex-row">
                    <Button variant="outline" onClick={() => setEditable(prev => !prev)}
                            className={cn("bg-gray-900/50 hover:bg-gray-600 border-gray-700 mr-6", isEditable ? 'bg-slate-700 text-orange-400' : '')}>
                        <Pencil className="mr-2 h-4 w-4"/> Edit
                    </Button>

                    <Button asChild variant="outline"
                            className="bg-gray-900/50 border-gray-700 hover:bg-gray-600"
                    >
                        <Link to={`/template/${service}/${stage}/${templateName}/build`} target="_blank" rel="noopener noreferrer">
                            <Play className="mr-2 h-4 w-4"/> Build
                        </Link>
                    </Button>
                    <Vars vars={vars} />
                </div>

                <Form method="post">
                    <input type="hidden" defaultValue={templateChange} name="template"/>
                    <Button disabled={!isEditable} variant="outline" type="submit"
                            className={cn("bg-gray-900/50 hover:bg-gray-600 border-gray-700", isEditable ? 'text-orange-400' : '')}>
                        <SaveAll className="mr-2 h-4 w-4"/> Save
                    </Button>
                </Form>
            </div>

            <div className="flex justify-between  w-full space-x-2 p-3 shadow-lg mb-4">
                <div className="flex flex-col flex-auto">
                    <ClientOnly>
                        {() =>
                            <div className="border border-gray-900 bg-neutral-900 w-full h-[80vh] flex flex-col">
                                <div className="flex-grow border rounded-md overflow-hidden border-gray-700">
                                    <Editor
                                        height="100%"
                                        language="json"
                                        theme={"vs-dark"}
                                        value={template}
                                        onChange={handleEditorChange}
                                        onMount={handleEditorDidMount}
                                        options={{
                                            minimap: {enabled: false},
                                            fontSize: 14,
                                            wordWrap: 'on',
                                            scrollBeyondLastLine: false,
                                            automaticLayout: true,
                                            readOnly: !isEditable,
                                            cursorStyle: 'block'
                                        }}
                                    /></div>
                            </div>}
                    </ClientOnly>
                </div>
            </div>


        </>
    )
}