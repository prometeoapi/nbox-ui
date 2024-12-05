import {FC, Fragment} from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList, BreadcrumbPage,
    BreadcrumbSeparator
} from "~/components/ui/breadcrumb";
import {SlashIcon} from "lucide-react";
import {cn} from "~/lib/utils";

export const EntryBreadcrumb: FC<{ path: string | null }> = ({path = ""}) => (
    <Breadcrumb className="mt-2 pb-2 ml-6">
        <BreadcrumbList>

            <BreadcrumbItem>
                <BreadcrumbLink href={`/entry`} className={`text-lg`}>
                    {(path == "") ? <span className="text-orange-400">seleccione un path</span> :"root"}
                </BreadcrumbLink>
            </BreadcrumbItem>
            {
                path && <BreadcrumbSeparator>
                    <SlashIcon/>
                </BreadcrumbSeparator>
            }

            {path?.split("/").filter(String).map((p, i, row) => {
                const last = i + 1 === row.length
                const Comp = last ? BreadcrumbPage : BreadcrumbLink
                return (
                    <Fragment key={p}>
                        <BreadcrumbItem>
                            <Comp href={`/entry?prefix=${p}/`} className={cn('text-lg', last ?`text-orange-400` : '')}>{p}</Comp>
                        </BreadcrumbItem>
                        {!last && (
                            <BreadcrumbSeparator>
                                <SlashIcon/>
                            </BreadcrumbSeparator>
                        )}
                    </Fragment>
                )
            })}
        </BreadcrumbList>
    </Breadcrumb>
)