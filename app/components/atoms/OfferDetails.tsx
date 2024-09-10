import OfferCard from "@/app/components/molecules/cards/Offer";
import { Badge } from "antd";

export interface AssetExchangeOfferProps {
    offeringId: string;
    isSelected: boolean;
    isRecommended: boolean;
    isSpecial: boolean;
    hasRequiredClaims: boolean;
    issuerVcSchema: string;
    issuerDid: string;
    offeringToCurrencyMethods: any[];

}

const AssetExchangeOffer = ({
    offeringId,
    isSelected,
    issuerVcSchema,
    issuerDid,
    isRecommended,
    isSpecial,
    hasRequiredClaims,
    offeringToCurrencyMethods
}: AssetExchangeOfferProps) => {
    return isRecommended
        ? <Badge.Ribbon text="Recommended">
            <OfferCard
                offeringId={offeringId}
                issuerDid={issuerDid}
                hasRequiredClaims={hasRequiredClaims}
                isRecommended={isRecommended}
                isSpecial={isSpecial}
                isSelected={isSelected}
                issuerVcSchema={issuerVcSchema}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </Badge.Ribbon>
        : <OfferCard
            offeringId={offeringId}
            issuerDid={issuerDid}
            isSpecial={isSpecial}
            hasRequiredClaims={hasRequiredClaims}
            isRecommended={isRecommended}
            isSelected={isSelected}
            issuerVcSchema={issuerVcSchema}
            offeringToCurrencyMethods={offeringToCurrencyMethods}
        />
}

export default AssetExchangeOffer
