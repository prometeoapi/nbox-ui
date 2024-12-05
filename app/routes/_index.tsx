import {requireAuthCookie} from "~/adapters/auth";
import {LoaderFunctionArgs} from "@remix-run/node";

export async function loader({request}: LoaderFunctionArgs){
    return await requireAuthCookie(request)
}


export default function Index() {
  return (
      <div className="h-[90vh] flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold">
              Welcome to the nbox!
          </h1>
          <p className="text-xl text-amber-500">
              templates | environments vars | secrets
          </p>
      </div>
  );
}

