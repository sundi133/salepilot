import Link from 'next/link';
import '../app/css/globals.css';

interface Breadcrumb {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  breadcrumbs: Breadcrumb[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <div
      className="container mx-auto p-0 flex items-center justify-center text-sm"
      style={{ marginTop: '16px' }}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={breadcrumb.href}>
          {index > 0 && <span className="mx-2 text-gray-400">{' > '}</span>}
          <Link href={breadcrumb.href}>
            <span className="text-gray-500 hover:underline">
              {breadcrumb.label}&nbsp;
            </span>
          </Link>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumbs;
