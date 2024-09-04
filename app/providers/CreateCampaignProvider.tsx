import { DEBUNK_CAMPAIGN_TYPE, DEBUNK_SOURCE } from "@/app/lib/constants";
import React, { createContext, PropsWithChildren, useContext, useState } from "react";

export interface CreateCampaignContextProps {
    debunkTitle: string;
    debunkLink: string;
    campaignName: string;
    campaignAmount: number;
    debunkSource: DEBUNK_SOURCE;
    campaignDescription: string;
    campaignMinEvidences: number;
    requiredCredentials: string[];
    campaignNumOfFactCheckers: number;
    campaignType: DEBUNK_CAMPAIGN_TYPE;
    setStepOneValues: (args: StepOneValues) => void;
    setStepTwoValues: (args: StepTwoValues) => void;
    setDebunkLink: React.Dispatch<React.SetStateAction<string>>;
    setDebunkTitle: React.Dispatch<React.SetStateAction<string>>;
    setCampaignName: React.Dispatch<React.SetStateAction<string>>;
    setCampaignAmount: React.Dispatch<React.SetStateAction<number>>;
    setCampaignDescription: React.Dispatch<React.SetStateAction<string>>;
    setRequiredCredentials: React.Dispatch<React.SetStateAction<string[]>>;
    setCampaignNumOfFactCheckersCount: React.Dispatch<React.SetStateAction<number>>;
    setDebunkSource: React.Dispatch<React.SetStateAction<DEBUNK_SOURCE | undefined>>;
    setCampaignType: React.Dispatch<React.SetStateAction<DEBUNK_CAMPAIGN_TYPE | undefined>>;
}

export interface StepOneValues {
    link: string;
    title: string;
    source: DEBUNK_SOURCE;
}

export interface StepTwoValues {
    name: string;
    amount?: string;
    description: string;
    factCheckers: number;
    minEvidences: number;
    type?: DEBUNK_CAMPAIGN_TYPE;
}

const CreateCampaignContext = createContext<Partial<CreateCampaignContextProps>>({})

const CreateCampaignContextProvider = ({ children }: PropsWithChildren) => {
    const [debunkLink, setDebunkLink] = useState('')
    const [debunkTitle, setDebunkTitle] = useState('')
    const [campaignName, setCampaignName] = useState('')
    const [campaignAmount, setCampaignAmount] = useState<number>(1)
    const [debunkSource, setDebunkSource] = useState<DEBUNK_SOURCE>()
    const [campaignDescription, setCampaignDescription] = useState('')
    const [requiredCredentials, setRequiredCredentials] = useState([''])
    const [campaignType, setCampaignType] = useState<DEBUNK_CAMPAIGN_TYPE>()
    const [campaignMinEvidencesCount, setCampaignMinEvidencesCount] = useState<number>(1)
    const [campaignNumOfFactCheckersCount, setCampaignNumOfFactCheckersCount] = useState<number>(1)

    const setStepOneValues = ({
        link,
        source,
        title
    }: StepOneValues) => {
        setDebunkTitle(title)
        setDebunkLink(link)
        setDebunkSource(source)
    }

    const setStepTwoValues = ({
        name,
        type,
        description,
        factCheckers,
        minEvidences
    }: StepTwoValues) => {
        setCampaignName(name)
        setCampaignType(type)
        setCampaignDescription(description)
        setCampaignMinEvidencesCount(minEvidences)
        setCampaignNumOfFactCheckersCount(factCheckers)
    }

    return (
        <CreateCampaignContext.Provider value={{
            debunkLink,
            debunkTitle,
            debunkSource,
            campaignName,
            campaignType,
            campaignAmount,
            requiredCredentials,
            campaignDescription,
            campaignMinEvidences: campaignMinEvidencesCount,
            campaignNumOfFactCheckers: campaignNumOfFactCheckersCount,

            setDebunkLink,
            setDebunkTitle,
            setDebunkSource,
            setStepOneValues,
            setStepTwoValues,
            setCampaignName,
            setCampaignType,
            setCampaignAmount,
            setCampaignDescription,
            setRequiredCredentials,
            setCampaignNumOfFactCheckersCount,
        }}>
            {children}
        </CreateCampaignContext.Provider>
    )
}

const useCreateCampaignContext = (): Partial<CreateCampaignContextProps> => {
    const context = useContext(CreateCampaignContext)
    if (!context) {
        throw new Error('useCreateCampaignContext mus be used within a CreateCampaignContextProvider')
    }
    return context
}

export { CreateCampaignContext, CreateCampaignContextProvider, useCreateCampaignContext };
