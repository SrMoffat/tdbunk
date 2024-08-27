import { LANDING_PAGE_TABS, DEBUNK_SOURCE, DEBUNK_CAMPAIGN_TYPE } from "@/app/lib/constants";

export const isCampaign = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.CAMPAIGNS;

export const isDebunks = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.DEBUNKS;

export const isSponsorships = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.SPONSORSHIPS;

export const isFacebook = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.FACEBOOK;

export const isTikTok = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.TIKTOK;

export const isYoutube = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.YOUTUBE;

export const isInstagram = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.INSTAGRAM;

export const isCommunity = (type: DEBUNK_CAMPAIGN_TYPE) => type === DEBUNK_CAMPAIGN_TYPE.COMMUNITY;

export const isSponsored = (type: DEBUNK_CAMPAIGN_TYPE) => type === DEBUNK_CAMPAIGN_TYPE.SPONSORED;

export const toCapitalizedWords = (str: string) => {
    // Replace any camelCase with space-separated words and snake_case with space-separated words
    const spacedString = str.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/_/g, ' ');

    // Capitalize the first letter of each word
    const capitalizedWords = spacedString.replace(/\b\w/g, function (char) {
        return char.toUpperCase();
    });

    return capitalizedWords;
}

export const getFormattedOfferings = (offerings: any[], source: string, destination: string) => {
    let direct = []
    let hops = []

    for (const offer of offerings) {
        const offering = Object.values(offer!)[0] as any

        const [sourceCurrency, destinationCurrency] = offering?.pair
        const sourceCurrencyCode = sourceCurrency?.currencyCode
        const destinationCurrencyCode = destinationCurrency?.currencyCode
        const sourceMatches = source === sourceCurrencyCode
        const destinationMatches = destination === destinationCurrencyCode
        const isHit = sourceMatches && destinationMatches

        if (isHit) {
            // console.log("HIT ===>")
            direct.push(offer)
        } else {
            // console.log("NOT-HIT ===>")
            hops.push(offering)
        }
    }

    return {
        direct,
        hops
    }
}

export const getEstimatedSettlementTime = (methods: any[], fastest: boolean) => {
    // Assumes time is in ms

    const estimates = new Set<number>()

    for (const method of methods) {
        const estimatedSettlementTime = method?.estimatedSettlementTime
        estimates.add(estimatedSettlementTime)
    }

    const slow = Math.max(...estimates)
    const fast = Math.min(...estimates)

    return fastest
        ? fast / 1000
        : Math.round((slow + fast) / 2) / 1000
}

export const formatRequiredClaims = (requiredClaims: any[]) => {
    let claimDetails = {}

    for (const claim of requiredClaims) {
        const constraints = claim.constraints.fields

        for (const constraint of constraints) {
            const path = constraint.path[0].split('$.')[1]
            const filter = constraint.filter.const

            const result = {
                [path]: filter
            }

            claimDetails = {
                ...claimDetails,
                ...result
            }
        }
    }

    return claimDetails
}

export const getPaymentMethodPairs = (methods: any) => {
    const massagedMethods = []

    for (const method of methods) {
        const entry = {
            kind: method.kind,
            title: method.requiredPaymentDetails.title,
            estimatedSettlementTime: method.estimatedSettlementTime,
            paymentProperties: method.requiredPaymentDetails.properties,
        }
        massagedMethods.push(entry)
    }

    return massagedMethods
}

export const getOfferingPairs = (pfis: any) => {
    const pairs = []
    const sourceCurrencies = []
    const destinationCurrencies = []

    for (const pfi of pfis) {
        const pfiDid = Object.keys(pfi)[0]
        const pfiOfferings = pfi[pfiDid]

        for (const offering of pfiOfferings) {
            const metadata = offering.metadata
            const data = offering.data
            const payout = data.payout
            const payin = data.payin
            const claims = data.requiredClaims
            const payoutCurrency = payout.currencyCode
            const payinCurrency = payin.currencyCode

            const payinMethods = getPaymentMethodPairs(payin.methods)
            const payoutMethods = getPaymentMethodPairs(payout.methods)
            const requiredClaims = formatRequiredClaims(claims.input_descriptors)

            const currencyPair = {
                [pfiDid]: {
                    id: metadata.id,
                    createdAt: metadata.createdAt,
                    offeringFrom: metadata?.from,
                    requiredClaims,
                    pair: [
                        {
                            currencyCode: payin.currencyCode,
                            // Using string simply because the original data type was string as in payoutUnitsPerPayinUnit
                            unit: parseFloat('1'),
                            methods: payinMethods
                        },
                        {
                            currencyCode: payout.currencyCode,
                            unit: parseFloat(data.payoutUnitsPerPayinUnit),
                            methods: payoutMethods
                        }
                    ]
                }
            }

            pairs.push(currencyPair)
            sourceCurrencies.push(payinCurrency)
            destinationCurrencies.push(payoutCurrency)
        }
    }

    return {
        offerings: pairs,
        sourceCurrencies: [...new Set(sourceCurrencies)],
        destinationCurrencies: [...new Set(destinationCurrencies)]
    }
}
