import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import cors from "cors";

const VC_ISSUER_URL = 'https://mock-idv.tbddev.org/kcc'

interface RequestContext {
    params: {
        id: string;
    };
}

const handlePost = createEdgeRouter<NextRequest, RequestContext>();

handlePost
    .use(async (req, event, next) => {
        cors()
        return await next();
    })
    .post(async (req) => {
        const { email: name, country, did } = await req.json()
        
        const queryParams = `?name=${name}&country=${country.value}&did=${did}`
        const url = `${VC_ISSUER_URL}${queryParams}`

        const response = await fetch(url);
        const vc = await response.text();

        return NextResponse.json(vc);
    })

export async function POST(request: NextRequest, ctx: RequestContext) {
    try {
        // TO DO: Might want to setup a custom VC since sandbox is limited to just name and country
        return handlePost.run(request, ctx);
    } catch (error: any) {
        // TODO: Better error handling
        console.log("POST failed", error)
        return Response.json({ error })
    }
}