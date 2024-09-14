import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// const CURRENCY_LAYER_EXCHANGE_RATE_API_URL = 'http://apilayer.net/api/live'
// const CURRENCY_LAYER_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '918216d68ec274a2d48d6dd3ae4fdbb0'
const CRYPTO_EXCHANGE_RATE_API_URL = 'https://api.coingate.com/api/v2/rates/merchant'

interface RequestContext { }

const handleGet = createEdgeRouter<NextRequest, RequestContext>();

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

        return result
    })

export async function GET(request: NextRequest, ctx: RequestContext) {
    try {
        const result = await handleGet.run(request, ctx);
        return NextResponse.json(result)
    } catch (error: any) {
        // TODO: Better error handling
        console.log("GET failed", error)
        return Response.json({ error })
    }
}
