'use client'
import { createDwnCampaign, fetchCampaigns, setupTdbunkProtocol } from '@/app/lib/web5';
import { Web5 as Web5Api, type Web5 } from "@web5/api";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { DebunkProps } from '@/app/components/organisms/Debunks';
import { BearerDid, DidDht, DidResolutionResult } from '@web5/dids';

export interface Web5ContextType {
    credentials: any[];
    web5: Web5 | null;
    userDid: string | null;
    walletDid: string | null;
    campaigns: DebunkProps[];
    recoveryPhrase: string | null;
    setUserDid: (did: string) => void;
    setWalletDid: (did: string) => void;
    getBearerDid: () => BearerDid | undefined;
    setCredentials: React.Dispatch<React.SetStateAction<any[]>>;
    setCampaigns: React.Dispatch<React.SetStateAction<DebunkProps[]>>;
    setRecoveryPhrase: React.Dispatch<React.SetStateAction<string | null>>;
    resolveDid: (didUri: string) => Promise<DidResolutionResult | undefined>;
}

const Web5Context = createContext<Partial<Web5ContextType>>({})

const useWeb5Context = (): Partial<Web5ContextType> => {
    const context = useContext(Web5Context)
    if (!context) {
        throw new Error('useWeb5Context must be used within a Web5ContextProvider')
    }
    return context
}

const Web5ContextProvider = ({ children }: PropsWithChildren) => {
    const [credentials, setCredentials] = useState<any[]>([]);
    const [userDid, setUserDid] = useState<string | null>(null);
    const [walletDid, setWalletDid] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<DebunkProps[]>([]);
    const [web5Instance, setWeb5Instance] = useState<Web5 | null>(null);
    const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);

    const resolveDid = async (didUri: string): Promise<DidResolutionResult | undefined> => {
        try {
            const resolvedDhtDid = await DidDht.resolve(didUri);
            // console.log("Resolved DID", resolvedDhtDid)
            return resolvedDhtDid
        } catch (error: any) {
            console.log("Resolution error", error)
        }
    }

    const getBearerDid = () => {
        return web5Instance?.agent?.agentDid
    }

    useEffect(() => {
        (async () => {
            try {
                console.log("Do nothing for now")
                // let recovery
                // let diduri = ''
                // let web5Client = null

                // const didExists = false

                // if (didExists) {
                //     // Check if DID exists in storage, if so, import it
                //     console.log("Handle Did exists")
                // } else {
                //     // If not, create one and set it in storage
                //     const { web5, did: walletDid, recoveryPhrase } = await Web5Api.connect({
                //         // password: process.env.WEB5_PASSWORD ?? '5PC{*?e|ix48',
                //         sync: '5s'
                //     });

                //     diduri = walletDid
                //     web5Client = web5
                //     recovery = recoveryPhrase
                // }


                // console.log("Details", {
                //     web5Client,
                //     diduri,
                //     recovery
                // })

                // setWalletDid(diduri)
                // setWeb5Instance(web5Client)
                // setRecoveryPhrase(recoveryPhrase)

                // await setupTdbunkProtocol(web5Client, diduri)
                // await createDwnCampaign(web5Client)

                // const campaigns = await fetchCampaigns(web5Client, diduri)

                // console.log('campaigns array', campaigns);

                // setCampaigns(campaigns)

            } catch (error: any) {
                console.log("UseEffect mounted error", error)
            }
        })()
    }, [])

    return <Web5Context.Provider value={{
        userDid,
        walletDid,
        campaigns,
        credentials,
        recoveryPhrase,
        web5: web5Instance,

        setUserDid,
        resolveDid,
        setWalletDid,
        setCampaigns,
        getBearerDid,
        setCredentials,
        setRecoveryPhrase
    }}>
        {children}
    </Web5Context.Provider>
}

export { Web5Context, Web5ContextProvider, useWeb5Context };

