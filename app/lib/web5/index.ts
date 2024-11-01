import { generateUltimateIdentifierVc } from "@/app/lib/api";
import { TdbunkProtocol } from "@/app/web5Protocols/tdbunk.protocol";
import { Web5PlatformAgent } from '@web5/agent';
import { Web5 as Web5Api } from "@web5/api";
import { VerifiableCredential, type VerifiableCredential as VC } from "@web5/credentials";
import { Jwk, LocalKeyManager } from "@web5/crypto";
import { BearerDid, DidDht, DidResolutionResult } from '@web5/dids';
import { formatDistanceToNow } from "date-fns";
import { parse, stringify } from 'flatted';
import { BEARER_DID_LOCAL_STORAGE_KEY, CREDENTIAL_TYPES, VC_JWT_MIME_TYPE } from "../constants";

const DWN_SYNC_INTERVAL = '5s'

const ONE_YEAR_FROM_NOW = new Date();
ONE_YEAR_FROM_NOW.setFullYear(ONE_YEAR_FROM_NOW.getFullYear() + 1);

const localKeyManager = new LocalKeyManager();

export interface CredentialParsedMetadata {
    id?: string;
    name?: string;
    countryOfResidence?: string;
    firstName?: string;
    lastName?: string;
    idNumber?: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    nameOfProfessionalBody?: string;
    nameOfProfession?: string;
    startDate?: string;
    endDate?: string;
    nameOfInstituion?: string;
    nameOfCourse?: string;
    startedDate?: string;
    endedDate?: string;
}

export const checkIfProtocolIsInstalled = async (web5: Web5Api | null) => {
    try {
        let web5Instance = web5

        if (!web5Instance) {
            const { web5: returnedWeb5 } = await Web5Api.connect()
            web5Instance = returnedWeb5
        }


        const { protocols, status } = await web5Instance!.dwn.protocols.query({
            message: {
                filter: {
                    protocol: TdbunkProtocol.protocol,
                }
            }
        });

        if (status.code !== 200) {
            // To Do: Better error handling
            console.error('Error querying protocols', status);
            return false;
        }

        return protocols.length > 0
    } catch (error: any) {
        console.error("Error checkIfProtocolIsInstalled", error)
    }
}

export const createDwnCampaign = async (web5: Web5Api | null) => {
    const campaignDetails = {
        "@type": "campaign",
        "title": "Debunk Test Campaign",
        "description": "Debunk Test Campaign Descriptions Here Goes",
        "author": "did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y",
        // "recipient": newTodo.value.recipientDID,
    }

    try {
        let web5Instance = web5

        if (!web5Instance) {
            const { web5: returnedWeb5 } = await Web5Api.connect()
            web5Instance = returnedWeb5
        }

        const { record } = await web5Instance!.dwn.records.create({
            data: campaignDetails,
            message: {
                protocol: TdbunkProtocol.protocol,
                protocolPath: 'campaign',
                schema: TdbunkProtocol.types.campaign.schema,
                dataFormat: TdbunkProtocol.types.campaign.dataFormats[0],
                recipient: "did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y"
            }
        });

        const data = await record?.data.json();
        const campaign = { record, data, id: record?.id };

        const response = await record?.send("did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y");

        if (response?.status?.code !== 202) {
            return;
        }
        else {
            console.log("Shared campaign sent to recipient");
        }

    } catch (error: any) {
        console.error("Error createDwnCampaign", error)
    }
}

export const fetchCampaigns = async (web5: Web5Api | null, did: string): Promise<any> => {
    try {
        let web5Instance = web5

        if (!web5Instance) {
            const { web5: returnedWeb5 } = await Web5Api.connect()
            web5Instance = returnedWeb5
        }

        const { records: campaigns } = await web5Instance!.dwn.records.query({
            message: {
                filter: {
                    schema: TdbunkProtocol.types.campaign.schema,
                },

                // @ts-ignore
                dateSort: 'createdAscending'
            }
        });

        // CreatedAscending = 'createdAscending',
        //     CreatedDescending = 'createdDescending',
        //     PublishedAscending = 'publishedAscending',
        //     PublishedDescending = 'publishedDescending'

        return campaigns
    } catch (error: any) {
        console.log("Error fetching campaigns", error);
    }
}

export const setupTdbunkProtocol = async (web5: Web5Api | null, did: string) => {
    try {
        let web5Instance = web5

        if (!web5Instance) {
            const { web5: returnedWeb5 } = await Web5Api.connect()
            web5Instance = returnedWeb5
        }


        const isInstalled = await checkIfProtocolIsInstalled(web5Instance)

        if (!isInstalled) {
            // configure protocol on local DWN
            const { status: configureStatus, protocol } = await web5Instance!.dwn.protocols.configure({
                message: {
                    definition: TdbunkProtocol,
                }
            });

            // const isConfigured = configureStatus.detail === 'Accepted'
            if (protocol) {
                const { status: remoteStatus } = await protocol.send(did);
                const isInstalled = remoteStatus.detail === 'Accepted'
            }
        }
    } catch (error: any) {
        console.log("Error setting up campaign protocol", error);
    }
}

export const generateDid = async () => {
    const didDht = await DidDht.create({
        keyManager: localKeyManager,
        options: {
            publish: true
        }
    });

    const portableDid = await didDht.export()
    const privateKeys: Jwk[] = portableDid?.privateKeys ?? []
    const privateKeysUris = []

    for (let pk of privateKeys) {
        const keyUri = await localKeyManager.getKeyUri({
            key: pk
        });
        privateKeysUris.push(keyUri)
    }

    return {
        didDht,
        portableDid,
        privateKeysUris,
    }
}

export const resolveDid = async (didUri: string): Promise<DidResolutionResult | undefined> => {
    try {
        const resolvedDhtDid = await DidDht.resolve(didUri);
        // console.log("Resolved DID", resolvedDhtDid)
        return resolvedDhtDid
    } catch (error: any) {
        console.log("Resolution error", error)
    }
}

export const parseJwtToVc = (signedVcJwt: any): VC => {
    return VerifiableCredential.parseJwt({ vcJwt: signedVcJwt })
}

export const storeBearerDid = async (bearerDid: any) => {
    try {
        const stringifiedBearerDid = stringify(bearerDid)
        // To Do: Find out best practices around management of Bearer Dids on web
        // Ideally key material should npt be serialised into a string like this
        // and storing keys on the browser beats the whole point of keys.
        localStorage.setItem(BEARER_DID_LOCAL_STORAGE_KEY, stringifiedBearerDid)
    } catch (error: any) {
        console.error("storeBearerDid error", error)
    }
}

export const initWeb5 = async ({ password }: { password: string }) => {
    const { web5, did, recoveryPhrase } = await Web5Api.connect({
        password,
        sync: DWN_SYNC_INTERVAL
    });
    const agent = web5.agent as Web5PlatformAgent
    const bearerDid = await agent.identity.get({ didUri: did });

    await storeBearerDid(bearerDid)

    return {
        web5,
        did,
        bearerDid,
        recoveryPhrase,
    };
}

export const getUserBearerDid = async (web5?: Web5Api, did?: string) => {
    let bearerDid

    if (web5 && did) {
        const agent = web5.agent as Web5PlatformAgent
        const web5BearerDid = await agent.identity.get({ didUri: did });
        bearerDid = web5BearerDid
    } else {
        const details = localStorage.getItem(BEARER_DID_LOCAL_STORAGE_KEY)

        if (details) {
            bearerDid = parse(details)
        }
    }
    return bearerDid;
}

export const storeVcJwtInDwn = async (web5: Web5Api, vcJwt: string, did: string) => {
    let web5Instance = web5

    if (!web5Instance) {
        const { web5: returnedWeb5 } = await Web5Api.connect()
        web5Instance = returnedWeb5
    }

    const { record } = await web5Instance!.dwn.records.create({
        data: vcJwt,
        message: {
            schema: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
            dataFormat: VC_JWT_MIME_TYPE,
        },
    });

    return await record?.send(did);
}

export const fetchVcJwtFromDwn = async (web5: Web5Api, did: string) => {
    let web5Instance = web5

    if (!web5Instance) {
        const { web5: returnedWeb5 } = await Web5Api.connect()
        web5Instance = returnedWeb5
    }

    const response = await web5Instance!.dwn.records.query({
        from: did,
        message: {
            filter: {
                schema: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
                dataFormat: VC_JWT_MIME_TYPE,
            },
        },
    });

    return await response?.records?.[0]?.data?.text()
}

export const createRequiredCredential = async (web5: Web5Api, did: string, details: any) => {
    // Create new credential
    const vc = await generateUltimateIdentifierVc({
        ...details,
        email: `${details?.firstName}:${details?.lastName}:${details?.email}`,
        did
    })

    // Parse VC to get metadata
    const parsedVc = parseJwtToVc(vc)

    let web5Instance = web5

    if (!web5Instance) {
        const { web5: returnedWeb5 } = await Web5Api.connect()
        web5Instance = returnedWeb5
    }

    const status = await storeVcJwtInDwn(web5Instance, vc, did)


    const vcGranularTypes = parsedVc?.vcDataModel?.type
    const vcConcatenateTypes = vcGranularTypes.join(":")

    const storedVc = {
        [vcConcatenateTypes]: [vc]
    }

    const result = {
        did,
        web5: web5Instance,
        status,
        storedVc,
    }

    return result
}

export const createFinancialCredential = async (details: any) => {
    try {
        // Create DWN and Did
        const { web5, did, bearerDid, recoveryPhrase } = await initWeb5({
            password: details?.password as string
        })

        // Create new credential
        const vc = await generateUltimateIdentifierVc({
            ...details,
            email: `${details?.firstName}:${details?.lastName}:${details?.email}`,
            did
        })

        // Parse VC to get metadata
        const parsedVc = parseJwtToVc(vc)

        const status = await storeVcJwtInDwn(web5, vc, did)


        const vcGranularTypes = parsedVc?.vcDataModel?.type
        const vcConcatenateTypes = vcGranularTypes.join(":")

        const storedVc = {
            [vcConcatenateTypes]: [vc]
        }

        const result = {
            did,
            web5,
            status,
            storedVc,
            bearerDid,
            recoveryPhrase
        }

        return result
    } catch (error: any) {
        console.log("Error:createFinancialCredential", error)
    }
}

export const createGovernmentCredential = async (details: any) => {
    try {
        // Create DWN and Did
        const { web5, did, bearerDid, recoveryPhrase } = await initWeb5({
            password: details?.password as string
        })

        // Create new credential
        const credential = await VerifiableCredential.create({
            type: CREDENTIAL_TYPES.GOVERNMENT_CREDENTIAL,
            issuer: bearerDid?.did.uri as string,
            subject: did,
            expirationDate: ONE_YEAR_FROM_NOW.toISOString(),
            data: details
        });

        // Sign VC
        const vc = await credential.sign({ did: bearerDid?.did as BearerDid });

        // Parse VC to get metadata
        const parsedVc = parseJwtToVc(vc)

        // Stpre VC in DWN
        const status = await storeVcJwtInDwn(web5, vc, did)


        const vcGranularTypes = parsedVc?.vcDataModel?.type
        const vcConcatenateTypes = vcGranularTypes.join(":")

        const storedVc = {
            [vcConcatenateTypes]: [vc]
        }

        const result = {
            did,
            web5,
            status,
            storedVc,
            bearerDid,
            recoveryPhrase
        }

        return result
    } catch (error: any) {
        console.log("Error:createGovernmentCredential", details)
    }
}

export const createProfessionalCredential = async (details: any) => {
    try {

        // Create DWN and Did
        const { web5, did, bearerDid, recoveryPhrase } = await initWeb5({
            password: details?.password as string
        })

        // Create new credential
        const credential = await VerifiableCredential.create({
            type: CREDENTIAL_TYPES.PROFESSIONAL_CREDENTIAL,
            issuer: bearerDid?.did.uri as string,
            subject: did,
            expirationDate: ONE_YEAR_FROM_NOW.toISOString(),
            data: details
        });

        // Sign VC
        const vc = await credential.sign({ did: bearerDid?.did as BearerDid });

        // Parse VC to get metadata
        const parsedVc = parseJwtToVc(vc)

        // Stpre VC in DWN
        const status = await storeVcJwtInDwn(web5, vc, did)


        const vcGranularTypes = parsedVc?.vcDataModel?.type
        const vcConcatenateTypes = vcGranularTypes.join(":")

        const storedVc = {
            [vcConcatenateTypes]: [vc]
        }

        const result = {
            did,
            web5,
            status,
            storedVc,
            bearerDid,
            recoveryPhrase
        }

        return result
    } catch (error: any) {
        console.log("Error:createProfessionalCredential", error)
    }
}

export const createEducationalCredential = async (details: any) => {
    try {
        // Create DWN and Did
        const { web5, did, bearerDid, recoveryPhrase } = await initWeb5({
            password: details?.password as string
        })

        // Create new credential
        const credential = await VerifiableCredential.create({
            type: CREDENTIAL_TYPES.EDUCATIONAL_CREDENTIAL,
            issuer: bearerDid?.did.uri as string,
            subject: did,
            expirationDate: ONE_YEAR_FROM_NOW.toISOString(),
            data: details
        });

        // Sign VC
        const vc = await credential.sign({ did: bearerDid?.did as BearerDid });

        // Parse VC to get metadata
        const parsedVc = parseJwtToVc(vc)

        // Stpre VC in DWN
        const status = await storeVcJwtInDwn(web5, vc, did)


        const vcGranularTypes = parsedVc?.vcDataModel?.type
        const vcConcatenateTypes = vcGranularTypes.join(":")

        const storedVc = {
            [vcConcatenateTypes]: [vc]
        }

        const result = {
            did,
            web5,
            status,
            storedVc,
            bearerDid,
            recoveryPhrase
        }

        return result

    } catch (error: any) {
        console.log("Error:createEducationalCredential", error)

    }
}

export const createOfferingReviewCredential = async (web5: Web5Api, userBearerDid: any, details: any) => {
    try {
        // Create new credential
        const credential = await VerifiableCredential.create({
            type: CREDENTIAL_TYPES.OFFERING_REVIEW_CREDENTIAL,
            issuer: userBearerDid?.did.uri as string,
            subject: details?.pfiDid,
            expirationDate: ONE_YEAR_FROM_NOW.toISOString(),
            data: details
        });

        // Sign VC
        const vc = await credential.sign({ did: userBearerDid?.did as BearerDid });

        let web5Instance = web5

        if (!web5Instance) {
            const { web5: returnedWeb5 } = await Web5Api.connect()
            web5Instance = returnedWeb5
        }


        // Store VC in DWN
        const status = await storeVcJwtInDwn(web5Instance, vc, userBearerDid?.did.uri)

        return status
    } catch (error: any) {
        console.log("Error:createOfferingReviewCredential", error)

    }
}

export const checkIfUserHasRequiredClaims = (credentials: any[], requiredClaims: any) => {
    let hasRequiredCreds = false

    credentials!.forEach(jwt => {
        const data = parseJwtToVc(jwt)
        const vcData = data?.vcDataModel
        const issuerDidUri = vcData?.issuer

        let requiredIssuerDidUri = ''

        if (requiredClaims["vc.issuer"]) {
            requiredIssuerDidUri = requiredClaims["vc.issuer"]
        } else if (requiredClaims["issuer"]) {
            requiredIssuerDidUri = requiredClaims["issuer"]
        }

        hasRequiredCreds = requiredIssuerDidUri === issuerDidUri
    })

    const doesNotNeedClaims = !Boolean(Object.keys(requiredClaims).length)

    return doesNotNeedClaims || hasRequiredCreds
}

export const installTransactionProtocol = () => {
    console.log("To Do: Install Transaction Protocol")
}

export const storeTbdexTransactionInDwn = async (transaction: any) => {
    // web5: Web5Api, 
    // Only stores exchanges of type Close i.e cancelled and completed transactions
    // let web5Instance = web5

    // if (!web5Instance) {
    //     const { web5: returnedWeb5 } = await Web5Api.connect()
    //     web5Instance = returnedWeb5
    // }

    // const { record } = await web5Instance!.dwn.records.create({
    //     data: transaction
    // });

    console.log("To Do: storeTbdexTransaction", transaction)
}

export const extractVcDocumentDetails = (vc: VerifiableCredential) => {
    const vcModel = vc?.vcDataModel

    const credentialSubject = vcModel?.credentialSubject as CredentialParsedMetadata

    const credentialMetadata = {
        subject: {
            didUri: credentialSubject?.id,
            name: credentialSubject?.name,
            endDate: credentialSubject?.endDate,
            idNumber: credentialSubject?.idNumber,
            lastName: credentialSubject?.lastName,
            startDate: credentialSubject?.startDate,
            endedDate: credentialSubject?.endedDate,
            firstName: credentialSubject?.firstName,
            phoneNumber: credentialSubject?.phoneNumber,
            startedDate: credentialSubject?.startedDate,
            dateOfBirth: credentialSubject?.dateOfBirth,
            nameOfCourse: credentialSubject?.nameOfCourse,
            countryCode: credentialSubject?.countryOfResidence,
            nameOfProfession: credentialSubject?.nameOfProfession,
            nameOfInstituion: credentialSubject?.nameOfInstituion,
            nameOfProfessionalBody: credentialSubject?.nameOfProfessionalBody,
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


export const getVcJwtDetails = (jwt: any, isParsed: boolean = false) => {
    let parsedCred

    if (!isParsed) {
        parsedCred = parseJwtToVc(jwt)
    } else {
        parsedCred = jwt
    }

    const { data } = extractVcDocumentDetails(parsedCred)

    const vcSubject = data?.subject
    const issuanceDate = data?.issuanceDate
    const expirationDate = data?.expirationDate
    const issuerDidUri = data?.issuerDidUri

    const issuance = issuanceDate ? formatDistanceToNow(new Date(issuanceDate), { addSuffix: true }) : ''
    const expiration = expirationDate ? formatDistanceToNow(new Date(expirationDate), { addSuffix: true }) : ''

    return {
        issuance,
        vcSubject,
        parsedCred,
        expiration,
        issuerDidUri,
    }
}
