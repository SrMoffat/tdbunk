import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Flex, Typography } from 'antd';

interface CreateCredentialProps {}

const CreateCredential: React.FC<CreateCredentialProps> = () => {
    return (
        <Flex className="h-full flex-col">
            <Typography.Text className="font-bold mb-4">Create Credential</Typography.Text>
            <CredentialsForm />
        </Flex>
    );
};

export default CreateCredential;
