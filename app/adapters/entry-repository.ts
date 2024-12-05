import {Errors, IEntryRepository, Success} from "~/domain/operations";
import {EntryRecords} from "~/domain/entry";
import {EnvironmentRecords} from "~/domain/event";
import {Post, Retrieve} from "~/services/rest";


export function EntryRepository(): IEntryRepository {

    const retrieve = async (request: Request, prefix: string|null): Promise<[EntryRecords, EnvironmentRecords]> => {

        let prefixes: EnvironmentRecords
        let entries: EntryRecords = []

        if (prefix == "" || prefix == null) {
            prefixes = await Retrieve(request, `/api/static/environments`)

            return [entries, prefixes]
        }

        entries = await Retrieve(request, `/api/entry/prefix?v=${prefix}`)
        prefixes = entries?.filter(e => e.key.endsWith("/"))?.map(e => `${e.path}/${e.key}`);
        if (!prefixes.length) {
            prefixes = [prefix]
        }
        return [entries, prefixes]
    }

    const upsert = async (formData: FormData, request: Request): Promise<[Success, Errors]> => {
        const data: {[key: string]: {[key:string]: string|boolean}} = {}
        const success: Success = []
        const errors: Errors = {}


        for (const [key, value] of formData.entries()) {
            const [id, k] = key.split("-");
            data[id] = Object.assign(data[id] || {}, {[k]: value})
        }

        const payload: object[] = []
        for (const item of Object.values(data)) {
            payload.push({
                key: `${item.path}/${item.key}`,
                value: item.value,
                secure: item.secure === "true"
            })

        }

        const [res, status] = await Post(request, "/api/entry", payload)
        if (status !== 200 && status !== 201) {
            return [[], {message: res.detail}]
        }

        for (const [key, value] of Object.entries(res)) {
            if (value && typeof value === "string") {
                errors[key] = value
                continue
            }
            success.push(key)
        }

        return [success, errors]
    }

    return {
        retrieve,
        upsert
    }
}