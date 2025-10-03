import Header from "@/components/Header";
import HydrateUser from "@/components/HydrateUser";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/sign-in");

  const user = {
    id: session?.user.id,
    name: session?.user.name,
    email: session?.user.email,
  };
  return (
    <main className="min-h-screen text-gray-400">
      <HydrateUser session={session} />
      <Header user={user} />
      <div className="container py-10">{children}</div>
    </main>
  );
}
