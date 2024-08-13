import CredentialsForm from '@/app/components/molecules/forms/Credentials';
import { Flex } from 'antd';

interface CreateCredentialProps {}

const CreateCredential: React.FC<CreateCredentialProps> = () => {
    return (
        <Flex className="h-full flex-col">
            <CredentialsForm />
        </Flex>
    );
};

export default CreateCredential;
