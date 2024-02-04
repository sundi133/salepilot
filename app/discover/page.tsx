import { OrganizationList } from '@clerk/nextjs';

export default function OrganizationListPage() {
  return (
    <div className="container flex justify-center items-center mt-16">
      <OrganizationList
        afterCreateOrganizationUrl="/organization/:slug"
        afterSelectPersonalUrl="/user/:id"
        afterSelectOrganizationUrl="/organization/:slug"
      />
    </div>
  );
}
