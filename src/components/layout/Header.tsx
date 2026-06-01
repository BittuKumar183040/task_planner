/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Button } from "../ui/Button";
import { api, type RouterOutputs } from "~/utils/api";
import Dialog from "./Dialog";
import CreateTeam from "../team/CreateTeam";
import JoinTeam from "../team/JoinTeam";
import BrandLogo from "../ui/BrandLogo";

type Team = RouterOutputs["team"]["getUserTeams"][number];

const Header = () => {
  const { data: sessionData } = useSession();
  const [team, setTeam] = useState<Team | null>(null);
  const [resolved, setResolved] = useState(false);

  const { data: teams } = api.team.getUserTeams.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

  useEffect(() => {
    if (!teams) return;

    const storedTeam = localStorage.getItem("c_team");

    if (storedTeam) {
      const parsed = JSON.parse(storedTeam) as Team;
      const stillExists = teams.find((t) => t.teamId === parsed.teamId);

      if (stillExists) {
        setTeam(stillExists);
        setResolved(true);
        return;
      }
    }

    if (teams.length > 0) {
      const first = teams[0]!;
      localStorage.setItem("c_team", JSON.stringify(first));
      setTeam(first);
    } else {
      localStorage.removeItem("c_team");
      setTeam(null);
    }

    setResolved(true);
  }, [teams]);

  const handleSignout = async () => await signOut();

  const onClose = () => {
    const storedTeam = localStorage.getItem("c_team");
    if (storedTeam) setTeam(JSON.parse(storedTeam) as Team);
  };

  return (
    <>
      <div className="flex justify-between bg-gray-800 px-4 py-2 text-white max-h-12">
        <div className="flex items-center gap-4"><BrandLogo />
        </div>

        {sessionData && (
          <div className="flex items-center gap-4">
            {team && (
              <div className="rounded-md border border-gray-600 bg-gray-700 px-3 py-1">
                <p className="text-sm font-medium">{team.team.name}</p>
              </div>
            )}
            <div className="h-6 w-6 overflow-hidden rounded-full border border-gray-400 bg-white/20">
              <img
                src={`https://api.dicebear.com/10.x/micah/svg?seed=${sessionData.user?.image}`}
                alt="User Avatar"
              />
            </div>
            <p>{sessionData.user?.name}</p>
            <Button label="Sign out" onClick={handleSignout} />
          </div>
        )}
      </div>

      {resolved && !team && sessionData && (
        <Dialog title="Team Assignment" onClose={() => ""} className="!p-0" closeable={false}>
          <CreateTeam onClose={onClose} className="relative overflow-hidden bg-transparent !mt-0 !p-0" closeable={false} />
          <div className="w-full flex items-center justify-center border-y">
            <p className="text-xl">OR</p>
          </div>
          <JoinTeam onClose={onClose} className="relative overflow-hidden bg-transparent !mt-0 !p-0 " closeable={false} />
        </Dialog>
      )}
    </>
  );
};

export default Header;