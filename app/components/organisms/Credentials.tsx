import { Card1, TBDVCLogoYellow } from "@/app/components/atoms/Icon";
import { extractVcDocumentDetails } from "@/app/components/molecules/cards/FinancialCredential";
import { CredentialStorage } from "@/app/components/molecules/forms/Credentials";
import useBrowserStorage from "@/app/hooks/useLocalStorage";
import { CREDENTIALS_LOCAL_STORAGE_KEY, LOCAL_STORAGE_KEY } from "@/app/lib/constants";
import { parseJwtToVc } from "@/app/lib/web5";
import { PRIMARY_GOLD_HEX } from "@/app/providers/ThemeProvider";
import countries from '@/public/countries.json';
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { resolveDid } from "@tbdex/http-client";
import { Card, Flex, theme, Typography } from "antd";
import { formatDistanceToNow } from 'date-fns';
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from 'next/image';
import { useEffect, useState } from "react";

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
    isSelected,
    selectedCard,
    setIsSelected,
    setSelectedCard
}) => {
    // issuer name as per docs here: https://www.tbdex.io/hackathon
    const issuerName = 'Ultimate Identity'

    const [country, setCountry] = useState<any>()
    const [issuance, setIssuance] = useState<string | undefined>()
    const [expiration, setExpiration] = useState<string | undefined>()
    const [issuerServiceUrl, setIssuerServiceUrl] = useState<string | undefined>()
    const [vcSubject, setVcSubject] = useState<{ didUri: string; name: string; countryCode: string; }>()

    const { token: { colorPrimary } } = theme.useToken()

    useEffect(() => {
        (async () => {
            const parsedVc = parseJwtToVc(vcJwt)
            const { data } = extractVcDocumentDetails(parsedVc)

            const vcSubject = data?.subject
            const issuanceDate = data?.issuanceDate
            const expirationDate = data?.expirationDate

            const country = countries.filter(entry => entry?.countryCode === vcSubject?.countryCode)[0]

            const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
            const expiration = expirationDate ? formatDistanceToNow(new Date(expirationDate), { addSuffix: true }) : ''

            // @ts-ignore
            const issuerDidDocument = await resolveDid(data.issuerDidUri)

            const issuerServiceUrls = issuerDidDocument?.service?.[0]?.serviceEndpoint as any
            const issuerServiceUrl = issuerServiceUrls[0] as string

            setCountry(country)
            setIssuance(issuance)
            setVcSubject(vcSubject)
            setExpiration(expiration)
            setIssuerServiceUrl(issuerServiceUrl)
        })()
    }, [])

    const handleCardClicked = () => {
        if (selectedCard) {
            setSelectedCard('')
        } else {
            setSelectedCard(vcJwt)
        }

        setIsSelected(selectedCard === vcJwt)
    }

    return (
        <Card className={`w-[360px] h-[220px]`}>
            <Flex onClick={() => handleCardClicked()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                    <a href={issuerServiceUrl} style={{ fontSize: 10, marginTop: 8, color: "white" }}>{issuerName}</a>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>{`${vcSubject?.name}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9, marginTop: 10 }}>{`Issued: ${issuance}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9 }}>{`Expires: ${expiration}`}</Typography.Text>
                </Flex>
            </Flex>
            {
                isSelected
                    ? <CheckCircleFilled className='absolute right-0 mr-2' style={{ color: colorPrimary }} />
                    : <CheckCircleOutlined className='absolute right-0 mr-2' style={{ color: 'gray' }} />
            }
        </Card>
    )
}

export const Credentials = (props: any) => {
    const {
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
                    isSelected={isSelected}
                    selectedCard={selectedCard}
                    setIsSelected={setIsSelected}
                    setSelectedCard={setSelectedCard}
                />
            ))}
        </Flex>
    )
}