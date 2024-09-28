export const EntityProtocol = {
    published: true,
    protocol: 'https://github.com/SrMoffat/tdbunk/web5Protocols/entity',
    types: {
        name: {
            schema: 'https://github.com/SrMoffat/tdbunk/schemas/name',
        },
        profileImage: {
            schema: 'https://github.com/SrMoffat/tdbunk/schemas/profileImage',
            dataFormats: ['image/png', 'jpeg', 'gif'],
        },
        profile: {
            schema: 'https://github.com/SrMoffat/tdbunk/schemas/profile',
            dataFormats: ['application/json'],
        },
        campaigns: {
            schema: 'https://github.com/SrMoffat/tdbunk/schemas/campaigns',
            dataFormats: ['application/json'],
        },
    },
    structure: {
        name: {
            $actions: [
                {
                    who: 'anyone',
                    can: ['read'],
                },
            ],
        },
        profileImage: {
            $actions: [
                {
                    who: 'anyone',
                    can: ['create'],
                },
                {
                    who: 'anyone',
                    can: ['read'],
                },
            ],
        },
        profile: {
            $actions: [
                {
                    who: 'anyone',
                    can: ['create'],
                },
                {
                    who: 'anyone',
                    can: ['read'],
                },
            ],
        },
        campaigns: {
            $actions: [
                {
                    who: 'anyone',
                    can: ['create'],
                },
                {
                    who: 'anyone',
                    can: ['read'],
                },
            ],
        },
    },
};
