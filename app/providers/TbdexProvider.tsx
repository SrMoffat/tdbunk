"use client"
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, PFIs } from "@/app/lib/constants";
import { Offering, TbdexHttpClient, Rfq } from '@tbdex/http-client';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useWeb5Context } from './Web5Provider';
import { BearerDid } from '@web5/dids';
import { getOfferingPairs } from '../lib/utils';

export interface CredentialProp {
    [key: string]: string[]
}

export interface CreateExchangeArgs {
    offering: any;
    vcJwts: string[];
    rawOffering: Offering;
    campaignAmount: string | number;
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
    setOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setSourceCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
    setUnformattedOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setMonopolyMoney: React.Dispatch<React.SetStateAction<MonopolyMoney>>;
    setDestinationCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    createExchange: (args: CreateExchangeArgs) => Promise<string[] | undefined>;
    setSelectedDestinationCurrency: React.Dispatch<React.SetStateAction<string>>;
    setCredentials: React.Dispatch<React.SetStateAction<CredentialProp | undefined>>;
};

export type OfferingStorage = {} | null


const TbdexContext = createContext<Partial<TbdexContextProps>>({});

const useTbdexContext = (): Partial<TbdexContextProps> => {
    const context = useContext(TbdexContext);
    if (!context) {
        throw new Error('useTbdexContext must be used within a TbdexContextProvider');
    }
    return context;
};

const TbdexContextProvider = ({ children }: PropsWithChildren) => {
    const { walletDid, userDid, getBearerDid } = useWeb5Context()
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

    const validateOffering = async ({
        rfq,
        offering
    }: any) => {
        try {
            await rfq.verifyOfferingRequirements(offering)

        } catch (error: any) {
            console.log("Offering validation failed", error)
        }
    }

    const createRfQ = async ({
        offering,
        amount,
        payinMethods,
        payoutMethods,
        credentials
    }: {
        offering: any
        amount: any
        payinMethods: any
        payoutMethods: any
        credentials: any
    }) => {
        try {
            const rfq = Rfq.create({
                metadata: {
                    // from: "did:dht:y5nzf5rh5gh8wc86kcquj1erat1391qwzayx1ki93hq64484x9jy",
                    // to: "did:dht:3fkz5ssfxbriwks3iy5nwys3q5kyx64ettp9wfn1yfekfkiguj1y",
                    from: walletDid as string,
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

    const signRfQ = async ({
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

    const createExchange = async (details: CreateExchangeArgs) => {
        try {
            const {
                offering,
                vcJwts,
                rawOffering,
                campaignAmount,
                presentationDefinition,
            } = details
            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts,
                presentationDefinition
            })

            const offeringFromCurrency = offering?.pair[0]
            const offeringFromCurrencyMethods = offeringFromCurrency?.methods

            const offeringToCurrency = offering?.pair[1]
            const offeringToCurrencyMethods = offeringToCurrency?.methods


            // const rfq = await createRfQ({
            //     offering,
            //     amount: campaignAmount,
            //     payinMethods: offeringFromCurrencyMethods,
            //     payoutMethods: offeringToCurrencyMethods,
            //     credentials
            // })

            // await validateOffering({
            //     rfq,
            //     offering: rawOffering
            // })

            // await signRfQ({
            //     rfq: rfq as Rfq,
            //     did: getBearerDid?.() as BearerDid

            // })

            // TbdexHttpClient.createExchange(rfq as Rfq, {
            //     replyTo: 'http://localhost:3000/api/exchanges'
            // })

            // console.log("Selected Credentials", { selectedCredentials, walletDid, userDid })
            // console.log("RFQ=======>", rfq)
            // console.log("getBearerDid?.()", getBearerDid?.())

            return ['']

        } catch (error: any) {
            console.log("Something went wrong createExchange", error)
        }
    }

    const fetchExchanges = async () => {}

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

                console.log(unformattedOfferings)

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

