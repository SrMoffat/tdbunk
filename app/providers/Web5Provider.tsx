'use client'
import { PropsWithChildren, createContext, useContext } from 'react'

export interface Web5ContextType {}

const Web5Context = createContext<Partial<Web5ContextType>>({})

const useWeb5Context = (): Partial<Web5ContextType> => {
    const context = useContext(Web5Context)
    if (!context) {
        throw new Error('useWeb5Context must be used within a Web5ContextProvider')
    }
    return context
}

const Web5ContextProvider = ({ children }: PropsWithChildren) => {

    return <Web5Context.Provider value={{}}>
                {children}
    </Web5Context.Provider>
}

export { Web5Context, Web5ContextProvider, useWeb5Context }

