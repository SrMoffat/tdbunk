import { LANDING_PAGE_TABS } from "./constants";

export const isCampaign = (tab: LANDING_PAGE_TABS) => {
    return tab === LANDING_PAGE_TABS.CAMPAIGNS
}

export const isDebunks = (tab: LANDING_PAGE_TABS) => {
    return tab === LANDING_PAGE_TABS.DEBUNKS
}
export const isSponsorships = (tab: LANDING_PAGE_TABS) => {
    return tab === LANDING_PAGE_TABS.SPONSORSHIPS
}
