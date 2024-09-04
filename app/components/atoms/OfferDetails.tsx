import OfferCard from "@/app/components/molecules/cards/Offer";
import { Badge } from "antd";

export interface AssetExchangeOfferProps {
    offeringId: string;
    isSelected: boolean;
    isRecommended: boolean;
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
    offeringToCurrencyMethods
}: AssetExchangeOfferProps) => {
    return isRecommended
        ? <Badge.Ribbon text="Recommended">
            <OfferCard
                offeringId={offeringId}
                issuerDid={issuerDid}
                isSelected={isSelected}
                issuerVcSchema={issuerVcSchema}
                offeringToCurrencyMethods={offeringToCurrencyMethods}
            />
        </Badge.Ribbon>
        : <OfferCard
            offeringId={offeringId}
            issuerDid={issuerDid}
            isSelected={isSelected}
            issuerVcSchema={issuerVcSchema}
            offeringToCurrencyMethods={offeringToCurrencyMethods}
        />
}

export default AssetExchangeOffer
