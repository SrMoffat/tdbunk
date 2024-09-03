import { Rfq, TbdexHttpClient } from '@tbdex/http-client';
import { BearerDid } from '@web5/dids';

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
