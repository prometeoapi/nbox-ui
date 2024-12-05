import {Button} from "~/components/ui/button"
import {Download, Pencil, PencilOff} from 'lucide-react'
import {JsonEditor} from "~/components/local/json-editor"
import { ClientOnly } from "remix-utils/client-only"
import {JSON_DEFAULT_ENTRY} from "~/configuration/settings";

interface OptionsBarProps {
    show: boolean
    isEditableAll: boolean
    onDownload: () => void
    onEditable: () => void
    onImport: (json: any) => void
}

export default function ToolBar({onEditable, onDownload, isEditableAll, show, onImport}: OptionsBarProps) {

    return (
        <div
            className="flex items-end space-x-2 p-3  shadow-lg">
            {show &&
                <>
                    <Button variant="outline" onClick={() => onEditable()}
                            className="bg-gray-900/50 border-gray-700 hover:bg-gray-600">
                        {
                            isEditableAll
                                ? <> <PencilOff className="mr-2 h-4 w-4 "/> <span
                                    className="line-through">Edit all</span> </>
                                : <><Pencil className="mr-2 h-4 w-4"/> Edit all </>
                        }
                    </Button>

                    <Button variant="outline" onClick={() => onDownload()}
                            className="bg-gray-900/50 border-gray-700 hover:bg-gray-600">
                        <Download className="mr-2 h-4 w-4"/> Download
                    </Button>
                </>
            }
            <ClientOnly >
                {() => <JsonEditor onImport={onImport} defaultValue={JSON_DEFAULT_ENTRY}/> }
            </ClientOnly>

        </div>
    )
}