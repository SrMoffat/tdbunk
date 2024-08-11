import LandingHeader from '@/app/components/molecules/headers/LandingHeader';
import { Layout } from 'antd';

export default function SponsorPage() {
    return (
        <Layout style={{ height: '100vh' }}>
            <LandingHeader />
            Here
            <div className="border w-full p-12 mt-12 flex">Footer</div>
        </Layout>
    );
}


