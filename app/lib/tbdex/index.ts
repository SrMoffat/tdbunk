import { Rfq, TbdexHttpClient, Close, Quote, Order } from '@tbdex/http-client';
import { BearerDid } from '@web5/dids';
import { PFIs } from "@/app/lib/constants";

// Poll every 3 seconds
const EXCHANGES_POLLING_INTERVAL_MS = 3000;

export interface CloseMessageArgs {
    pfiDid: string;
    reason: string;
    userBearerDid: any;
    exchangeId: string;
}

export interface OrderMessageArgs {
    pfiDid: string;
    userBearerDid: any;
    exchangeId: string;
}

export const validateOffering = async ({
    rfq,
    offering
}: any) => {
    try {
        await rfq.verifyOfferingRequirements(offering)

    } catch (error: any) {
        console.log("Offering validation failed", error)
    }
}

export const createRfQ = async ({
    amount,
    offering,
    credentials,
    userBearerDid,
    requiredPaymentDetails
}: {
    amount: any
    offering: any
    credentials: any
    userBearerDid: any
    requiredPaymentDetails: any
}) => {
    console.log("Create RFQ 🚀", {
        amount,
        offering,
        credentials,
        userBearerDid,
        requiredPaymentDetails
    })

    const userDidUri = userBearerDid.did.uri as string
    const pfiDidUri = offering.metadata.from as string

    const payinData = offering.data.payin
    const payinMethods = payinData.methods

    const payoutData = offering.data.payout
    const payoutMethods = payoutData.methods

    // To do: Implement severel payin methods too after adding UI to select
    const payinKind = payinMethods[0].kind
    const payoutKind = payoutMethods[0].kind

    try {
        const rfq = Rfq.create({
            metadata: {
                from: userDidUri,
                to: pfiDidUri,
                protocol: '1.0',
            },
            data: {
                offeringId: offering?.id,
                payin: {
                    amount: amount?.toString(),
                    // TO DO: Add UI for user to select the payin method
                    kind: payinKind,
                    paymentDetails: {
                        ...requiredPaymentDetails.payin
                    }
                },
                payout: {
                    kind: payoutKind,
                    paymentDetails: {
                        ...requiredPaymentDetails.payout
                    }
                },
                claims: credentials
            }
        })

        await validateOffering({
            rfq,
            offering
        })

        await signRfQ({
            rfq: rfq as Rfq,
            // @ts-ignore
            did: userBearerDid?.did
        })

        console.log("RFQ Flow", {
            rfq,
        })

        return rfq

    } catch (error: any) {
        console.log("Create RFQ Failed", error)

    }
}

export const signRfQ = async ({
    rfq,
    did
}: {
    rfq: Rfq
    did: BearerDid
}) => {
    try {
        await rfq.sign(did)
    } catch (error: any) {
        console.log("Signing RFQ errored", error)
    }
}

export const fetchExchanges = async ({ pfiDidUri, userBearerDid }: { pfiDidUri: string, userBearerDid: any }) => {
    const exchanges = await TbdexHttpClient.getExchanges({
        pfiDid: pfiDidUri,
        did: userBearerDid,
    });

    console.log("fetchExchanges", exchanges);

    return exchanges
};

export const generateExchangeStatusValues = (exchangeMessage: any) => {
    if (exchangeMessage instanceof Close) {
        if (exchangeMessage.data.reason!.toLowerCase().includes('complete') || exchangeMessage.data.reason!.toLowerCase().includes('success')) {
            return 'completed'
        } else if (exchangeMessage.data.reason!.toLowerCase().includes('expired')) {
            return exchangeMessage.data.reason!.toLowerCase()
        } else if (exchangeMessage.data.reason!.toLowerCase().includes('cancelled')) {
            return 'cancelled'
        } else {
            return 'failed'
        }
    }
    return exchangeMessage.kind
}

export const getRfqAndQuoteRenderDetails = (rfq: Rfq, quote: Quote) => {
    const rfqData = rfq.data
    const rfqPayin = rfqData.payin
    const rfqPayout = rfqData.payout
    const rfqMetadata = rfq.metadata
    const rfqPrivateData = rfq.privateData
    const rfqPrivateDataPayin = rfqPrivateData!.payin!.paymentDetails
    const rfqPrivateDataPayout = rfqPrivateData!.payout!.paymentDetails

    const rfqDetails = {
        from: rfqMetadata.from,
        to: rfqMetadata.to,
        offeringId: rfqData.offeringId,
        rfqId: rfqMetadata.exchangeId,
        requestedAt: rfqMetadata.createdAt,

        payinKind: rfqPayin.kind,
        payinAmount: rfqPayin.amount,
        payinData: rfqPrivateDataPayin,

        payoutKind: rfqPayout.kind,
        payoutData: rfqPrivateDataPayout,
    }

    const getQuoteRenderDetails = (quoteArg: any) => {
        const quote = quoteArg

        const quoteData = quote.data
        const quotePayin = quoteData.payin
        const quotePayout = quoteData.payout
        const quoteMetadata = quote.metadata

        const quotePayinFee = quotePayin.fee
        const quotePayinAmount = quotePayin.amount
        const amountWithFee = quotePayinFee
            ? Number(quotePayinAmount) + Number(quotePayinFee)
            : Number(quotePayinAmount)

        const fromAmountWithFee = amountWithFee.toString() //|| rfqData!.payinAmount

        return {
            expiresAt: quoteData.expiresAt,

            from: quoteMetadata.from,
            to: quoteMetadata.to,
            rfqId: quoteMetadata.exchangeId,
            quotedAt: quoteMetadata.createdAt,

            fromCurrency: quotePayin.currencyCode,
            fromAmount: quotePayin.amount,
            fromAmountWithFee,
            fromFee: quotePayinFee,

            toCurrency: quotePayout.currencyCode,
            toAmount: quotePayout.amount,
        }
    }

    const quoteDetails = getQuoteRenderDetails(quote)

    return {
        rfq: rfqDetails,
        quote: quoteDetails
    }
}

export const pollExchanges = (bearer: any, callback: any) => {
    const fetchAllExchanges = async () => {
        try {
            // const exchanges = await fetchExchanges({
            //     userBearerDid: contextUserBearerDid
            // });
            const exchangesResults = []

            for (const pfi of PFIs) {
                const exchanges = await TbdexHttpClient.getExchanges({
                    pfiDid: pfi.did,
                    did: bearer.did
                });

                exchangesResults.push(...exchanges)
            }

            for (const exchange of exchangesResults) {
                const latestMessage = exchange[exchange.length - 1]

                const rfq = exchange.find(entry => entry.metadata.kind === 'rfq')
                const quote = exchange.find(entry => entry.metadata.kind === 'quote')

                const status = generateExchangeStatusValues(exchange)

                const { rfq: rfqRenderDetails, quote: quoteRenderDetails } = getRfqAndQuoteRenderDetails(rfq as Rfq, quote as Quote)

                callback({
                    rfq: rfqRenderDetails,
                    quote: quoteRenderDetails
                })


                console.log('👽👽👽👽👽👽👽👽👽', {
                    status,
                    latestMessage,
                    quoteRenderDetails,
                    rfqRenderDetails,
                })

            }
        } catch (error) {
            console.error("Failed to fetch exchanges:", error);
        }
        // if (!userBearerDid) return;
        // const allExchanges: any[] = [];
    };

    // Set up the interval to run the function periodically
    setInterval(fetchAllExchanges, EXCHANGES_POLLING_INTERVAL_MS);
};

export const sendCloseMessage = async ({
    pfiDid,
    reason,
    exchangeId,
    userBearerDid,
}: CloseMessageArgs) => {
    try {
        const close = Close.create({
            metadata: {
                from: userBearerDid?.did?.uri,
                to: pfiDid,
                exchangeId
            },
            data: {
                reason
            }
        })

        await close.sign(userBearerDid)

        await TbdexHttpClient.submitClose(close)

        return close
    } catch (error: any) {
        console.error('Send close messaage errored', error)
    }
}

export const sendOderMessage = async ({
    pfiDid,
    exchangeId,
    userBearerDid,
}: OrderMessageArgs) => {
    try {
        const order = Order.create({
            metadata: {
                from: userBearerDid?.did?.uri,
                to: pfiDid,
                exchangeId,
                protocol: '1.0'
            }
        })

        await order.sign(userBearerDid)

        await TbdexHttpClient.submitOrder(order)

        return order
    } catch(error: any){
        console.error('Error sending order message', error)
    }
}
