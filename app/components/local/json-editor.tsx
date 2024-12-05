import {FC, useCallback, useRef, useState} from 'react'
import {OnMount, Editor} from '@monaco-editor/react'
import {Button} from "~/components/ui/button"
import {Alert, AlertDescription} from "~/components/ui/alert"
import {AlertCircle, FileJson, Upload} from "lucide-react"
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from "~/components/ui/dialog"
import Ajv from 'ajv'

const ajv = new Ajv()

const schema = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Generated schema for Root",
    "type": "array",
    "items": {
        "type": "object",
        "properties": {
            "path": {
                "type": "string"
            },
            "key": {
                "type": "string"
            },
            "value": {
                "type": "string"
            },
            "secure": {
                "type": "boolean"
            }
        },
        "required": [
            "path",
            "key",
            "value",
            // "secure"
        ]
    }
}

const validate = ajv.compile(schema)


type Props = {
    defaultValue: string
    onImport: (json: any) => void,
}

export const JsonEditor: FC<Props> = ({onImport, defaultValue}) => {
    const [code, setCode] = useState(defaultValue)
    const [error, setError] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState(false)
    const editorRef = useRef<any>(null)
    const theme = "vs-dark"

    const handleEditorDidMount: OnMount = (editor) => {
        editorRef.current = editor
    }

    const validateUniqueKeys = (json: any[]): string | null => {
        const keys = new Set()
        for (let i = 0; i < json.length; i++) {
            if (keys.has(json[i].key)) {
                return `Duplicate key "${json[i].key}" found at index ${i}`
            }
            keys.add(json[i].key)
        }
        return null
    }

    const validateJson = useCallback((value: string) => {
        try {
            const parsedJson = JSON.parse(value)
            const valid = validate(parsedJson)

            if (!valid) {
                const errors = validate.errors
                if (errors && errors.length > 0) {
                    setError(`Schema validation error: ${errors[0].message} at ${errors[0].instancePath}`)
                } else {
                    setError('Unknown schema validation error')
                }
            } else {
                const uniqueKeyError = validateUniqueKeys(parsedJson)
                if (uniqueKeyError) {
                    setError(uniqueKeyError)
                } else {
                    setError(null)
                }
            }
        } catch (e) {
            setError(`JSON syntax error: ${(e as Error).message}`)
        }
    }, [])

    const handleEditorChange = (value: string | undefined) => {
        const newValue = value || ''
        setCode(newValue)
        validateJson(newValue)
    }

    const formatJson = () => {
        try {
            const formatted = JSON.stringify(JSON.parse(code), null, 2)
            setCode(formatted)
            editorRef.current?.setValue(formatted)
            validateJson(formatted)
        } catch (e) {
            setError(`Formatting error: ${(e as Error).message}`)
        }
    }

    const handleImport = () => {
        let parsedJson = []
        try {
            parsedJson = JSON.parse(code)
            close()
        } catch (e) {
            setError(`Import error: ${(e as Error).message}`)
        } finally {
            onImport(parsedJson)
        }
    }

    const close = () => {
        setIsOpen(false)
        setCode(defaultValue)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="bg-gray-900/50 border-gray-700 hover:bg-gray-600">
                    <Upload className="mr-2 h-4 w-4"/> Import
                </Button>
            </DialogTrigger>
            <DialogContent className="border border-gray-900 bg-neutral-900 max-w-3xl h-[80vh] flex flex-col"
                           onInteractOutside={e => e.preventDefault()}
                           aria-describedby="">
                <DialogHeader>
                    <DialogTitle>JSON Editor</DialogTitle>
                </DialogHeader>

                <div className="flex justify-end mb-4">
                    <Button className="hover:text-orange-400"
                            onClick={formatJson}>
                        <FileJson className="mr-2 h-4 w-4"/> Format
                    </Button>
                </div>


                <div className="flex-grow border rounded-md overflow-hidden border-gray-700">
                    <Editor
                        height="100%"
                        language="json"
                        theme={theme}
                        value={code}
                        onChange={handleEditorChange}
                        onMount={handleEditorDidMount}
                        options={{
                            minimap: {enabled: false},
                            fontSize: 14,
                            wordWrap: 'on',
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            formatOnPaste: true,
                            formatOnType: true,
                        }}
                    />
                </div>
                {error && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertCircle className="h-4 w-4"/>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <DialogFooter className="mt-4">
                    <Button type="button"
                            variant="secondary"
                            className="text-orange-300 border border-gray-600 rounded-md shadow-md mr-3 mt-3 hover:bg-gray-600"
                            onClick={() => close()}>
                        Cancel
                    </Button>
                    <Button type="button"
                            className="text-orange-400 border border-gray-600 rounded-md mt-3 hover:bg-gray-600"
                            onClick={handleImport} disabled={!!error}>
                        Import
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}