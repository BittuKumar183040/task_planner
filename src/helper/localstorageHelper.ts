import { type RouterOutputs } from "~/utils/api";

type Team = RouterOutputs["team"]["getUserTeams"][number];

export const getCurrentTeamId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  const stored = localStorage.getItem("c_team");

  if (stored) {
    const parsed = JSON.parse(stored) as Team;
    return parsed.teamId;
  }

  return "";
};