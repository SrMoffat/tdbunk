import { Card5 } from "@/app/components/atoms/Icon";
import { Flex, Typography } from "antd";
import Image from "next/image";

import countries from '@/public/countries.json';

const country = countries.filter((entry) => entry?.countryCode === "KE")[0]

const MedicalInstitutionCredentialCard = (props: any) => {
    const { showDrawer } = props
    return (
        <Flex className="h-[200px]">
            <Flex onClick={() => showDrawer()} className="absolute hover:opacity-70 rounded-md transition-all cursor-pointer">
                <Image alt="Card5" src={Card5} width={300} height={300} />
                <Flex className="absolute right-4 top-24 flex-col">
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>James Does</Typography.Text>
                    <Typography.Text style={{ fontSize: 12, textAlign: "right" }}>{`${country?.countryName} ${country?.flag}`}</Typography.Text>
                    <Typography.Text style={{ fontSize: 10, marginTop: 10, textAlign: "right" }}>Expires in 30 days</Typography.Text>
                </Flex>
            </Flex>
        </Flex>
    );
};

export default MedicalInstitutionCredentialCard;

