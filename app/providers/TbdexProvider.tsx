"use client"
import useBrowserStorage from '@/app/hooks/useLocalStorage';
import { LOCAL_STORAGE_KEY, OFFERINGS_LOCAL_STORAGE_KEY, PFIs, SPECIAL_PFI } from "@/app/lib/constants";
import { Offering, Rfq, TbdexHttpClient } from '@tbdex/http-client';
import { PresentationDefinitionV2, PresentationExchange } from '@web5/credentials';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { createRfQ } from '../lib/tbdex';
import { getOfferingPairs } from '../lib/utils';
import { useWeb5Context } from './Web5Provider';

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
    createExchange: (args: CreateExchangeArgs) => Promise<void>;
    setSourceCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectedCurrency: React.Dispatch<React.SetStateAction<string>>;
    setUnformattedOfferings: React.Dispatch<React.SetStateAction<any[]>>;
    setMonopolyMoney: React.Dispatch<React.SetStateAction<MonopolyMoney>>;
    setDestinationCurrencies: React.Dispatch<React.SetStateAction<any[]>>;
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
    const { userBearerDid: contextUserBearerDid } = useWeb5Context()
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

    const createExchange = async (details: any) => {
        try {
            const userWeb5BearerDid = contextUserBearerDid
                ? contextUserBearerDid
                : details.userBearerDid

            const selectedCredentials = PresentationExchange.selectCredentials({
                vcJwts: details.credentials,
                presentationDefinition: details.offering.data.requiredClaims
            })
            const rfq = await createRfQ({
                userBearerDid: userWeb5BearerDid,
                amount: details.amount,
                offering: details.offering,
                credentials: selectedCredentials,
                requiredPaymentDetails: details.requiredPaymentDetails
            })
            console.log("Create Eachage Args", {
                ...details,
                rfq,
                contextUserBearerDid
            })

            TbdexHttpClient.createExchange(rfq as Rfq, {
                replyTo: 'http://localhost:3000/api/exchanges'
            })
        } catch (error: any) {
            console.log("Something went wrong createExchange", error)
        }
    }

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

                const specialOfferings = await TbdexHttpClient.getOfferings({
                    pfiDid: SPECIAL_PFI.did
                })

                console.log("Special Offerings", specialOfferings)

                const {
                    offerings: specialOffers,
                    sourceCurrencies: specialOffersSourceCurrencies,
                    destinationCurrencies: specialOffersDestinationCurrencies
                } = getOfferingPairs(offeringsData)

                const {
                    offerings,
                    sourceCurrencies,
                    destinationCurrencies
                } = getOfferingPairs(offeringsData)

                // console.log(unformattedOfferings)
                console.log("Special Offerings", {
                    specialOffersSourceCurrencies,
                    specialOffersDestinationCurrencies
                })


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

