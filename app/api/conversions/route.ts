import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '65d8d437e971f9ab656f086e'
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

        const response = await fetch(url);
        const conversion = await response.json();

        return conversion
    })

export async function POST(request: NextRequest, ctx: RequestContext) {
    try {
        const conversion: any = await handlePost.run(request, ctx);
        return NextResponse.json(conversion);
    } catch (error: any) {
        // TODO: Better error handling
        return Response.json({ error })
    }
}