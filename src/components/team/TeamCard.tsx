import { ArrowLeftRight, Check, Copy, Trash2, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useRouter } from "next/router";
import CodeInput from "../ui/CodeInput";

type Team = RouterOutputs["team"]["getUserTeams"][number];

type TeamCardProps = {
  team: Team;
  isActive: boolean;
  onSwitch: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const getInitials = (name: string) => name?.split(/[_ ]+/).map((w) => w[0]).join("").toUpperCase().slice(0, 2);

const TeamCard = ({ team, isActive, onSwitch }: TeamCardProps) => {
  const isAdmin = "teamCode" in team.team && team.team.teamCode !== null;
  const menuRef = useRef<HTMLDivElement>(null);
  const utils = api.useUtils();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const deleteTeam = api.team.deleteTeam.useMutation({
    onSuccess: async (updatedTeams) => {
      utils.team.getUserTeams.setData(undefined, updatedTeams);

      const stored = localStorage.getItem("c_team");
      if (stored) {
        const parsed = JSON.parse(stored) as Team;
        if (parsed.teamId === team.teamId) {
          const first = updatedTeams[0];
          if (first) {
            localStorage.setItem("c_team", JSON.stringify(first));
          } else {
            localStorage.removeItem("c_team");
          }
          await router.push("/dashboard");
        }
      }
    }
  });


  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    deleteTeam.mutate({ teamId: team.teamId });
  };

  useEffect(() => {
    if (!showMenu) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);
  console.log(team)

  const options = [
    {
      label: "Switch",
      value: "switch",
      icon: <ArrowLeftRight size={13} />,
      onClick: onSwitch,
      className: "bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200",
    },
    ...(isAdmin ? [{
      label: "Delete",
      value: "delete",
      icon: <Trash2 size={13} />,
      onClick: handleDelete,
      className: "bg-red-50 text-red-600 hover:bg-red-100 border-red-200",
    }] : []),
  ];

  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (team.team.teamCode) {
      void navigator.clipboard.writeText(team.team.teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  return (
    <div
      ref={menuRef}
      onClick={() => setShowMenu(true)}
      className={`relative bg-white hover:border-red-400 min-w-56 select-none border rounded-xl p-3.5 flex gap-2 cursor-pointer transition-colors
        ${isActive
          ? "border-gray-400 ring-2 ring-gray-100"
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
      {showMenu &&
        <div className=" absolute h-fit w-full bg-white/10 backdrop-blur-sm shadow-lg p-2 -top-2 left-0 -translate-y-full border rounded-xl flex flex-col gap-2 cursor-pointer transition-colors">
          {team.team.teamCode && <div className=" flex flex-col">
            <div className=" flex items-center gap-1.5 mb-1">
              <label className={`flex-1 block text-xs font-medium text-gray-500 mb-1.5 text-center`}>Team Code</label>
              {copied
                ? <Check size={12} className="inline-block mr-1 mb-1 text-green-500" />
                : <Copy onClick={handleCopyCode} size={12} className="inline-block mr-1 mb-1 cursor-pointer hover:text-gray-800 transition-colors" />
              }
            </div>
            <CodeInput classname=" gap-0 justify-between" inputClassname="size-6 text-sm" value={team.team.teamCode} disabled={true} onChange={() => { "" }} />
          </div>
          }
          <div className="flex flex-wrap justify-between gap-2">
            {options.map((option) => (<>
              <button
                key={option.value}
                onClick={option.onClick}
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${option.className}`}
              >
                {option.icon}
                {option.label}
              </button>
            </>
            ))}
          </div>
        </div>
      }
    </div>
  );
};

export default TeamCard;