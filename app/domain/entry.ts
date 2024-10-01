export type Entry = {
    key: string
    value: string
    secure: boolean
}

export type EntryRecord = Entry & {
    path: string
}
