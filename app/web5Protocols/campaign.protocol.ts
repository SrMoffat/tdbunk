export const CampaignProtocol = {
    protocol: "https://github.com/SrMoffat/tdbunk/web5Protocols/campaign",
    published: true,
    types: {
        title: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/title",
            dataFormats: [
                "application/json"
            ]
        },
        source: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/source",
            dataFormats: [
                "application/json"
            ]
        },
        type: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/type",
            dataFormats: [
                "application/json"
            ]
        },
        amount: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/amount",
            dataFormats: [
                "application/json"
            ]
        },
        currency: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/currency",
            dataFormats: [
                "application/json"
            ]
        },
        thumbnail: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/thumbnail",
            dataFormats: [
                "application/json"
            ]
        },
        status: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/status",
            dataFormats: [
                "application/json"
            ]
        },
        isFactual: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/isFactual",
            dataFormats: [
                "application/json"
            ]
        },
        href: {
            schema: "https://github.com/SrMoffat/tdbunk/schemas/href",
            dataFormats: [
                "application/json"
            ]
        }
    },
    structure: {
        title: {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "source": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "type": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "thumbnail": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "status": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "isFactual": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        },
        "href": {
            $actions: [
                {
                    who: "anyone",
                    can: [
                        "create",
                        "read"
                    ]
                }
            ]
        }
    }
}