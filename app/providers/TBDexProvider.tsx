"use client"
import { useContext, createContext, PropsWithChildren, useState } from "react";

export interface CredentialProp {
    [key: string]: string[]
}

export interface TBDexContextProps {
    credentials: CredentialProp
    setCredentials: React.Dispatch<React.SetStateAction<CredentialProp | undefined>>
};

const TBDexContext = createContext<Partial<TBDexContextProps>>({});

const useTBDexContext = (): Partial<TBDexContextProps> => {
    const context = useContext(TBDexContext);
    if (!context) {
        throw new Error('useTBDexContext must be used within a TBDexContextProvider');
    }
    return context;
};

const TBDexContextProvider = ({ children }: PropsWithChildren) => {
    const [credentials, setCredentials] = useState<CredentialProp>()

    return <TBDexContext.Provider value={{
        credentials,
        setCredentials
    }}>
        {children}
    </TBDexContext.Provider>
}

export { TBDexContextProvider, useTBDexContext, TBDexContext };
