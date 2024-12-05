import {FC} from "react";
import {EnvironmentRecords} from "~/domain/event";
import {Link} from "@remix-run/react";
import {Button} from "~/components/ui/button";
import {cn} from "~/lib/utils";

export const Prefixes: FC<{ prefixes: EnvironmentRecords, query: string }> = ({prefixes, query}) => (
    <>
        {prefixes.map(env => (
            <Link key={env} to={`?prefix=${env}`}>
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start px-4 py-2 mb-1 text-xl",
                        (query === env || query?.startsWith(env))
                            ? "bg-muted hover:bg-muted"
                            : "hover:bg-transparent hover:underline"
                    )}
                >
                    {env}
                </Button>
            </Link>
        ))}
    </>
)