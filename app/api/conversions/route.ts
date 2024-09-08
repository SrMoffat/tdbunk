import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '58faa419858f91e90f7ab302'
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6'

interface RequestContext { }

const handlePost = createEdgeRouter<NextRequest, RequestContext>();

handlePost
    .use(async (req, event, next) => {
        cors()
        return await next();
    })
    .post(async (req) => {
        const { source, destination, amount } = await req.json()

        const baseUrl = `${EXCHANGE_RATE_API_URL}/${EXCHANGE_RATE_API_KEY}/pair/${source}/${destination}`
        const url = `${amount ? `${baseUrl}/${amount}` : baseUrl}`

        console.log("Use PAID API Handler:url", url)

        const response = await fetch(url);
        const conversion = await response.json();

        return NextResponse.json(conversion);
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