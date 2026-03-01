import LandingPage from "@/components/LandingPage";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Logged-in users go straight to their dashboard — same as before
  if (session) {
    const role = session.user.role;
    if (role === 'buyer')  redirect('/buyer');
    if (role === 'seller') redirect('/seller');
    if (role === 'admin')  redirect('/admin');
    redirect('/login');
  }

  // Not logged in → show the landing page
  return <LandingPage />;
}