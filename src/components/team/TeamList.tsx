import { Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { api, type RouterOutputs } from '~/utils/api';
import TeamCard from './TeamCard';

type Team = RouterOutputs["team"]["getUserTeams"][number];

const TeamList = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  const [activeTeamId, setActiveTeamId] = useState<string | null>(null);

  const { data: teams } = api.team.getUserTeams.useQuery(undefined, {
    enabled: !!sessionData?.user,
  });

  useEffect(() => {
    const stored = localStorage.getItem("c_team");
    if (stored) {
      const parsed = JSON.parse(stored) as Team;
      setActiveTeamId(parsed.teamId + "_" + parsed.userId);
    } else {
      console.log(teams)
    }
  }, []);

  const handleTeamClick = async (e: React.MouseEvent<HTMLButtonElement>, team: Team) => {
    e.preventDefault();
    localStorage.setItem("c_team", JSON.stringify(team));
    setActiveTeamId(team.teamId + "_" + team.userId);
    await router.push("/dashboard");
  };

  return (
    <div className="py-4 flex flex-col w-full gap-4">
      {teams && teams.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
              <Users size={16} />
              Your teams
            </div>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
              {teams.length} {teams.length === 1 ? "team" : "teams"}
            </span>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2.5">
            {teams.map((team: Team) => (
              <TeamCard
                key={team.teamId + "_" + team.userId}
                team={team}
                isActive={activeTeamId === team.teamId + "_" + team.userId}
                onSwitch={(e) => handleTeamClick(e, team)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center gap-2 p-8 border border-dashed border-gray-200 rounded-xl text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
            <Users size={18} />
          </div>
          <p className="text-sm font-medium text-gray-600">No teams yet</p>
          <p className="text-xs text-gray-400">You are not part of any teams yet.</p>
        </div>
      )}
    </div>
  );
};

export default TeamList;