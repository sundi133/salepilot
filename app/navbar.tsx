'use client';

import { Fragment } from 'react';
import { usePathname } from 'next/navigation';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import { OrganizationSwitcher, useAuth } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';
import Footer from '../components/footer';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton
} from '@clerk/nextjs';

const navigation = [
  { name: 'Contacts', href: '/', path: ['/add/contact', '/contacts'] },
  {
    name: 'Templates',
    href: '/templates',
    path: ['/add/template', '/templates']
  },
  {
    name: 'Campaigns',
    href: '/campaigns',
    path: ['/add/campaign', '/campaigns']
  },
  { name: 'Analytics', href: '/analytics', path: ['/analytics'] },
  {
    name: 'Settings',
    href: '/settings',
    path: [
      '/settings',
      '/create-organization',
      '/organization-profile',
      '/organization-switcher',
      '/openai-key'
    ]
  }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const pathname = usePathname();
  const { isLoaded, userId, sessionId, getToken } = useAuth();

  if (!isLoaded || !userId) {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-gray-50 shadow-sm">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="flex flex-shrink-0">
                  <svg
                    width="64px"
                    height="64px"
                    viewBox="-6 -6 36.00 36.00"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    stroke="#000000"
                    strokeWidth="0.00024000000000000003"
                    transform="matrix(1, 0, 0, 1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      stroke="#CCCCCC"
                      strokeWidth="0.048"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      {' '}
                      <g id="style=stroke">
                        {' '}
                        <g id="email">
                          {' '}
                          <path
                            id="vector (Stroke)"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M3.88534 5.2371C3.20538 5.86848 2.75 6.89295 2.75 8.5V15.5C2.75 17.107 3.20538 18.1315 3.88534 18.7629C4.57535 19.4036 5.61497 19.75 7 19.75H17C18.385 19.75 19.4246 19.4036 20.1147 18.7629C20.7946 18.1315 21.25 17.107 21.25 15.5V8.5C21.25 6.89295 20.7946 5.86848 20.1147 5.2371C19.4246 4.59637 18.385 4.25 17 4.25H7C5.61497 4.25 4.57535 4.59637 3.88534 5.2371ZM2.86466 4.1379C3.92465 3.15363 5.38503 2.75 7 2.75H17C18.615 2.75 20.0754 3.15363 21.1353 4.1379C22.2054 5.13152 22.75 6.60705 22.75 8.5V15.5C22.75 17.393 22.2054 18.8685 21.1353 19.8621C20.0754 20.8464 18.615 21.25 17 21.25H7C5.38503 21.25 3.92465 20.8464 2.86466 19.8621C1.79462 18.8685 1.25 17.393 1.25 15.5V8.5C1.25 6.60705 1.79462 5.13152 2.86466 4.1379Z"
                            fill="#000000"
                          ></path>{' '}
                          <path
                            id="vector (Stroke)_2"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M19.3633 7.31026C19.6166 7.63802 19.5562 8.10904 19.2285 8.3623L13.6814 12.6486C12.691 13.4138 11.3089 13.4138 10.3185 12.6486L4.77144 8.3623C4.44367 8.10904 4.38328 7.63802 4.63655 7.31026C4.88982 6.98249 5.36083 6.9221 5.6886 7.17537L11.2356 11.4616C11.6858 11.8095 12.3141 11.8095 12.7642 11.4616L18.3113 7.17537C18.6391 6.9221 19.1101 6.98249 19.3633 7.31026Z"
                            fill="#000000"
                          ></path>{' '}
                        </g>{' '}
                      </g>{' '}
                    </g>
                  </svg>
                </div>
                <div className="hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8">
                  {userId ? (
                    navigation.map((item: any) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          item.path.some(
                            (path: string) => pathname?.startsWith(path)
                          ) || pathname === item.href
                            ? 'border-slate-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                          'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium'
                        )}
                        aria-current={
                          item.path.some(
                            (path: string) => pathname?.startsWith(path)
                          ) || pathname === item.href
                            ? 'page'
                            : undefined
                        }
                      >
                        {item.name}
                      </a>
                    ))
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="flex rounded-full bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                      <span className="sr-only">Open user menu</span>

                      <span className="text-xs text-gray-700 whitespace-nowrap"></span>
                      <div className="h-8 w-8 rounded-full text-white text-center flex items-center justify-center">
                        <SignedIn>
                          {/* <span className="mr-2 mt-2">
                            <OrganizationSwitcher afterSelectOrganizationUrl="/" />
                          </span> */}
                          <UserButton afterSignOutUrl="/sign-in" />
                        </SignedIn>
                        <SignedOut>
                          {/* Signed out users get sign in button */}
                          <SignInButton />
                        </SignedOut>
                      </div>
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {userId ? (
                        <Menu.Item></Menu.Item>
                      ) : (
                        <Menu.Item></Menu.Item>
                      )}
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {userId ? (
                navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.path.some(
                        (path: string) => pathname?.startsWith(path)
                      ) || pathname === item.href
                        ? 'bg-slate-50 border-slate-500 text-slate-700'
                        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800',
                      'block pl-3 pr-4 py-2 border-l-4 text-base font-medium'
                    )}
                    aria-current={
                      item.path.some(
                        (path: string) => pathname?.startsWith(path)
                      ) || pathname === item.href
                        ? 'page'
                        : undefined
                    }
                  >
                    {item.name}
                  </Disclosure.Button>
                ))
              ) : (
                <div></div>
              )}
            </div>
            <div className="border-t border-gray-200 pt-4 pb-3">
              {userId ? (
                <>
                  <div className="flex items-center px-4">
                    <div className="flex-shrink-0">
                      <div className="h-8 w-8 rounded-full text-white text-center flex items-center justify-center">
                        <SignedIn>
                          {/* <span className="mr-2 mt-2">
                            <OrganizationSwitcher />
                          </span> */}
                          <UserButton afterSignOutUrl="/sign-in" />
                        </SignedIn>
                        <SignedOut>
                          {/* Signed out users get sign in button */}
                          <SignInButton />
                        </SignedOut>
                      </div>
                    </div>
                    <div className="ml-3"></div>
                  </div>
                  <div className="mt-3 space-y-1"></div>
                </>
              ) : (
                <div className="mt-3 space-y-1">
                  <button
                    onClick={() => signIn('github')}
                    className="flex w-full px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                  >
                    <SignInButton />
                  </button>
                </div>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
