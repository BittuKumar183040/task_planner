import type { Session } from "next-auth";
import { api } from "~/utils/api";
import React from 'react'
import Link from "next/link";
import { AuthShowcase } from "~/pages";
import { DialogConfirmButton } from "~/components/ui/Input";
import BrandLogo from "~/components/ui/BrandLogo";

const Main = ({ session }: { session: Session | null }) => {

  const { data: user } = api.user.getSelf.useQuery(undefined, {
    enabled: !!session?.user,
  });

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="flex items-center justify-between border-b px-12 py-1">
        <BrandLogo />
        <div className="flex items-center gap-8">
          <AuthShowcase sessionData={session} />
        </div>
      </nav>

      <div className="flex flex-col justify-center items-center border-r px-12 py-20 ">
        <div className="mb-8 flex items-center gap-2 text-xs font-medium uppercase text-gray-400">
          <span className="h-1.5 w-1.5 rounded-full bg-gray-800 animate-pulse" />
          Team collaboration, reimagined
        </div>

        <h1 className="mb-6 text-center font-black leading-none text-6xl ">
          Tasks that <span className="text-black/70"> move teams<br />forward.</span>
        </h1>

        <p className="mb-12 max-w-md text-base leading-relaxed text-gray-600">
          Team Tasky brings clarity to how your team works. Assign, track, and ship tasks together — no noise, no friction.
        </p>

        <div className="flex items-center gap-3">
          <Link href="/signup" >
            <DialogConfirmButton label="Create Account" onClick={() => { "" }} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;