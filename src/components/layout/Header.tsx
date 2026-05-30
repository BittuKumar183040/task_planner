/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";

import { Button } from "../ui/Button";
import { type RouterOutputs } from "~/utils/api";

type Team = RouterOutputs["team"]["getUserTeams"][number];

const Header = () => {
  const { data: sessionData } = useSession();
  const [team, setTeam] = useState<Team | null>(null);

  useEffect(() => {
    const storedTeam = localStorage.getItem("c_team");

    if (storedTeam) {
      try {
        setTeam(JSON.parse(storedTeam) as Team);
      } catch (error) {
        console.error("Failed to parse team data", error);
      }
    }
  }, []);

  return (
    <div className="flex justify-between bg-gray-800 px-4 py-2 text-white">
      <div className="flex items-center gap-4">
        <div className="h-8 w-8 rounded bg-emerald-500" />
        <span className="font-semibold">
          Task Planner
        </span>
      </div>

      {sessionData && (
        <div className="flex items-center gap-4">

          {team && (
            <div className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1">
              <p className="text-sm font-medium">
                {team.team.name}
              </p>
            </div>
          )}

          <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-400 bg-white/20">
            <img
              src={`https://api.dicebear.com/10.x/micah/svg?seed=${sessionData.user?.image}`}
              alt="User Avatar"
            />
          </div>

          <p>{sessionData.user?.name}</p>

          <Button
            label="Sign out"
            onClick={() =>
              signOut({
                callbackUrl: "/signin",
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default Header;