import { DEBUNK_SOURCE, DEBUNK_CAMPAIGN_TYPE } from "@/app/lib/constants";
import { Card1, Card2, Card3, TBDVCLogoYellow } from "@/app/components/atoms/Icon";

interface RecordType {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
}

export const campaigns = [
    {
        id: '1',
        title: "An amazing title to a Facebook fake news post.",//
        source: DEBUNK_SOURCE.FACEBOOK,//
        factCheckers: [],
        sponsors: [],
        type: "Community",//
        amount: 3000,//
        currency: "USD",//
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    },
    {
        id: '2',
        title: "An amazing title to a TikTok fake news post.",
        source: DEBUNK_SOURCE.TIKTOK,
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    },
    {
        id: '3',
        title: "An amazing title to a Instagram fake news post.",
        source: DEBUNK_SOURCE.INSTAGRAM,
        factCheckers: [],
        sponsors: [],
        type: "Community",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    },
    {
        id: '4',
        title: "An amazing title to an X fake news post.",
        source: DEBUNK_SOURCE.X,
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    },
    {
        id: '5',
        title: "An amazing title to a Youtube fake news post.",
        source: DEBUNK_SOURCE.YOUTUBE,
        factCheckers: [],
        sponsors: [],
        type: "Community",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    },
    {
        id: '6',
        title: "campaigns This Story",
        source: DEBUNK_SOURCE.FACEBOOK,
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'open',
        isFactual: undefined,
        href: 'https://articlesource.com',
    }
]

export const debunks = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://articlesource.com',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    factCheckers: [],
    sponsors: [],
    tippers: [],
    evidences: [],
    amount: 3000,
    currency: "USD",
    isFactual: i % 2 === 0,
    source: i % 2 === 0 ? DEBUNK_SOURCE.X : i % 3 === 0 ? DEBUNK_SOURCE.TIKTOK : DEBUNK_SOURCE.FACEBOOK,
    type: i % 2 === 0 ? DEBUNK_CAMPAIGN_TYPE.COMMUNITY : DEBUNK_CAMPAIGN_TYPE.SPONSORED
}));

export const sponsorships = Array.from({ length: 23 }).map((_, i) => ({
    href: 'https://articlesource.com',
    title: `ant design part ${i}`,
    avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
    description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    factCheckers: [],
    sponsors: [],
    tippers: [],
    evidences: [],
    amount: 3000,
    currency: "USD",
    isFactual: i % 2 === 0,
    source: i % 2 === 0 ? DEBUNK_SOURCE.X : i % 3 === 0 ? DEBUNK_SOURCE.TIKTOK : DEBUNK_SOURCE.FACEBOOK,
    type: i % 2 === 0 ? DEBUNK_CAMPAIGN_TYPE.COMMUNITY : DEBUNK_CAMPAIGN_TYPE.SPONSORED
}));

export const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
}));

export const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);

export const credentials = [
    {
        expires: new Date(),
        id: '1',
        uiTemplate: Card1,
        issuer: {
            logo: TBDVCLogoYellow,
            url: 'https://mock-idv.tbddev.org',
            name: 'Ultimate Identity',
        },
        holder: {
            firstName: 'James',
            lastName: 'Does',
            country: 'KE'
        }
       
    },
    {
        expires: new Date(),
        id: '2',
        uiTemplate: Card2,
        issuer: {
            logo: TBDVCLogoYellow,
            url: 'https://mock-idv.tbddev.org',
            name: 'Ultimate Identity',
        },
        holder: {
            firstName: 'John',
            lastName: 'Doe',
            country: 'NL'
        }

    },
    {
        expires: new Date(),
        id: '3',
        uiTemplate: Card3,
        issuer: {
            logo: TBDVCLogoYellow,
            url: 'https://mock-idv.tbddev.org',
            name: 'Ultimate Identity',
        },
        holder: {
            firstName: 'Jane',
            lastName: 'Did',
            country: 'US'
        }

    }
];
