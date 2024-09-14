import cors from "cors";
import { createEdgeRouter } from "next-connect";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '65d8d437e971f9ab656f086e'
// const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '17caec0b37b62a0b986d745e' // Exhausted
// const EXCHANGE_RATE_API_KEY = process.env.EXCHANGE_RATE_API_KEY || '58faa419858f91e90f7ab302' // Exhausted
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


        console.log("Use PAID API Hafndler:url", {
            url,
            source,
            destination,
            amount,
            conversion
        })
        return conversion
    })

export async function POST(request: NextRequest, ctx: RequestContext) {
    try {
        const conversion: any = await handlePost.run(request, ctx);

        console.log("<=== Conversion Result Handlerrrr==>", conversion)
        return NextResponse.json(conversion);
    } catch (error: any) {
        // TODO: Better error handling
        console.log("<=== Conversion Error Handlerrrr==>", error)
        return Response.json({ error })
    }
}