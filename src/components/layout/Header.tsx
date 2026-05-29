/* eslint-disable @next/next/no-img-element */
import { signOut, useSession } from "next-auth/react";
import React from 'react'
import { Button } from "../ui/Button";

const Header = () => {
  const { data: sessionData } = useSession();
  return (
    <div className=" flex justify-between bg-gray-800 text-white p-4 py-2">
      <div className="flex items-center">
        <div className="h-8 w-8 rounded bg-emerald-500" />
          <span className="ml-3 font-semibold">
            Task Planner
          </span>
      </div>
      {sessionData && (
        <div className="flex items-center gap-4">
          <div className=" border border-gray-400 bg-white/20 h-6 w-6 rounded-full object-cover overflow-hidden">
            <img
              src={`https://api.dicebear.com/10.x/micah/svg?seed=${sessionData.user?.image}`}
              alt="User Avatar"
            />
          </div>
          <p>{sessionData.user?.name}</p>
          <Button label="Sign out" onClick={() => signOut({
            callbackUrl: "/signin",
          })} />
        </div>  
      )}
    </div>
  )
}

export default Header