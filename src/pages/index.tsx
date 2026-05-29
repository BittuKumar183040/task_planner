import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Head from "next/head";

import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const { data: sessionData } = useSession();

  const { data: user } = api.user.getSelf.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

  return (
    <>
      <Head>
        <title>Task Planner</title>
        <meta name="description" content="Task Planner App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl text-center font-extrabold tracking-tight text-white sm:text-[5rem]">
            Welcome to{" "} <span className="text-[hsl(280,100%,70%)]"> Task Planner </span>
          </h1>

          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {user ? `Welcome, ${user.name}!` : ""}
            </p>
            {user && (
              <Link href="/boards" className="text-lg text-blue-400 hover:underline">
                Go to Boards
              </Link>
            )}
            <AuthShowcase sessionData={sessionData} />
          </div>
        </div>
      </main>
    </>
  );
}

type AuthShowcaseProps = {
  sessionData: Session | null;
};

const AuthShowcase = ({ sessionData }: AuthShowcaseProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white transition hover:bg-white/20"
        onClick={() => sessionData ? void signOut() : void router.push("/signin")}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
