import { credentials } from "@/app/lib/mocks";
import countries from '@/public/countries.json';
import { CheckCircleFilled, CheckCircleOutlined } from "@ant-design/icons";
import { Card, Flex, theme, Typography } from "antd";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from 'next/image';
import { useState } from "react";

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


const CredentialOption: React.FC<CredentialOptionProps> = ({
    credential,
    isSelected,
    setIsSelected
}) => {
    const {
        expires,
        uiTemplate,
        issuer: { name: issuerName, url, logo },
        holder: { firstName, lastName }
    } = credential
    const {
        token: { colorPrimary },
    } = theme.useToken()

    const handleCardClicked = () => {
        setIsSelected(!isSelected)
    }
    return (
        <Card className='w-[360px] h-[220px]'>
            <Flex onClick={() => handleCardClicked()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={uiTemplate} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={logo} width={40} height={40} />
                    <a href={url} style={{ fontSize: 10, marginTop: 8, color: "white" }}>{issuerName}</a>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>{`${firstName} ${lastName}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10 }}>{`Expires in ${expires}`}</Typography.Text>
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

export const Credentials = () => {
    const [isSelected, setIsSelected] = useState(true)

    return (
        <Flex className="gap-3">
            {credentials.map(entry => (
                <CredentialOption isSelected={isSelected} setIsSelected={setIsSelected} credential={entry} />
            ))}
        </Flex>
    )
}