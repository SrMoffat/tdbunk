interface RecordType {
    key: string;
    title: string;
    description: string;
    disabled: boolean;
}

export const campaigns = [
    {
        id: '1',
        title: "An amazing title to a Facebook fake news post.",
        source: "Facebook",
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
        id: '2',
        title: "An amazing title to a TikTok fake news post.",
        source: "TikTok",
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
        source: "Instagram",
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
        source: "X",
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
        source: "Youtube",
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
        source: "Facebook",
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

export const debunks = [
    {
        id: '1',
        title: "An amazing title to a Facebook fake news post.",
        source: "Facebook",
        factCheckers: [],
        sponsors: [],
        type: "Community",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: false
    },
    {
        id: '2',
        title: "An amazing title to a TikTok fake news post.",
        source: "TikTok",
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: true
    },
    {
        id: '3',
        title: "An amazing title to a Instagram fake news post.",
        source: "Instagram",
        factCheckers: [],
        sponsors: [],
        type: "Community",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: false
    },
    {
        id: '4',
        title: "An amazing title to an X fake news post.",
        source: "X",
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: true
    },
    {
        id: '5',
        title: "An amazing title to a Youtube fake news post.",
        source: "Youtube",
        factCheckers: [],
        sponsors: [],
        type: "Community",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: false
    },
    {
        id: '6',
        title: "campaigns This Story",
        source: "Facebook",
        factCheckers: [],
        sponsors: [],
        type: "Sponsored",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: "",
        status: 'closed',
        isFactual: true
    }
]

export const sponsorships = [
    {
        id: '1',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    },
    {
        id: '2',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    },
    {
        id: '3',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    },
    {
        id: '3',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    },
    {
        id: '3',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    },
    {
        id: '3',
        title: "sponsorships This Story",
        source: "Facebook",
        factCheckers: [],
        type: "Free",
        amount: 3000,
        currency: "USD",
        evidences: [],
        thumbnail: ""
    }
]

export const campaignData = Array.from({ length: 23 }).map((_, i) => ({
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
    source: i % 2 === 0 ? "X" : i % 3 === 0 ? "TikTok" : "Facebook",
    type: i % 2 === 0 ? "Community" : "Sponsored"
}));

export const mockData: RecordType[] = Array.from({ length: 20 }).map((_, i) => ({
    key: i.toString(),
    title: `content${i + 1}`,
    description: `description of content${i + 1}`,
    disabled: i % 3 < 1,
}));

export const oriTargetKeys = mockData.filter((item) => Number(item.key) % 3 > 1).map((item) => item.key);
