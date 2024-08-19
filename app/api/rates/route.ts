import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '58faa419858f91e90f7ab302'
const EXCHANGE_RATE_API_URL = 'https://v6.exchangerate-api.com/v6'
const CRYPTO_EXCHANGE_RATE_API_URL = 'https://api.coingate.com/api/v2/rates/merchant'

interface RequestContext { }

const handleGet = createEdgeRouter<NextRequest, RequestContext>();
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

handleGet
    .use(async (req, event, next) => {
        cors()
        return await next();
    })
    .get(async (req) => {
        const { searchParams } = new URL(req.url);

        const source = searchParams.get("source")
        const destination = searchParams.get("destination")

        const url = `${CRYPTO_EXCHANGE_RATE_API_URL}/${source}/${destination}`

        const response = await fetch(url);
        const rate = await response.text();

        const result = {
            source,
            destination,
            rate: parseFloat(rate)
        }

        return NextResponse.json(result)
    })

export async function GET(request: NextRequest, ctx: RequestContext) {
    try {
        return handleGet.run(request, ctx);
    } catch (error: any) {
        // TODO: Better error handling
        console.log("GET failed", error)
        return Response.json({ error })
    }
}
