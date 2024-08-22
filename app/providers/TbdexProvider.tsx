"use client"
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, PFIs } from "@/app/lib/constants";
import { Offering, TbdexHttpClient, Rfq } from '@tbdex/http-client';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";

export interface CredentialProp {
    [key: string]: string[]
}

export interface CreateExchangeArgs {
    vcJwts: string[];
    presentationDefinition: PresentationDefinitionV2
}

export interface MonopolyMoney { currency: string, amount: number }

export interface TbdexContextProps {
    offerings: any[];
    sourceCurrencies: any[];
    selectedCurrency: string;
    unformattedOfferings: any[];
    credentials: CredentialProp;
    destinationCurrencies: any[];
    monopolyMoney: MonopolyMoney;
    selectedDestinationCurrency: string;
    createExchange: (args: CreateExchangeArgs) => string[];
    setOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setSourceCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
    setUnformattedOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setMonopolyMoney: React.Dispatch<React.SetStateAction<MonopolyMoney>>;
    setDestinationCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedDestinationCurrency: React.Dispatch<React.SetStateAction<string>>;
    setCredentials: React.Dispatch<React.SetStateAction<CredentialProp | undefined>>;
};

export type OfferingStorage = {} | null

const formatRequiredClaims = (requiredClaims: any[]) => {
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

const getPaymentMethodPairs = (methods: any) => {
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

const getOfferingPairs = (pfis: any) => {
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

const createExchange = (details: CreateExchangeArgs) => {
    const {
        vcJwts,
        presentationDefinition,
    } = details
    const selectedCredentials = PresentationExchange.selectCredentials({
        vcJwts,
        presentationDefinition
    })

    console.log("Selected Credentials", { selectedCredentials })
    // console.log("Selected Credentials", { details, selectedCredentials })

    return ['']
}

const TbdexContext = createContext<Partial<TbdexContextProps>>({});

const useTbdexContext = (): Partial<TbdexContextProps> => {
    const context = useContext(TbdexContext);
    if (!context) {
        throw new Error('useTbdexContext must be used within a TbdexContextProvider');
    }
    return context;
};

const TbdexContextProvider = ({ children }: PropsWithChildren) => {
    const [offerings, setOfferings] = useState<any[]>([])
    const [unformattedOfferings, setUnformattedOfferings] = useState<any[]>([])
    const [selectedCurrency, setSelectedCurrency] = useState<string>('USD')
    const [monopolyMoney, setMonopolyMoney] = useState<MonopolyMoney>({
        currency: 'USD',
        amount: 1000
    })
    const [credentials, setCredentials] = useState<CredentialProp>()
    const [sourceCurrencies, setSourceCurrencies] = useState<any[]>([])
    const [destinationCurrencies, setDestinationCurrencies] = useState<any[]>([])
    const [selectedDestinationCurrency, setSelectedDestinationCurrency] = useState<string>('USD')

    const [_, setLocalOfferings] = useBrowserStorage<OfferingStorage>(
        OFFERINGS_LOCAL_STORAGE_KEY,
        LOCAL_STORAGE_KEY
    )

    useEffect(() => {
        (async () => {
            try {
                const amount = monopolyMoney?.amount
                const source = monopolyMoney?.currency
                const destination = selectedCurrency as string

                // const response = await fetch('/api/conversions', {
                //     method: 'POST',
                //     body: JSON.stringify({
                //         source,
                //         destination,
                //         amount
                //     })
                // })

                // const newAmount = await response.json()

                setMonopolyMoney({
                    // amount: newAmount?.conversion_result,
                    amount: monopolyMoney?.amount,
                    currency: destination
                })
            } catch (error: any) {
                console.log("Error in wallet conversion", error)
            }
        })()
    }, [selectedCurrency])

    useEffect(() => {
        (async () => {
            try {
                const offeringsData: { [x: string]: Offering[]; }[] = []
                const unformattedOfferings = []
                for (const PFI of PFIs) {
                    const pfiDidUri = PFI.did
                    // const details = await resolveDid(pfiDidUri)
                    // console.log("Details", details)
                    const offers = await TbdexHttpClient.getOfferings({
                        pfiDid: pfiDidUri
                    })
                    const result = {
                        [pfiDidUri]: offers
                    }
                    offeringsData.push(result)
                    unformattedOfferings.push(offers)
                }

                const {
                    offerings,
                    sourceCurrencies,
                    destinationCurrencies
                } = getOfferingPairs(offeringsData)

                setOfferings(offerings)
                setLocalOfferings(offerings)
                setSourceCurrencies(sourceCurrencies)
                setUnformattedOfferings(unformattedOfferings)
                setDestinationCurrencies(destinationCurrencies)

            } catch (error: any) {
                console.log("Error heere", error)
            }
        })()
    }, [])
    return <TbdexContext.Provider value={{
        offerings,
        credentials,
        monopolyMoney,
        sourceCurrencies,
        selectedCurrency,
        unformattedOfferings,
        destinationCurrencies,
        selectedDestinationCurrency,

        setOfferings,
        setCredentials,
        createExchange,
        setMonopolyMoney,
        setSelectedCurrency,
        setSourceCurrencies,
        setUnformattedOfferings,
        setDestinationCurrencies,
        setSelectedDestinationCurrency
    }}>
        {children}
    </TbdexContext.Provider>
}

export { TbdexContext, TbdexContextProvider, useTbdexContext };

