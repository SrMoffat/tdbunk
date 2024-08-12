import { Web5 as Web5Api } from "@web5/api";

import { CampaignProtocol } from "@/app/web5Protocols/campaign.protocol";

export const setupCampaignProtocol = async (web5: Web5Api | null, did: string) => {
    try {
        const { protocol, status: localStatus } =
            await web5!.dwn.protocols.configure({
                message: {
                    definition: CampaignProtocol,
                },
            });

        const isConfigured = localStatus.detail === 'Accepted'

        console.log("Local Protocol Configuration Status", {
            status: localStatus.detail,
            isConfigured
        })

        if (protocol) {
            const { status: remoteStatus } = await protocol.send(did);
            const isInstalled = remoteStatus.detail === 'Accepted'

            console.log("Local Protocol Installation Status", {
                status: remoteStatus.detail,
                isInstalled
            })
        }
    } catch (error: any) {
        console.log("Error setting up campaign protocol", error);
    }
}

export const fetchCampaigns = async (web5: Web5Api | null, did: string): Promise<any> => {
    try {
        const { records: campaigns } = await web5!.dwn.records.query({
            message: {
                filter: {
                    protocol: CampaignProtocol.protocol,
                    protocolPath: "title",
                    author: did,
                    schema: CampaignProtocol.types.title.schema,
                },
            },
        });

        return campaigns
    } catch (error: any) {
        console.log("Error fetching campaigns", error);
    }
}

export const setupDebunkProtocol = () => { }

export const setupSponsorshipProtocol = () => { }