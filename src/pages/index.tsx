import { signOut, useSession } from "next-auth/react";
import type { Session } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import Main from "~/main";

export default function Home() {
  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>Task Planner</title>
        <meta name="description" content="Task Planner App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main session={sessionData} />
    </>
  );
}

type AuthShowcaseProps = {
  sessionData: Session | null;
};

export const AuthShowcase = ({ sessionData }: AuthShowcaseProps) => {
  const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-black px-10 py-3 font-semibold text-white transition"
        onClick={() => sessionData ? void signOut() : void router.push("/signin")}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
