import { OrganizationSwitcher } from '@clerk/nextjs';
import { neobrutalism } from '@clerk/themes';

export default function OrganizationSwitcherPage() {
  return (
    <div className="container flex justify-center items-center ml-16 mt-16">
      <span className="text-md font-bold text-gray-900">
        Switch Organization &nbsp;
      </span>
      <OrganizationSwitcher
        appearance={{
          baseTheme: neobrutalism
        }}
      />
    </div>
  );
}
