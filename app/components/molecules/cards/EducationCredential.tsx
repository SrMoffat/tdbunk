import { Card4, Evidence, ValidCredential } from "@/app/components/atoms/Icon";
import { DrawerHeader } from "@/app/components/molecules/cards/FinancialCredential";
import { CREDENTIAL_TYPES, TDBUNK_ISSUER_NAME } from "@/app/lib/constants";
import { CredentialParsedMetadata, getVcJwtDetails } from "@/app/lib/web5";
import { resolveDid } from "@tbdex/http-client";
import { Card, Drawer, Flex, QRCode, Typography } from "antd";
import Image from "next/image";
import { useEffect, useState } from "react";
import { format } from "date-fns"

const EducationalCredentialCard = (props: any) => {
    const {
        showDrawer,
        vcSubject,
        startedDate,
        endedDate,
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
            startedDate,
            endedDate
        }

    // @ts-ignore
    const starting = toRender?.startedDate
    // @ts-ignore
    const ending = toRender?.endedDate

    const start = starting
        ? starting
        : toRender?.vcSubject?.startedDate
            ? format(new Date(toRender?.vcSubject?.startedDate), "dd/MM/yyyy")
            : ''

    // @ts-ignore
    const end = ending
        ? ending
        : toRender?.vcSubject?.endedDate
            ? format(new Date(toRender?.vcSubject?.endedDate), "dd/MM/yyyy")
            : ''

    return (
        <Flex className="h-[200px]">
            <Flex onClick={onClick} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card4" src={Card4} width={300} height={300} />
                <Flex className="top-[70px] absolute w-full right-0">
                    <Flex className="w-full pl-2 flex-col mt-4">
                        <Typography.Text style={{ fontSize: 12 }}>{`${toRender?.vcSubject?.nameOfInstituion}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 10 }}>{`${toRender?.vcSubject?.nameOfCourse}`}</Typography.Text>
                        <Typography.Text style={{ fontSize: 10 }}>{`${start} - ${end}`}</Typography.Text>
                    </Flex>
                    <Flex className="w-full flex-col pr-2">
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right", fontWeight: 'bold' }}>{`Issued:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}>{`${toRender?.issuance}`}</Typography.Text>
                        </Flex>
                        <Flex className="flex-col">
                            <Typography.Text style={{ fontSize: 12, textAlign: "right", fontWeight: 'bold' }}>{`Expires:`}</Typography.Text>
                            <Typography.Text style={{ fontSize: 10, textAlign: "right" }}>{`${toRender?.expiration}`}</Typography.Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

const EducationalInstitutionCredential = (props: any) => {
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
    const [vcSubject, setVcSubject] = useState<CredentialParsedMetadata>()
    const [issuerServiceUrl, setIssuerServiceUrl] = useState<string | undefined>()

    useEffect(() => {
        (async () => {
            if (!stateCredentials) return

            const isState = Object.keys(stateCredentials)?.length

            const credentialTypes = isState
                ? Object.keys(stateCredentials)[0]
                : Object.keys(localStorageCredentials)[0]

            const credentialType = credentialTypes?.split(":")[1]

            const isEducationalCred = credentialType === CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL

            if (isEducationalCred) {
                const vcJwt = isState
                    ? stateCredentials[credentialTypes][0]
                    : localStorageCredentials[credentialTypes][0]

                const {
                    issuance,
                    vcSubject,
                    parsedCred,
                    expiration,
                    issuerDidUri,
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

    const startedDate = new Date(vcSubject?.startedDate as string).toLocaleString('default', {
        dateStyle: 'short'
    })

    const endedDate = new Date(vcSubject?.endedDate as string).toLocaleString('default', {
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
        startedDate,
        endedDate,
        issuance,
        expiration,
        parsedVcJwt,
        handleCardClicked
    }

    return (
        <Flex>
            <Flex className="h-[200px]">
                <EducationalCredentialCard {...commonProps} />
            </Flex>
            <Drawer
                title={
                    <DrawerHeader
                        type={[
                            CREDENTIAL_TYPES.VERIFIABLE_CREDENTIAL,
                            CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL
                        ]}
                    />
                }
                onClose={onClose}
                open={open}
                width={600}
            >
                <Flex className="justify-between">
                    <Flex className="w-full">
                        <EducationalCredentialCard {...commonProps} />
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

export default EducationalInstitutionCredential;
