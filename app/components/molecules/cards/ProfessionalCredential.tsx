import { Card3, Evidence, ValidCredential } from "@/app/components/atoms/Icon";
import { DrawerHeader } from "@/app/components/molecules/cards/FinancialCredential";
import { CREDENTIAL_TYPES, TDBUNK_ISSUER_NAME } from "@/app/lib/constants";
import { CredentialParsedMetadata, getVcJwtDetails } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Card, Drawer, Flex, QRCode, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns"

const ProfessionalCredentialCard = (props: any) => {
    const {
        showDrawer,
        vcSubject,
        startDate,
        endDate,
        issuance,
        expiration,
        parsedVcJwt,
        handleCardClicked
    } = props

    const onClick = () => {
        showDrawer?.()
        handleCardClicked?.()
    }

    const toRender = parsedVcJwt
        ? getVcJwtDetails(parsedVcJwt, true)
        : {
            issuance,
            vcSubject,
            expiration,
            startDate,
            endDate
        }

    // @ts-ignore
    const start = toRender?.startDate
        // @ts-ignore
        ? toRender?.startDate
        : toRender?.vcSubject?.startDate
            ? format(new Date(toRender?.vcSubject?.startDate), "dd/MM/yyyy")
            : ''

    // @ts-ignore
    const end = toRender?.endDate
        // @ts-ignore
        ? toRender?.endDate
        : toRender?.vcSubject?.endDate
            ? format(new Date(toRender?.vcSubject?.endDate), "dd/MM/yyyy")
            : ''

    return (
        <Flex onClick={onClick} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
            <Image alt="Card3" src={Card3} width={300} height={300} />
            <Flex className="w-full absolute right-0 top-3 flex-col items-center">
                <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${toRender?.vcSubject?.nameOfProfessionalBody}`}</Typography.Text>
            </Flex>
            <Flex className="w-full absolute right-0 top-[90px] flex-col items-center">
                <Flex className="w-full">
                    <Flex className="w-full flex-col pl-2 mt-3">
                        <Typography.Text style={{ fontSize: 12 }}> {`${toRender?.vcSubject?.nameOfProfession}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 12 }}> {`${start} - ${end}`}</Typography.Text>
                    </Flex>
                    <Flex className="w-full flex-col pr-2">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right" }}> {`Issued:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}> {`${toRender?.issuance}`}</Typography.Text>
                        </Flex>
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right" }}> {`Expires:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}> {`${toRender?.expiration}`}</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const ProfessionalInstitutionCredential = (props: any) => {
    const {
        userDid,
        parsedVcJwt,
        stateCredentials,
        handleCardClicked,
        localStorageCredentials
    } = props

    const [open, setOpen] = useState(false);
    const [parsedCred, setParsedCred] = useState<any>()
    const [issuance, setIssuance] = useState<string | undefined>()
    const [expiration, setExpiration] = useState<string | undefined>()
    const [issuerServiceUrl, setIssuerServiceUrl] = useState<string | undefined>()
    const [vcSubject, setVcSubject] = useState<CredentialParsedMetadata>()

    useEffect(() => {
        (async () => {
            if (!stateCredentials) return

            const isState = Object.keys(stateCredentials)?.length

            const credentialTypes = isState
                ? Object.keys(stateCredentials)[0]
                : Object.keys(localStorageCredentials)[0]

            const credentialType = credentialTypes?.split(":")[1]

            const isProfessionalCred = credentialType === CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL

            if (isProfessionalCred) {
                const vcJwt = isState
                    ? stateCredentials[credentialTypes][0]
                    : localStorageCredentials[credentialTypes][0]

                const {
                    issuance,
                    vcSubject,
                    parsedCred,
                    expiration,
                    issuerDidUri,
                    // issuerServiceUrl
                } = getVcJwtDetails(vcJwt)

                // @ts-ignore
                const issuerDidDocument = await resolveDid(issuerDidUri)

                const issuerServiceUrls = issuerDidDocument?.service?.[0]?.serviceEndpoint as any
                const issuerServiceUrl = issuerServiceUrls[0] as string

                // setCountry(country)
                setIssuance(issuance)
                setVcSubject(vcSubject)
                setParsedCred(parsedCred)
                setExpiration(expiration)
                setIssuerServiceUrl(issuerServiceUrl)

            }
        })()
    }, [stateCredentials, localStorageCredentials])

    const startDate = new Date(vcSubject?.startDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    const endDate = new Date(vcSubject?.endDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    const showDrawer = () => {
        setOpen(true)
    }

    const onClose = () => {
        setOpen(false)
    }

    const commonProps = {
        showDrawer,
        vcSubject,
        startDate,
        endDate,
        issuance,
        expiration,
        parsedVcJwt,
        handleCardClicked
    }

    return (
        <Flex>
            <Flex className="h-[200px]">
                <ProfessionalCredentialCard {...commonProps} />
            </Flex>
            <Drawer title={
                <DrawerHeader
                    type={[
                        CREDENTIAL_TYPES.VERIFIABLE_CREDENTIAL,
                        CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL
                    ]}
                />
            }
                onClose={onClose}
                open={open}
                width={600}
            >
                <Flex className="justify-between">
                    <Flex className="w-full">
                        <ProfessionalCredentialCard {...commonProps} />
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

                <Card className="flex-col mb-4">
                    <Flex className="mb-3 justify-between">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 18 }}>Issuer Name:</Typography.Text>
                            <Typography.Text style={{ fontSize: 14 }}>{TDBUNK_ISSUER_NAME}</Typography.Text>
                        </Flex>
                        <Image src={ValidCredential} width={50} height={50} alt="valid" />
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Service Endpoint:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{issuerServiceUrl}</Typography.Text>
                    </Flex>
                    <Flex className="flex-col mb-3">
                        <Typography.Text style={{ fontSize: 18 }}>Issuer DID:</Typography.Text>
                        <Typography.Text style={{ fontSize: 14 }} copyable>{userDid}</Typography.Text>
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
                        <pre>{JSON.stringify(parsedCred, null, 2)}</pre>
                    </Flex>
                </Card>
            </Drawer>
        </Flex>
    );
};

export default ProfessionalInstitutionCredential
