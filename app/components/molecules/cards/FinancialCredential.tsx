"use client"
import { Card1, Evidence, TBDVCLogoWhite, TBDVCLogoYellow, ValidCredential } from "@/app/components/atoms/Icon";
import { CredentialMode } from "@/app/components/organisms/steps/campaign/StepOne";
import { CREDENTIAL_TYPES, CREDENTIALS_STAREGY_LOCAL_STORAGE_KEY, ULTIMATE_IDENTITY_ISSUER_NAME } from "@/app/lib/constants";
import { extractVcDocumentDetails, parseJwtToVc, resolveDid } from "@/app/lib/web5";
import countries from '@/public/countries.json';
import { VerifiableCredential } from "@web5/credentials";
import { DidResolutionResult } from "@web5/dids";
import { Card, Drawer, Flex, QRCode, Tag, Typography } from "antd";
import { formatDistanceToNow } from 'date-fns';
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

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
    credential: any;
    parsedVcJwt: any;
    vcServiceUrl: string;
    name: string | undefined;
    countryCode: string | undefined;
    issuanceDate: string | undefined;
    expirationDate: string | undefined;
    handleCardClicked: () => void;

}

export const getFinancialVcJwtDetails = (jwt: any, isParsed: boolean = false) => {
    let parsedCred

    if (!isParsed) {
        parsedCred = parseJwtToVc(jwt)
    } else {
        parsedCred = jwt
    }

    const { data } = extractVcDocumentDetails(parsedCred)

    const subject = data?.subject
    const nameParts = subject?.name?.split(":");
    const hasParts = nameParts?.length
    const renderName = hasParts
        ? `${nameParts[0]} ${nameParts[1]}`
        : subject?.name

    const country = countries.filter(entry => entry?.countryCode === subject?.countryCode)[0]
    const issuance = formatDistanceToNow(new Date(data?.issuanceDate), { addSuffix: true })
    const expiration = formatDistanceToNow(new Date(data?.expirationDate as string), { addSuffix: true })

    const details = {
        name: renderName,
        country: `${country?.countryName} ${country?.flag}`,
        issuance,
        expiration
    }

    return details
}

export const CredentialCard: React.FC<CredentialCardProps> = ({
    name,
    credential,
    parsedVcJwt,
    countryCode,
    vcServiceUrl,
    issuanceDate,
    expirationDate,
    handleCardClicked
}) => {
    const [isTestCred, setIsTestCred] = useState(false)
    const expiry = expirationDate ? expirationDate : ''
    const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
    const expiration = expiry ? formatDistanceToNow(new Date(expiry), { addSuffix: true }) : ''

    const country = countries.filter(entry => entry?.countryCode === countryCode)[0]

    const details = credential
        ? getFinancialVcJwtDetails(credential)
        : {
            name,
            country: `${country?.countryName} ${country?.flag}`,
            issuance,
            expiration
        }

    const isTestMessedCred = !details?.name?.includes('undefined') || parsedVcJwt

    const toRender = parsedVcJwt
        ? getFinancialVcJwtDetails(parsedVcJwt, true)
        : details

    const issuerLogo = isTestCred
        ? TBDVCLogoWhite
        : parsedVcJwt
            ? TBDVCLogoYellow
            : isTestMessedCred
                ? TBDVCLogoWhite
                : TBDVCLogoYellow

    useEffect(() => {
        const data = localStorage?.getItem(CREDENTIALS_STAREGY_LOCAL_STORAGE_KEY)

        if (data) {
            const isRequest = data === CredentialMode.REQUEST

            setIsTestCred(isRequest)
        }
    }, [])

    return (
        <Flex className="h-[200px]">
            <Flex onClick={handleCardClicked} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="card" src={Card1} width={300} height={300} />
                <Flex className="absolute left-4 top-4 flex-col">
                    <Image alt="LogoIcon" src={issuerLogo} width={40} height={40} />
                    <Link target="_blank" href={vcServiceUrl} style={{ fontSize: 10, marginTop: 8 }}>{ULTIMATE_IDENTITY_ISSUER_NAME}</Link>
                </Flex>
                <Flex className="absolute left-4 top-20 flex-col">
                    <Typography.Text style={{ fontSize: 12 }}>{`${toRender?.name?.replace('undefined', '')}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 12 }}>{`${toRender?.country}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9, marginTop: 10 }}>{`Issued: ${toRender?.issuance}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 9 }}>{`Expires: ${toRender?.expiration}`}</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    )
}

export interface DrawerHeaderProps {
    type: string[] | undefined;
}

export const DrawerHeader: React.FC<DrawerHeaderProps> = ({
    type
}) => {
    return (<Flex className="justify-end">
        {type?.map(entry => (<Tag key={entry} color="gold">{entry}</Tag>))}
    </Flex>)
}

const FinancialInstitutionCredential = (props: any) => {
    const {
        noDrawer,
        credential,
        parsedVcJwt,
        stateCredentials,
        localStorageCredentials,
        handleCardClicked: onClick,
    } = props;

    const [open, setOpen] = useState(false);
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

    const handleCardClicked = () => {
        if (!noDrawer) {
            setOpen(true)
        }
        onClick?.()
    }

    const vcDidDoc = vcIssuerDidDocument?.didDocument
    const vcServiceUrl = `${vcDidDoc?.service?.[0]?.serviceEndpoint}`

    const nameParts = vcMetadata?.subject?.name?.split(":");
    const hasParts = nameParts?.length
    const renderName = hasParts
        ? `${nameParts[0]} ${nameParts[1]}`
        : vcMetadata?.subject?.name


    const commonCardProps = {
        credential,
        parsedVcJwt,
        vcServiceUrl,
        name: renderName,
        issuanceDate: vcMetadata?.issuanceDate,
        expirationDate: vcMetadata?.expirationDate,
        countryCode: vcMetadata?.subject?.countryCode,
        handleCardClicked,
    }

    useEffect(() => {
        let jwtCredentials: any = []
        let parsedCredentials: any = []

        if (localStorageCredentials) {
            const localCredentials = Object.values(localStorageCredentials)
            jwtCredentials = localCredentials.flat()
        } else if (stateCredentials) {
            const contextCredentials = Object.values(stateCredentials)
            jwtCredentials = contextCredentials.flat()
        }

        for (const jwt of jwtCredentials) {
            const parsedCred = parseJwtToVc(jwt)
            const { issuerUri, data } = extractVcDocumentDetails(parsedCred)

            parsedCredentials = [...parsedCredentials, {
                rawCred: parsedCred,
                formattedCred: data,
                issuer: issuerUri
            }]
        }

        const kccCredential = parsedCredentials.find((entry: any) => entry?.formattedCred?.type?.includes(CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL))

        setVcMetadata(kccCredential?.formattedCred)
        getDidDdocument(kccCredential?.issuer)
        setCredentialDidDocument(kccCredential?.rawCred)
    }, [])

    const credentialType = parsedVcJwt
        ? parsedVcJwt?.vcDataModel?.type
        : vcMetadata?.type
    return (
        <Flex>
            <Flex className="h-[200px]">
                <CredentialCard {...commonCardProps} />
            </Flex>

            <Drawer
                title={
                    <DrawerHeader
                        type={credentialType}
                    />
                }
                onClose={onClose}
                open={open}
                width={600}
            >
                <Flex className="justify-between">
                    <Flex className="w-full">
                        <CredentialCard {...commonCardProps} />
                    </Flex>
                    <Flex className="w-1/2">
                        <QRCode
                            errorLevel="H"
                            size={160}
                            iconSize={160 / 4}
                            value="To Do: stringify the vc document and pass it here"
                            icon="/logo-icon.svg"
                        />
                    </Flex>
                </Flex>

                <Card className="flex-col mb-4 w-full">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Issuer Name:</Typography.Text>
                            <Typography.Text style={{ fontSize: 14 }}>{ULTIMATE_IDENTITY_ISSUER_NAME}</Typography.Text>
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
        </Flex>
    );
};

export default FinancialInstitutionCredential;
