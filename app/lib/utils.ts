import countries from "@/public/countries.json"
import { LANDING_PAGE_TABS, DEBUNK_SOURCE, DEBUNK_CAMPAIGN_TYPE, TDBUNK_PLATFORM_FEE_STRATEGY, PFIs, TBDEX_MESSAGE_TYPES, TDBUNK_CANCEL_REASON, TDBUNK_SUCCESS_REASON, TBDEX_MESSAGE_TYPES_TO_STATUS, INTERVALS_LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { formatDistanceToNow, differenceInSeconds, addSeconds } from "date-fns";
import { getFixedRateConversion } from "./api";

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
            direct.push(offer)
        } else {
            hops.push(offering)
        }
    }

    return {
        direct,
        hops
    }
}

export const displayTimeWithLabel = (seconds: any) => {
    const timeUnits = [
        { unit: 'year', value: 60 * 60 * 24 * 365 },  // 1 year
        { unit: 'month', value: 60 * 60 * 24 * 30 },  // 1 month (approx)
        { unit: 'week', value: 60 * 60 * 24 * 7 },    // 1 week
        { unit: 'day', value: 60 * 60 * 24 },         // 1 day
        { unit: 'hour', value: 60 * 60 },             // 1 hour
        { unit: 'minute', value: 60 }                 // 1 minute
    ];

    for (let i = 0; i < timeUnits.length; i++) {
        const result = Math.floor(seconds / timeUnits[i].value);
        if (result > 0) {
            return `${result} ${timeUnits[i].unit}${result > 1 ? 's' : ''}`;
        }
    }
    return `${seconds} second${seconds > 1 ? 's' : ''}`;
}


export const getEstimatedSettlementTime = (methods: any[], fastest: boolean) => {
    const estimates = new Set<number>()

    for (const method of methods) {
        const estimatedSettlementTime = method?.estimatedSettlementTime
        estimates.add(estimatedSettlementTime)
    }

    const slow = Math.max(...estimates)
    const fast = Math.min(...estimates)

    const timeInSeconds = fastest ? fast : slow

    const timeWithLabel = displayTimeWithLabel(timeInSeconds)

    return {
        timeWithLabel,
        timeInSeconds
    }
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
            kind: method?.kind,
            title: method?.requiredPaymentDetails?.title,
            estimatedSettlementTime: method?.estimatedSettlementTime,
            paymentProperties: method?.requiredPaymentDetails?.properties,
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
            const requiredClaims = claims ? formatRequiredClaims(claims.input_descriptors) : {}

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

export const getCurrencyFromCountry = (countries: any[], country: string) => {
    return countries.filter(({ countryCode }) => countryCode === country)[0]?.currencyCode
}

export const arraysEqual = (arr1: string | any[], arr2: string | any[]) => {
    // Check if lengths are the same
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Sort both arrays and compare each element
    const sortedArr1 = [...arr1].sort();
    const sortedArr2 = [...arr2].sort();

    for (let i = 0; i < sortedArr1.length; i++) {
        if (sortedArr1[i] !== sortedArr2[i]) {
            return false;
        }
    }

    // If all elements match, the arrays are equal
    return true;
}

export const getCurrencyFlag = (currency: string) => {
    let flag = ''

    switch (currency) {
        case 'USD':
            flag = '🇺🇸'
            break
        case 'EUR':
            flag = '🇪🇺'
            break
        case 'GBP':
            flag = '🇬🇧'
            break
        default:
            flag = countries.filter(entry => entry.currencyCode === currency)[0]?.flag
            break
    }

    return flag ?? '🏳️'
}

export const msToDays = (ms: number) => {
    return ms / (1000 * 60 * 60 * 24);
}


export const getPlatformFees = async (paymentDetails: any[]) => {
    // Charge percentageFee * transactionAmount  + fixedFee
    //        2.9%          * transactionAmount  + $0.30 equivalent

    const [quotePayin, quotePayout] = paymentDetails

    const quotePayinFee = quotePayin?.fee ?? 0
    const quotePayoutFee = quotePayout?.fee ?? 0

    const quotePayinFeeCurrency = quotePayin?.currencyCode
    const quotePayoutFeeCurrency = quotePayout?.currencyCode

    const fixedFee = TDBUNK_PLATFORM_FEE_STRATEGY.fixed
    const percentageFee = TDBUNK_PLATFORM_FEE_STRATEGY.percentage

    // % amount in source currency
    const percentageAmount = percentageFee * quotePayin?.amount

    const fixedAmount = await getFixedRateConversion({
        source: fixedFee.currency,
        destination: quotePayin?.currencyCode,
        amount: fixedFee.value
    })

    const isCool = !Number.isNaN(fixedAmount)

    const totalFee = isCool
        ? Number(percentageAmount) + Number(fixedAmount)
        : Number(percentageAmount)

    const feeDetails = {
        totalFee,
        fixedAmount,
        currencyCode: quotePayin?.currencyCode,
        percentageAmount,
    }

    return feeDetails
}

export const percentageDifference = (value1: number, value2: number) => {
    const diff = Math.abs((value2 - value1) / ((value1 + value2) / 2)) * 100;
    return {
        value1,
        value2,
        diff: diff.toFixed(2)
    }
}

export const extractMessageDetailsFromExchange = (item: any) => {
    const data = item?.data;
    const metadata = item?.metadata;

    const kind = metadata?.kind;
    const toDidUri = metadata?.to;
    const fromDidUri = metadata?.from;
    const protocol = metadata?.protocol;
    const createdAt = metadata?.createdAt;
    const exchangeId = metadata?.exchangeId;

    const from = `${fromDidUri?.slice(
        0,
        14
    )}...${fromDidUri?.slice(-8)}`;

    const to = `${toDidUri?.slice(
        0,
        14
    )}...${toDidUri?.slice(-8)}`;

    const pfiDetails = PFIs.find(
        (entry: any) => entry?.did === fromDidUri
    );

    const isRfq = kind === TBDEX_MESSAGE_TYPES.RFQ
    const isQuote = kind === TBDEX_MESSAGE_TYPES.QUOTE
    const isClose = kind === TBDEX_MESSAGE_TYPES.CLOSE

    const isCancel = isClose && data?.reason && data?.reason?.includes(TDBUNK_CANCEL_REASON)
    const isSuccess = isClose && data?.reason && data?.reason?.includes(TDBUNK_SUCCESS_REASON)

    const tag = isRfq
        ? TBDEX_MESSAGE_TYPES_TO_STATUS.RFQ
        : isQuote
            ? TBDEX_MESSAGE_TYPES_TO_STATUS.QUOTE
            : ''

    const finalTag = isCancel
        ? TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE
        : isSuccess
            ? TBDEX_MESSAGE_TYPES_TO_STATUS.CLOSE_SUCCESS
            : ''

    return {
        to,
        tag,
        from,
        createdAt,
        isCancel,
        isSuccess,
        finalTag,
        protocol,
        exchangeId,
        pfiDetails,
    }
}

export const createTransaction = ({ offering, exchange: relevantExchange, campaignAmount }: { offering: any; exchange: any, campaignAmount: any }) => {
    const [payinData, payoutData] = offering?.pair

    const offeringRate = payoutData?.unit

    const fromCurrency = payinData?.currencyCode
    const fromAmount = Math.floor(campaignAmount / offeringRate)

    const toCurrency = payoutData?.currencyCode
    const toAmount = campaignAmount


    const payin = {
        currency: fromCurrency,
        amount: fromAmount
    }

    const payout = {
        currency: toCurrency,
        amount: toAmount
    }

    const {
        tag,
        createdAt,
        isCancel,
        finalTag,
        isSuccess,
        protocol,
        exchangeId,
        pfiDetails,
    } = extractMessageDetailsFromExchange(relevantExchange?.mostRecentMessage)

    const transaction = {
        tag,
        payin,
        payout,
        finalTag,
        protocol,
        isCancel,
        createdAt,
        isSuccess,
        pfiDetails,
        exchangeId,
    }

    return transaction
}

export const clearAllIntervals = (intervalIds: string[]) => {
    for (const interval of intervalIds) {
        window && window.clearInterval(interval);
    }
    localStorage && localStorage.removeItem(INTERVALS_LOCAL_STORAGE_KEY)
}

export const clearAllPollingTimers = () => {
    const storedIntervals = localStorage && localStorage.getItem(INTERVALS_LOCAL_STORAGE_KEY)
    if (storedIntervals) {
        const existingIntervals = JSON.parse(storedIntervals)
        const newIntervals = [...existingIntervals]
        clearAllIntervals(newIntervals)
    }
}

export const getUniqueExchanges = (exchanges: any[]) => {
    const uniqueItems = exchanges.reduce((acc, current) => {
        const isDuplicate = acc.some((item: any) => item.exchangeId === current.exchangeId);
        if (!isDuplicate) {
            acc.push(current);
        }
        return acc;
    }, []);

    return uniqueItems
}
