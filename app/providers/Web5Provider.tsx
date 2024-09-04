'use client'
import { DebunkProps } from '@/app/components/organisms/Debunks';
import { BearerIdentity } from '@web5/agent';
import { type Web5 } from "@web5/api";
import { BearerDid, DidResolutionResult } from '@web5/dids';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';

export interface Web5ContextType {
    web5: Web5 | null;
    userDid: string | null;
    campaigns: DebunkProps[];
    recoveryPhrase: string | null;
    credentials: { [x: string]: any[]; };
    userBearerDid: BearerDid | BearerIdentity | null;
    setUserDid: React.Dispatch<React.SetStateAction<string | null>>;
    setCampaigns: React.Dispatch<React.SetStateAction<DebunkProps[]>>;
    setWeb5Instance: React.Dispatch<React.SetStateAction<Web5 | null>>;
    resolveDid: (didUri: string) => Promise<DidResolutionResult | undefined>;
    setCredentials: React.Dispatch<React.SetStateAction<{ [x: string]: any[]; }>>;
    setRecoveryPhrase: React.Dispatch<React.SetStateAction<string | null | undefined>>;
    setUserBearerDid: React.Dispatch<React.SetStateAction<BearerDid | BearerIdentity | null | undefined>>;
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
    const [credentials, setCredentials] = useState<{ [x: string]: any[]; }>({});
    const [userDid, setUserDid] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<DebunkProps[]>([]);
    const [web5Instance, setWeb5Instance] = useState<Web5 | null>(null);
    const [recoveryPhrase, setRecoveryPhrase] = useState<string | null | undefined>(null);
    const [userBearerDid, setUserBearerDid] = useState<BearerDid | BearerIdentity | null | undefined>(null);

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
        campaigns,
        credentials,
        userBearerDid,
        recoveryPhrase,
        web5: web5Instance,

        setUserDid,
        setCampaigns,
        setCredentials,
        setWeb5Instance,
        setUserBearerDid,
        setRecoveryPhrase,
    }}>
        {children}
    </Web5Context.Provider>
}

export { Web5Context, Web5ContextProvider, useWeb5Context };

