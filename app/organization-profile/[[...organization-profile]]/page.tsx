import { OrganizationProfile } from '@clerk/nextjs';

export default function OrganizationProfilePage() {
  return (
    <div>
      <div className="container flex justify-center items-center mt-16">
        <OrganizationProfile routing="path" path="/organization-profile" />
      </div>
    </div>
  );
}
