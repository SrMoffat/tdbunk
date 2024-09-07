import { TdbunkProtocol } from "@/app/web5Protocols/tdbunk.protocol";
import { Web5PlatformAgent } from '@web5/agent';
import { Web5 as Web5Api } from "@web5/api";
import { VerifiableCredential, type VerifiableCredential as VC } from "@web5/credentials";
import { Jwk, LocalKeyManager } from "@web5/crypto";
import { BearerDid, DidDht, DidResolutionResult } from '@web5/dids';
import { CREDENTIAL_TYPES, VC_JWT_MIME_TYPE } from "../constants";
import { generateUltimateIdentifierVc } from "../api";

const DWN_SYNC_INTERVAL = '5s'
const ULTIMATE_IDENTITY_DID_URI = 'did:dht:bh8me68fsdb6xuyy3dsh4aanczexga3k3m7fk4ie6hj5jy6inq5y'


const ONE_YEAR_FROM_NOW = new Date();
ONE_YEAR_FROM_NOW.setFullYear(ONE_YEAR_FROM_NOW.getFullYear() + 1);

const localKeyManager = new LocalKeyManager();

export const checkIfProtocolIsInstalled = async (web5: Web5Api | null) => {
    try {
        const { protocols, status } = await web5!.dwn.protocols.query({
            message: {
                filter: {
                    protocol: TdbunkProtocol.protocol,
                }
            }
        });

        console.log("Checking here", {
            protocols,
            status
        })

        if (status.code !== 200) {
            // To Do: Better error handling
            alert('Error querying protocols');
            console.error('Error querying protocols', status);
            return false;
        }

        console.log('checkIfProtocolIsInstalled', protocols.length > 0);
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
        const { record } = await web5!.dwn.records.create({
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

        console.log("campaign =====+++-->", campaign)

        const response = await record?.send("did:dht:b3tits968u8rdoxiec3qpb9tizg57zbspgn1mattogi7n3bfmc4y");

        console.log("Data", response?.status)

        if (response?.status?.code !== 202) {
            console.log("Unable to send to target did:" + response?.status?.code);
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
        const { records: campaigns } = await web5!.dwn.records.query({
            message: {
                filter: {
                    schema: TdbunkProtocol.types.campaign.schema,
                },

                // @ts-ignore
                dateSort: 'createdAscending'
            }
        });

        console.log("Reccors Returned fro DWN", campaigns)

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

        const isInstalled = await checkIfProtocolIsInstalled(web5)

        if (!isInstalled) {
            console.log('!isInstalled', !isInstalled);

            // configure protocol on local DWN
            const { status: configureStatus, protocol } = await web5!.dwn.protocols.configure({
                message: {
                    definition: TdbunkProtocol,
                }
            });

            // const isConfigured = configureStatus.detail === 'Accepted'
            if (protocol) {
                const { status: remoteStatus } = await protocol.send(did);
                const isInstalled = remoteStatus.detail === 'Accepted'

                console.log("Local Protocol Installation Status", {
                    status: remoteStatus.detail,
                    isInstalled
                })
            }

            console.log('Protocol configured', configureStatus, protocol);
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

export const initWeb5 = async ({ password }: { password: string }) => {
    const { web5, did, recoveryPhrase } = await Web5Api.connect({
        password,
        sync: DWN_SYNC_INTERVAL
    });
    const agent = web5.agent as Web5PlatformAgent
    const bearerDid = await agent.identity.get({ didUri: did });
    // const identites = await agent.identity.list();
    return {
        web5,
        did,
        bearerDid,
        recoveryPhrase,
    };
}

export const getBearerDid = async (web5: Web5Api, did: string) => {
    const agent = web5.agent as Web5PlatformAgent
    const bearerDid = await agent.identity.get({ didUri: did });
    // const identites = await agent.identity.list();
    return bearerDid;
}

export const storeVcJwtInDwn = async (web5: Web5Api, vcJwt: string, did: string) => {
    const { record } = await web5.dwn.records.create({
        data: vcJwt,
        message: {
            schema: CREDENTIAL_TYPES.KNOWN_CUSTOMER_CREDENTIAL,
            dataFormat: VC_JWT_MIME_TYPE,
        },
    });

    return await record?.send(did);
}

export const fetchVcJwtFromDwn = async (web5: Web5Api, did: string) => {
    const response = await web5.dwn.records.query({
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
    console.log("createRequiredCredential", {
        web5,
        details
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
    }

    return result
}

export const createFinancialCredential = async (details: any) => {
    try {
        console.log("Details:createFinancialCredential", details)
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
    console.log("Details:createGovernmentCredential", details)
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

        console.log("Details:createProfessionalCredential", details)
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
    console.log("Details:createEducationalCredential", details)
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
    console.log("Details:createOfferingReviewCredential", {
        details,
        web5,
        userBearerDid
    })
    try {
        // // Create new credential
        // const credential = await VerifiableCredential.create({
        //     type: CREDENTIAL_TYPES.OFFERING_REVIEW_CREDENTIAL,
        //     issuer: userBearerDid?.did.uri as string,
        //     subject: details?.pfiDid,
        //     expirationDate: ONE_YEAR_FROM_NOW.toISOString(),
        //     data: details
        // });

        // console.log("Created Credential", {
        //     credential,
        //     userBearerDid,
        //     details

        // })

        // // Sign VC
        // const vc = await credential.sign({ did: bearerDid?.did as BearerDid });

        // // Parse VC to get metadata
        // const parsedVc = parseJwtToVc(vc)

        // // Stpre VC in DWN
        // const status = await storeVcJwtInDwn(web5, vc, did)


        // const vcGranularTypes = parsedVc?.vcDataModel?.type
        // const vcConcatenateTypes = vcGranularTypes.join(":")

        // const storedVc = {
        //     [vcConcatenateTypes]: [vc]
        // }

        // const result = {
        //     did,
        //     web5,
        //     status,
        //     storedVc,
        //     bearerDid,
        //     recoveryPhrase
        // }

        // return result

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
