export type Entry = {
    key: string
    value: string
    secure: boolean
}

export type EntryRecord = Entry & {
    path: string
}

export type EntryRecords = EntryRecord[]

export type EntryEditable = EntryRecord & {
    isEditing: boolean
}