import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '58faa419858f91e90f7ab302'
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6'

interface RequestContext {}

const handlePost = createEdgeRouter<NextRequest, RequestContext>();

handlePost
    .use(async (req, event, next) => {
        cors()
        return await next();
    })
    .post(async (req) => {
        const { base } = await req.json()

        const url = `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/latest/${base}`

        const response = await fetch(url);
        const res = await response.json();

        return NextResponse.json(res);
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