import { SignUp } from '@clerk/nextjs';
import Footer from '../../../components/footer';

export default function Page() {
  return (
    <div className="container flex justify-center items-center mt-16">
      <SignUp />
    </div>
  );
}
