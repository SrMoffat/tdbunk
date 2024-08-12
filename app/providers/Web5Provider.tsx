'use client'
import { fetchCampaigns, setupCampaignProtocol } from '@/app/lib/web5';
import { Web5 as Web5Api, type Web5 } from "@web5/api";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { DebunkProps } from '../components/organisms/Debunks';

export interface Web5ContextType {
    web5: Web5 | null;
    userDid: string | null;
    campaigns: DebunkProps[];
    setUserDid: (did: string) => void;
    setCampaigns: React.Dispatch<React.SetStateAction<DebunkProps[]>>;
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
    const [userDid, setUserDid] = useState<string | null>(null);
    const [campaigns, setCampaigns] = useState<DebunkProps[]>([]);
    const [web5Instance, setWeb5Instance] = useState<Web5 | null>(null);

    useEffect(() => {
        (async () => {
            let diduri = ''
            let web5Client = null

            const didExists = false

            if (didExists) {
                // Check if DID exists in storage, if so, import it
                console.log("Handle Did exists")
            } else {
                // If not, create one and set it in storage
                const { web5, did } = await Web5Api.connect({
                    password: process.env.WEB5_PASSWORD // ?? '5PC{*?e|ix48'
                });

                diduri = did
                web5Client = web5
            }

            setUserDid(diduri)

            setWeb5Instance(web5Client)

            await setupCampaignProtocol(web5Client, diduri)

            const campaigns = await fetchCampaigns(web5Client, diduri)

            setCampaigns(campaigns)
        })()
    }, [])

    return <Web5Context.Provider value={{
        userDid,
        campaigns,
        web5: web5Instance,
        setUserDid,
        setCampaigns
    }}>
        {children}
    </Web5Context.Provider>
}

export { Web5Context, Web5ContextProvider, useWeb5Context };

