import { useContext, createContext, PropsWithChildren } from "react"

interface TBDexContextProps { }

const TBDexContext = createContext<Partial<TBDexContextProps>>({})

const useTBDexContext = (): Partial<TBDexContextProps> => {
    const context = useContext(TBDexContext)

    if (!context) {
        throw new Error('useTBDexContext must be used within a TBDexContextProvider')
    }
    return context

}

const TBDexContextProvider = ({ children }: PropsWithChildren) => {
    return <TBDexContext.Provider value={{}}>
        {children}
    </TBDexContext.Provider>
}

export { TBDexContextProvider, useTBDexContext, TBDexContext };


