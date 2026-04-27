import { redirect } from 'next/navigation';

// 旧 URL /monitor は /feedback へ転送（ブックマーク・外部リンク互換）
export default function MonitorRedirectPage() {
  redirect('/feedback');
}
