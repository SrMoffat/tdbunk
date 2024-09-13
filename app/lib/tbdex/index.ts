import { Rfq, TbdexHttpClient, Close, Quote, Order, OrderStatus } from '@tbdex/http-client';
import { BearerDid } from '@web5/dids';
import { BEARER_DID_LOCAL_STORAGE_KEY, PFIs, TBDEX_MESSAGE_TYPES, TBDEX_MESSAGE_TYPES_TO_STATUS, TDBUNK_CANCEL_REASON } from "@/app/lib/constants";
import { parse, stringify, toJSON, fromJSON } from 'flatted';

// Poll every 10 seconds
const EXCHANGES_POLLING_INTERVAL_MS = 10000;

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

export const isMessageRfq = (message: any) => {
    const isRfq = message.metadata.kind === TBDEX_MESSAGE_TYPES.RFQ
    const isRfqInstance = message instanceof Rfq
    return isRfq || isRfqInstance
}

export const isMessageQuote = (message: any) => {
    const isQuote = message.metadata.kind === TBDEX_MESSAGE_TYPES.QUOTE
    const isQuoteInstance = message instanceof Quote
    return isQuote || isQuoteInstance
}

export const isMessageOrder = (message: any) => {
    const isOrder = message.metadata.kind === TBDEX_MESSAGE_TYPES.ORDER
    const isOrderInstance = message instanceof Order
    return isOrder || isOrderInstance
}

export const isMessageOrderStatus = (message: any) => {
    const isOrderStatus = message.metadata.kind === TBDEX_MESSAGE_TYPES.ORDER_STATUS
    const isOrderStatusInstance = message instanceof OrderStatus
    return isOrderStatus || isOrderStatusInstance
}

export const isMessageClose = (message: any) => {
    const isClose = message.metadata.kind === TBDEX_MESSAGE_TYPES.CLOSE
    const isCloseInstance = message instanceof Close
    return isClose || isCloseInstance
}

export const getRfqMessage = (exchangeMessage: any) => {
    return exchangeMessage.find((entry: any) => isMessageRfq(entry))
}

export const getQuoteMessage = (exchangeMessage: any) => {
    return exchangeMessage.find((entry: any) => isMessageQuote(entry))
}

export const getOrderMessage = (exchangeMessage: any) => {
    return exchangeMessage.find((entry: any) => isMessageOrder(entry))
}

export const getOrderStatusMessage = (exchangeMessage: any) => {
    return exchangeMessage.find((entry: any) => isMessageOrderStatus(entry))
}

export const getCloseMessage = (exchangeMessage: any) => {
    return exchangeMessage.find((entry: any) => isMessageClose(entry))
}

export const generateExchangeStatusValues = (exchangeMessage: any) => {
    let status = ''

    const rfq = isMessageRfq(exchangeMessage)
    const quote = isMessageQuote(exchangeMessage)
    const order = isMessageOrder(exchangeMessage)
    const orderStatus = isMessageOrderStatus(exchangeMessage)
    const close = isMessageClose(exchangeMessage)

    const RFQ_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.RFQ
    const QUOTE_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.QUOTE
    const ORDER_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.ORDER
    const ORDER_STATUS_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.ORDER_STATUS
    const CLOSE_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE
    const CLOSE_SUCCESS_STATUS_NAME = TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE_SUCCESS

    switch (true) {
        case rfq: {
            // const rfqData = exchangeMessage?.data
            // const rfqAmount = rfqData?.payin?.amount
            status = RFQ_STATUS_NAME
            console.log("RFQ_STATUS_NAME", {
                exchangeMessage,
            })
            break
        }
        case quote: {
            // const quoteData = exchangeMessage?.data
            // const quoteExpiration = quoteData?.expiresAt
            status = QUOTE_STATUS_NAME
            console.log("QUOTE_STATUS_NAME", {
                exchangeMessage,
            })

            break
        }
        case order: {
            status = ORDER_STATUS_NAME
            console.log("ORDER_STATUS_NAME", {
                exchangeMessage,
            })

            // const orderData = exchangeMessage?.data
            break
        }
        case orderStatus: {
            status = ORDER_STATUS_STATUS_NAME
            console.log("ORDER_STATUS_STATUS_NAME", {
                exchangeMessage,
            })

            // const orderStatusData = exchangeMessage?.data
            break
        }
        case close: {
            const closeData = exchangeMessage?.data
            const closeReason = closeData?.reason
            const closeSuccess = closeData?.success

            const isCancellation = closeReason.includes(TDBUNK_CANCEL_REASON)
            const isCompletion = closeReason.includes('SUCCESS')

            if (isCancellation) {
                status = CLOSE_STATUS_NAME
            } else if (isCompletion && closeSuccess) {
                status = CLOSE_SUCCESS_STATUS_NAME
            }

            console.log("CLOSE_STATUS_NAME", {
                exchangeMessage,
                closeReason,
                closeSuccess
            })
            break
        }
        default: {
            break
        }
    }

    console.log("Check Message Status", {
        status
    })

    return status
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

export const getAllPfiExchanges = async (bearerDid: any) => {
    const exchangesResults = []

    for (const pfi of PFIs) {
        const exchanges = await TbdexHttpClient.getExchanges({
            pfiDid: pfi.did,
            did: bearerDid.did
        });

        exchangesResults.push(...exchanges)
    }

    return exchangesResults
}

export const pollExchanges = (bearer: any, callback: any) => {
    const fetchAllExchanges = async () => {
        if (!bearer) return

        try {
            const exchangesResults = await getAllPfiExchanges(bearer)

            for (const exchange of exchangesResults) {
                const mostRecentMessage = exchange[exchange.length - 1]
                const status = generateExchangeStatusValues(mostRecentMessage)
                callback({
                    status,
                    mostRecentMessage,
                })
            }

        } catch (error) {
            console.error("Failed to fetch exchanges:", error);
        }
    };

    // Set up the interval to run the function periodically
    const pollingIntervalId = setInterval(fetchAllExchanges, EXCHANGES_POLLING_INTERVAL_MS);
    console.log("Setting interval ID", pollingIntervalId)
    return pollingIntervalId
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

        console.log('=> sendCloseMessage', {
            userBearerDid,
            pfiDid,
            exchangeId,
            reason,
            close,
        })


        await close.sign(userBearerDid?.did)

        await TbdexHttpClient.submitClose(close)

        return close
    } catch (error: any) {
        console.error('Send close messaage errored', error)
    }
}

export const sendOrderMessage = async ({
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

        console.log('=> sendOrderMessage', {
            userBearerDid,
            pfiDid,
            exchangeId,
            order,
        })

        await order.sign(userBearerDid?.did)

        await TbdexHttpClient.submitOrder(order)

        return order
    } catch (error: any) {
        console.error('Error sending order message', error)
    }
}
