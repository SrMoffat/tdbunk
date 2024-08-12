import { LANDING_PAGE_TABS, DEBUNK_SOURCE, DEBUNK_CAMPAIGN_TYPE } from "@/app/lib/constants";

export const isCampaign = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.CAMPAIGNS;

export const isDebunks = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.DEBUNKS;

export const isSponsorships = (tab: LANDING_PAGE_TABS) => tab === LANDING_PAGE_TABS.SPONSORSHIPS;

export const isFacebook = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.FACEBOOK;

export const isTikTok = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.TIKTOK;

export const isYoutube = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.YOUTUBE;

export const isInstagram = (source: DEBUNK_SOURCE) => source === DEBUNK_SOURCE.INSTAGRAM;

export const isCommunity = (type: DEBUNK_CAMPAIGN_TYPE) => type === DEBUNK_CAMPAIGN_TYPE.COMMUNITY;

export const isSponsored = (type: DEBUNK_CAMPAIGN_TYPE) => type === DEBUNK_CAMPAIGN_TYPE.SPONSORED;
