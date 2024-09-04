"use client"
import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export interface CampaignsContextProps {
    campaigns: any[];
    setCampaigns: React.Dispatch<React.SetStateAction<any[]>>;
}

const CampaignsContext = createContext<Partial<CampaignsContextProps>>({})

const useCampaignContext = (): Partial<CampaignsContextProps> => {
    const context = useContext(CampaignsContext)

    if (!context) {
        throw new Error('useCampaignContext can only be used within CampaignsContextProvider')
    }

    return context
}

const CampaignsContextProvider = ({
    children
}: PropsWithChildren) => {
    const [campaigns, setCampaigns] = useState<any[]>([])

    return (
        <CampaignsContext.Provider value={{
            campaigns,
            setCampaigns
        }}>
            {children}
        </CampaignsContext.Provider>
    )
}

export { CampaignsContext, CampaignsContextProvider, useCampaignContext };

