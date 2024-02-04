import { CreateOrganization } from '@clerk/nextjs';
import Breadcrumbs from '../../../components/breadcrumbs';
import { neobrutalism } from '@clerk/themes';

export default function CreateOrganizationPage() {
  const breadcrumbs = [
    { label: 'Settings', href: '/settings' },
    { label: 'Create Organization', href: '/create-organization' }
  ];
  return (
    <div>
      <span className="container flex justify-center items-center text-md font-bold text-gray-900 mt-4">
        Please create a organization to proceed
      </span>
      <div className="container flex justify-center items-center mt-16">
        <CreateOrganization
          appearance={{
            baseTheme: neobrutalism
          }}
        />
      </div>
    </div>
  );
}
