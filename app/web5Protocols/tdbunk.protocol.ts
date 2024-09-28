export const TdbunkProtocol = {
    protocol: "https://github.com/SrMoffat/tdbunk/blob/main/app/web5Protocols",
    published: true,
    types: {
        campaign: {
            schema: "https://github.com/SrMoffat/tdbunk/blob/main/app/web5Protocols/campaign.protocol.ts",
            dataFormats: ["application/json"]
        },
        evidence: {
            schema: "https://github.com/SrMoffat/tdbunk/blob/main/app/web5Protocols/evidence.protocol.ts",
            dataFormats: ["application/json"]
        }
    },
    structure: {
        campaign: {
            $actions: [
                {
                    who: "anyone",
                    can: ["read", "create"]
                }
            ],
            evidence: {
                $actions: [
                    {
                        who: "author",
                        of: "campaign",
                        can: ["create"]
                    },
                    {
                        who: "recipient",
                        of: "campaign",
                        can: ["create"]
                    }
                ]
            }
        }
    }
}
