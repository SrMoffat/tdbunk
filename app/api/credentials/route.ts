import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import cors from "cors";

const VC_ISSUER_UL = 'https://mock-idv.tbddev.org/kcc'

interface RequestContext {
    params: {
        id: string;
    };
}

const handlePost = createEdgeRouter<NextRequest, RequestContext>();

handlePost
    .use(async (req, event, next) => {
        const start = Date.now();
        cors()
        const end = Date.now();
        console.log(`Request took ${end - start} ms`);
        return await next();
    })
    .post(async (req) => {
        const { email: name, country, did } = await req.json()
        
        const queryParams = `?name=${name}&country=${country.value}&did=${did}`
        const url = `${VC_ISSUER_UL}${queryParams}`

        const response = await fetch(url);
        const vc = await response.text();

        console.log(`VC`, vc);
        return NextResponse.json({ vc });
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