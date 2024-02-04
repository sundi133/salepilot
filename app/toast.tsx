import { cookies } from 'next/headers';
import DismissButton from './dismiss-button';

export default function Toast() {
  const cookieStore = cookies();
  const isHidden = cookieStore.get('template-banner-hidden');
  return null;
}
