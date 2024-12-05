import {FC} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "~/components/ui/tooltip";
import {Button} from "~/components/ui/button";
import {HelpCircle} from "lucide-react";

export const EditorHelp: FC = () => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                    <HelpCircle className="h-4 w-4" />
                    <span className="sr-only">JSON Format Help</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <div className="max-w-xs">
                    <p className="font-bold mb-2">JSON Format:</p>
                    <p>An array of objects, each with:</p>
                    <ul className="list-disc pl-4">
                        <li>path (string)</li>
                        <li>key (string, must be unique)</li>
                        <li>value (string)</li>
                        <li>secure (boolean)</li>
                    </ul>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)