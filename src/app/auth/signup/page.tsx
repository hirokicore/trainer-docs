import { Suspense } from 'react';
import AuthForm from '@/components/auth/AuthForm';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: '新規登録 — TrainerDocs',
};

export default function SignupPage() {
  return (
    <Suspense>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
