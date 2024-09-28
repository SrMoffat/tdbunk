import FinancialInstitutionCredential from '@/app/components/molecules/cards/FinancialCredential';
import { CREDENTIAL_TYPES } from "@/app/lib/constants";
import { parseJwtToVc } from "@/app/lib/web5";
import countries from '@/public/countries.json';
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Card, Flex, theme } from "antd";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { useEffect, useState } from "react";
import EducationalInstitutionCredential from "../molecules/cards/EducationCredential";
import GovernmentInstitutionCredential from "../molecules/cards/GovernmentCredential";
import ProfessionalInstitutionCredential from "../molecules/cards/ProfessionalCredential";

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]


export interface CredentialHolderProps {
    firstName: string;
    lastName: string;
    country: string;

}
export interface CredentialIssuerProps {
    logo: StaticImport;
    url: string;
    name: string;
}

export interface CredentialProps {
    id: string;
    expires: Date | string;
    uiTemplate: StaticImport;
    issuer: CredentialIssuerProps;
    holder: CredentialHolderProps
}

export interface CredentialOptionProps {
    credential: CredentialProps
    isSelected: boolean;
    setIsSelected: React.Dispatch<React.SetStateAction<boolean>>
}


const CredentialOption: React.FC<any> = ({
    vcJwt,
    offering,
    isSelected,
    selectedCard,
    setIsSelected,
    setSelectedCard
}) => {
    const [parsedVcJwt, setParsedVcJwt] = useState<any>()

    const { token: { colorPrimary } } = theme.useToken()

    useEffect(() => {
        (async () => {
            const parsedVc = parseJwtToVc(vcJwt)
            setParsedVcJwt(parsedVc)
        })()
    }, [])

    const handleCardClicked = () => {
        console.log("♦️ Card Clicked", {
            offering,
            parsedVcJwt,
            
        })
        // if (selectedCard) {
        //     setSelectedCard('')
        // } else {
        //     setSelectedCard(vcJwt)
        // }

        // setIsSelected(selectedCard === vcJwt)
    }

    const credentialTypes = parsedVcJwt?.vcDataModel?.type
    const specificCredentialType = credentialTypes?.[1]

    const financialCredential = specificCredentialType === CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL
    const governmentCredential = specificCredentialType === CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL
    const professionalCredential = specificCredentialType === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
    const educationalCredential = specificCredentialType === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

    const commonProps = {
        parsedVcJwt,
        handleCardClicked,
    }

    // TO DO: Clean this up 🤢
    const credentialCard = financialCredential
        ? <FinancialInstitutionCredential {...commonProps} />
        : governmentCredential
            ? <GovernmentInstitutionCredential {...commonProps} />
            : professionalCredential
                ? <ProfessionalInstitutionCredential {...commonProps} />
                : educationalCredential
                    ? <EducationalInstitutionCredential {...commonProps} />
                    : 'Here'

    return (
        <Card className="w-[360px] h-[220px] border border-red-400 relative">
            {credentialCard}
            <Flex className="border absolute top-0 right-0">
                {
                    isSelected
                        ? <CheckCircleFilled className='mr-2' style={{ color: colorPrimary }} />
                        : <CheckCircleOutlined className='mr-2' style={{ color: 'gray' }} />
                }
            </Flex>
        </Card>
    )
}

export const Credentials = (props: any) => {
    const {
        offering,
        credentials,
        isSelected,
        selectedCard,
        setIsSelected,
        setSelectedCard,
    } = props
    return (
        <Flex className="gap-3">
            {credentials?.map((entry: any) => (
                <CredentialOption
                    key={entry}
                    vcJwt={entry}
                    offering={offering}
                    isSelected={isSelected}
                    selectedCard={selectedCard}
                    setIsSelected={setIsSelected}
                    setSelectedCard={setSelectedCard}
                />
            ))}
        </Flex>
    )
}