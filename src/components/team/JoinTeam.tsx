import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/utils/api";
import Dialog from "../layout/Dialog";
import CodeInput from "../ui/CodeInput";
import { DialogConfirmButton } from "../ui/Input";

const JoinTeam = ({ onClose, closeable = true, className }: { onClose: () => void, closeable?: boolean, className?: string }) => {
  const router = useRouter();
  const utils = api.useUtils();
  const [teamCode, setTeamCode] = useState("");
  const [error, setError] = useState("");

  const joinTeam = api.team.joinTeam.useMutation({
    onSuccess: async (data) => {
      await utils.team.invalidate();
      localStorage.setItem("c_team", JSON.stringify(data));
      router.push("/dashboard");
      onClose();
    },
    onError: (err) => setError(err.message),
  });

  return (
    <Dialog title="Join Team" onClose={onClose} className={className} closeable={closeable}>
      <div className="space-y-4">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠ {error}
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-medium">
            Team Code
            <span className="ml-2 opacity-50">Enter the 6-digit code shared by your team</span>
          </label>
          <CodeInput value={teamCode} onChange={setTeamCode} disabled={false} />
        </div>

        <div className="flex justify-end">
          <DialogConfirmButton
            label={joinTeam.isPending ? "Joining…" : "Join Team"}
            disabled={joinTeam.isPending || teamCode.trim().length < 6}
            onClick={() => joinTeam.mutate({ teamCode: teamCode.trim() })}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default JoinTeam;