import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

interface RequestContext {}

const handlePost = createEdgeRouter<NextRequest, RequestContext>();
const handleGet = createEdgeRouter<NextRequest, RequestContext>();

handlePost
    .post(async (req) => {
        const requestBody = await req.json()
        console.log("POST requestBody", requestBody)
        return NextResponse.json('POST /exchanges');
    })

handleGet
    .get(async (req) => {
        const requestBody = await req.json()
        console.log("GET requestBody", requestBody)
        return NextResponse.json('GET /exchanges');
    })

export async function POST(request: NextRequest, ctx: RequestContext) {
    try {
        return handlePost.run(request, ctx);
    } catch (error: any) {
        // TODO: Better error handling
        console.log("POST failed", error)
        return Response.json({ error })
    }
}

export async function GET(request: NextRequest, ctx: RequestContext) {
    try {
        return handleGet.run(request, ctx);
    } catch (error: any) {
        // TODO: Better error handling
        console.log("POST failed", error)
        return Response.json({ error })
    }
}