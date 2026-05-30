import { Users } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { api, type RouterOutputs } from '~/utils/api';

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
      setActiveTeamId(parsed.id);
    }
  }, []);

  const getInitials = (name: string) =>
    name?.split(/[_ ]+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  const handleTeamClick = async (e: React.MouseEvent<HTMLButtonElement>, team: Team) => {
    e.preventDefault();
    localStorage.setItem("c_team", JSON.stringify(team));
    setActiveTeamId(team.id);
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
            {teams.map((team: Team) => {
              const isActive = activeTeamId === team.id;
              return (
                <button
                  onClick={(e) => handleTeamClick(e, team)}
                  key={team.id}
                  className={`relative bg-white border rounded-xl p-3.5 flex gap-2 cursor-pointer transition-colors
                    ${isActive
                      ? "border-gray-400 ring-2 ring-violet-100"
                      : "border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {isActive && (
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gray-500" />
                  )}

                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-medium
                    ${isActive ? "bg-gray-100 text-gray-600" : "bg-violet-50 text-gray-600"}`}>
                    {getInitials(team.team.name)}
                  </div>
                  <div>
                    <p className={`text-[13px] font-medium ${isActive ? "text-gray-700" : "text-gray-900"}`}>
                      {team.team.name}
                    </p>
                    <p className="text-[11px] text-gray-400 flex gap-1 mt-2">
                      <Users size={10} />
                      {team.team._count?.members ?? 0} members
                    </p>
                  </div>
                </button>
              );
            })}
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