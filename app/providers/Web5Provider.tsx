'use client'
import { DebunkProps } from '@/app/components/organisms/Debunks';
import { BearerIdentity } from '@web5/agent';
import { type Web5 } from "@web5/api";
import { BearerDid, DidResolutionResult } from '@web5/dids';
import { PropsWithChildren, createContext, useContext, useState } from 'react';

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

