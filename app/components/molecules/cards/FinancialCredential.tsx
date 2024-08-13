"use client"
import { Card1, Evidence, TBDVCLogoYellow, ValidCredential } from "@/app/components/atoms/Icon";
import { parseJwtToVc } from "@/app/lib/web5";
import { useWeb5Context } from "@/app/providers/Web5Provider";
import { VerifiableCredential } from "@web5/credentials";
import { DidResolutionResult } from "@web5/dids";
import { Card, Drawer, Flex, Typography, Tag, theme } from "antd";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import countries from '@/public/countries.json'

export interface CredentialSubject {
    name: string;
    didUri: string;
    countryCode: string;
}

export interface CredentialMetadata {
    type: string[];
    issuerDidUri: any;
    issuanceDate: string;
    expirationDate: string | undefined;
    subject: CredentialSubject;
}

export interface CredentialCardProps {
    vcServiceUrl: string;
    name: string | undefined;
    countryCode: string | undefined;
    issuanceDate: string | undefined;
    expirationDate: string | undefined;
    handleCardClicked: () => void;

}

const CredentialCard: React.FC<CredentialCardProps> = ({
    name,
    countryCode,
    vcServiceUrl,
    issuanceDate,
    expirationDate,
    handleCardClicked
}) => {
    const expiry = expirationDate ? expirationDate : ''
    const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
    const expiration = issuanceDate ? formatDistanceToNow(new Date(expiry), { addSuffix: true }) : ''

    const country = countries.filter(entry => entry?.countryCode === countryCode)[0]
    return (
        <Flex className="h-[200px]">
            <Flex onClick={handleCardClicked} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={TBDVCLogoYellow} width={40} height={40} />
                    <Link href={vcServiceUrl} style={{ fontSize: 10, marginTop: 8 }}>Ultimate Identity</Link>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>{`${name}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9, marginTop: 10 }}>{`Issued: ${issuance}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9 }}>{`Expires: ${expiration}`}</Typography.Text>
                </Flex>
            </Flex>
        </Flex>

    )
}

export interface DrawerHeaderProps {
    type: string[] | undefined;
}

const DrawerHeader: React.FC<DrawerHeaderProps> = ({
    type
}) => {
    return (<Flex className="justify-end">
        {type?.map(entry => (<Tag color="gold">{entry}</Tag>))}
    </Flex>)
}

const FinancialInstitutionCredential = (props: any) => {
    const { existingCreds } = props;

    const { resolveDid } = useWeb5Context()

    const [open, setOpen] = useState(false);
    const [copied, setCopied] = useState(false)
    const [vcMetadata, setVcMetadata] = useState<CredentialMetadata | undefined>()
    const [vcIssuerDidDocument, setVcIssuerDidDocument] = useState<DidResolutionResult | undefined>()
    const [credentialDidDocument, setCredentialDidDocument] = useState<VerifiableCredential | undefined>()

    const onClose = () => {
        setOpen(false);
    };

    const getDidDdocument = async (didUri: string) => {
        const did = await resolveDid?.(didUri)
        setVcIssuerDidDocument(did)
        return did
    }

    const getVcDidDocument = (creds: any) => {
        const createdFinancialCred = Object.values(creds).flat()[0]
        const parsedVc = parseJwtToVc(createdFinancialCred)
        return parsedVc
    }

    const extractVcDocumentDetails = (vc: VerifiableCredential) => {
        const vcModel = vc?.vcDataModel

        const credentialSubject = vcModel?.credentialSubject as {
            id: string;
            name: string;
            countryOfResidence: string;
        }

        const credentialMetadata = {
            subject: {
                didUri: credentialSubject?.id,
                name: credentialSubject?.name,
                countryCode: credentialSubject?.countryOfResidence,
            },
            issuerDidUri: vcModel?.issuer,
            issuanceDate: vcModel?.issuanceDate,
            expirationDate: vcModel?.expirationDate,
            type: vcModel?.type,
        };

        const issuerUri = vcModel?.issuer as string

        return {
            issuerUri,
            data: credentialMetadata
        }
    }

    const handleCardClicked = () => {
        setOpen(true)
    }

    const vcDidDoc = vcIssuerDidDocument?.didDocument
    const vcServiceUrl = `${vcDidDoc?.service?.[0]?.serviceEndpoint}`


    const commonCardProps = {
        vcServiceUrl,
        name: vcMetadata?.subject?.name,
        issuanceDate: vcMetadata?.issuanceDate,
        expirationDate: vcMetadata?.expirationDate,
        countryCode: vcMetadata?.subject?.countryCode,
        handleCardClicked,
    }

    useEffect(() => {
        const parsedVc = getVcDidDocument(existingCreds)
        const { issuerUri, data } = extractVcDocumentDetails(parsedVc)
        setVcMetadata(data)
        getDidDdocument(issuerUri)
        setCredentialDidDocument(parsedVc)
    }, [])

    return (
        <Flex>
            <Drawer title={<DrawerHeader type={vcMetadata?.type} />} onClose={onClose} open={open} width={600}>
                <CredentialCard {...commonCardProps} />
                <Card className="flex-col mb-4">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Issuer Name:</Typography.Text>
                            <Typography.Text style={{ fontSize: 14 }}>Ultimate Identity</Typography.Text>
                        </Flex>
                        <Image src={ValidCredential} width={50} height={50} alt="valid" />
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Service Endpoint:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{vcServiceUrl}</Typography.Text>
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Issuer DID:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{vcMetadata?.issuerDidUri}</Typography.Text>
                    </Flex>
                </Card>
                <Card className="flex-col mb-4">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Credential Document:</Typography.Text>
                        </Flex>
                        <Image src={Evidence} width={40} height={40} alt="valid" />
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <pre>{JSON.stringify(credentialDidDocument, null, 2)}</pre>
                    </Flex>
                </Card>
            </Drawer>
            <CredentialCard {...commonCardProps} />
        </Flex>
    );
};

export default FinancialInstitutionCredential;
