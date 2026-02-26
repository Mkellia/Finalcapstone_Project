import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const role = session.user.role;
  if (role === 'buyer') redirect('/buyer');
  if (role === 'seller') redirect('/seller');
  if (role === 'admin') redirect('/admin');

  redirect('/login');
}