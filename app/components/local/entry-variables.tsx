import {FC} from "react";
import {Edit2, Save, X, Copy, SaveAll} from "lucide-react"
import {EntryRecord, EntryRecords} from "~/domain/entry";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "~/components/ui/table"
import {TruncateText} from "~/components/local/truncate-text";
import {Form} from "@remix-run/react";
import {Input} from "~/components/ui/input";
import {Button} from "~/components/ui/button";

interface Props {
    onEditable: (id: string) => void
    onCopy: (text: string) => void
    isEditable: (id: string) => boolean
    entries: EntryRecords
    newEntries: EntryRecords
}

export const Variables: FC<Props> = ({entries, onEditable, isEditable, onCopy, newEntries = []}) => (
    <>
        {(entries.length > 0 || newEntries.length > 0) &&
            <div className="flex flex-col overflow-x-auto">
                <div className="sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                        <div className="overflow-x-auto">
                            <Form method="post">
                                <Table className="bg-gray-800/50 min-w-full text-sm font-light text-surface">
                                    {/*<TableCaption>A list of variables.</TableCaption>*/}
                                    <TableHeader className="text-amber-500 text-lg">
                                        <TableRow className="border-b border-b-gray-600 ">
                                            <TableHead className="px-6 py-2"></TableHead>
                                            <TableHead className="px-6 py-2">Name</TableHead>
                                            <TableHead className="px-6 py-2">Value</TableHead>
                                            <TableHead className="px-6 py-2">Secure</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            entries.filter(e => !e.key.endsWith("/")).map((entry, index) => (
                                                <TableRow key={`${entry.path}/${entry.key}`}
                                                          className="border-b border-b-gray-600 font-jetbrains-mono">
                                                    <TableCell className="px-6 py-2">
                                                        {isEditable(entry.key) ? <input type="hidden" value={entry.path}
                                                                                        name={`u${index}-path`}/> : null}
                                                        <div className="flex space-x-1">
                                                            {isEditable(entry.key) ? (
                                                                <>
                                                                    <Button variant="ghost" type="button"
                                                                            onClick={() => onEditable(entry.key)}
                                                                            title="Cancelar">
                                                                        <X className="h-4"/>
                                                                    </Button>
                                                                    <Button variant="ghost" type="submit"
                                                                            title="Guardar">
                                                                        <Save className="h-4"/>
                                                                    </Button>
                                                                </>
                                                            ) : (
                                                                <Button variant="ghost" type="button"
                                                                        onClick={() => onEditable(entry.key)}
                                                                        title="Editar">
                                                                    <Edit2 className="h-4"/>
                                                                </Button>
                                                            )}
                                                            <Button variant="ghost" type="button"
                                                                    onClick={() => onCopy(`${entry.path}/${entry.key} = ${entry.value}`)} className="">
                                                                <Copy className="h-4 w-4"/>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-lime-500 px-6 py-2">
                                                        {isEditable(entry.key) ? <Input
                                                                type="text"
                                                                className="bg-gray-700 border border-gray-400 hover:border-gray-200 blur:border-gray-300 w-full"
                                                                defaultValue={entry.key}
                                                                name={`u${index}-key`}
                                                                placeholder="Key"
                                                            />
                                                            : <span onClick={() => onCopy(`{{${entry.path}/${entry.key}}}`)}>{entry.key}</span>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-gray-300 px-6 py-2">
                                                        {isEditable(entry.key) ? <Input
                                                                type="text"
                                                                className="bg-gray-700 border border-gray-400 hover:border-gray-200 w-full"
                                                                defaultValue={entry.value}
                                                                name={`u${index}-value`}
                                                                placeholder="Value"
                                                            />
                                                            : <TruncateText text={entry.value} maxLength={80}/>
                                                        }
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap px-6 py-2">
                                                        {
                                                            isEditable(entry.key) ?
                                                                <>
                                                                    <input type="checkbox" className="accent-pink-500"
                                                                           name={`u${index}-secure`}
                                                                           defaultChecked={entry.secure}
                                                                           value="true"/>
                                                                </>
                                                                : (entry.secure ? <span className="text-yellow-500 text-lg">yes</span> : 'no')
                                                        }
                                                    </TableCell>

                                                </TableRow>
                                            ))
                                        }

                                        {
                                            newEntries.map((item, index) =>
                                                <TableRow key={`${item.path}/${item.key}`}
                                                          className="border-b border-b-gray-600 font-jetbrains-mono">
                                                    <TableCell className="px-6 py-2">
                                                        <input type="hidden" name={`n${index}-path`}
                                                               defaultValue={item.path}/>{item.path}
                                                    </TableCell>
                                                    <TableCell className="text-lime-500 px-6 py-2">
                                                        <Input
                                                            type="text"
                                                            className="bg-gray-700 border border-gray-400 hover:border-gray-200 blur:border-gray-300 w-full"
                                                            defaultValue={item.key}
                                                            placeholder="Key"
                                                            name={`n${index}-key`}
                                                        />

                                                    </TableCell>
                                                    <TableCell className="text-gray-300 px-6 py-2">
                                                        <Input
                                                            type="text"
                                                            className="bg-gray-700 border border-gray-400 hover:border-gray-200 w-full"
                                                            defaultValue={item.value}
                                                            name={`n${index}-value`}
                                                            placeholder="Value"
                                                        />
                                                    </TableCell>
                                                    <TableCell className="whitespace-nowrap px-6 py-2">
                                                        <input type="checkbox" className="accent-pink-500"
                                                               name={`n${index}-secure`}
                                                               defaultChecked={item.secure} value="true"/>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        }

                                    </TableBody>
                                </Table>
                                <div
                                    className="flex items-end space-x-2 p-3 bg-background bg-slate-800 border-t-2 border-t-slate-900 shadow-lg">
                                    {/*<Button type="submit" variant="secondary"*/}
                                    {/*        className="text-lg text-orange-300 border border-gray-600 rounded-md shadow-md mr-3 mt-3 hover:bg-gray-600">*/}
                                    {/*    <Undo className="mr-2 h-4 w-4"/> Cancel*/}
                                    {/*</Button>*/}
                                    <Button type="submit"
                                            className="text-orange-400 text-lg border border-gray-600 rounded-md  mt-3 hover:bg-gray-600">
                                        <SaveAll className="mr-2 h-4 w-4"/> Save all
                                    </Button>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        }
    </>
)

