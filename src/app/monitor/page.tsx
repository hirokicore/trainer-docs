import { redirect } from 'next/navigation';

// /monitor は /monitors へ転送
export default function MonitorRedirectPage() {
  redirect('/monitors');
}
