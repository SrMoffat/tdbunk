import { Rfq } from '@tbdex/http-client';
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
    offering,
    amount,
    userDid,
    payinMethods,
    payoutMethods,
    credentials
}: {
    offering: any
    amount: any
    payinMethods: any
    payoutMethods: any
    credentials: any
    userDid: any
}) => {
    try {
        const rfq = Rfq.create({
            metadata: {
                // from: "did:dht:y5nzf5rh5gh8wc86kcquj1erat1391qwzayx1ki93hq64484x9jy",
                // to: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
                from: userDid as string,
                to: offering?.offeringFrom,
                protocol: '1.0',
            },
            data: {
                // offeringId: 'offering_01j5wtrktnftvrwazzvgfk6r3z',
                offeringId: offering?.id,
                payin: {
                    amount: amount?.toString(),
                    // TO DO: Add UI for user to select the payin method
                    // kind: 'GHS_BANK_TRANSFER',
                    kind: payinMethods[0]?.kind,
                    paymentDetails: {}
                },
                payout: {
                    // kind: 'USDC_WALLET_ADDRESS',
                    kind: payoutMethods[0]?.kind,
                    paymentDetails: {
                        address: '0xuuiehiuhie'
                    }
                },
                claims: credentials
            }
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

export const fetchExchanges = async () => { }