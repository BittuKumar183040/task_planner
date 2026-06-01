import { useState } from "react";
import { Copy, Check, RefreshCw } from "lucide-react";
import { api } from "~/utils/api";
import { useRouter } from "next/navigation";
import Dialog from "../layout/Dialog";
import Input, { DialogConfirmButton, Textarea } from "../ui/Input";
import CodeInput from "../ui/CodeInput";

const generateTeamCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

const CreateTeam = ({ onClose, closeable=false, className }: { onClose: () => void, closeable?: boolean , className?: string }) => {
  const utils = api.useUtils();
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [teamCode, setTeamCode] = useState(generateTeamCode());
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const createTeam = api.team.createTeam.useMutation({
    onSuccess: async (data) => {
      await utils.team.invalidate();
      console.log(data)
      localStorage.setItem("c_team", JSON.stringify(data));
      router.push("/dashboard");
      onClose();
    },
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    createTeam.mutate({ name, description, teamCode });
  };

  const handleCopy = () => {
    void navigator.clipboard.writeText(teamCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog title="Create Team" onClose={onClose} className={className} closeable={closeable}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            ⚠ {error}
          </div>
        )}

        <Input label="Team Name" value={name} onChange={setName} placeholder="e.g. Frontend" required />
        <Textarea label="Description" value={description} onChange={setDescription} placeholder="What does this team work on?" />

        <div className="flex flex-col gap-2">
          <label className="block font-medium">
            Team Code
            <span className="ml-2 opacity-50">Share this to invite members</span>
          </label>
          <div className="mb-2 flex items-center justify-between">
            <CodeInput value={teamCode} onChange={setTeamCode} />
            <div className="flex-1 flex justify-end gap-4">
              <button
                type="button"
                onClick={handleCopy}
                className="flex gap-2 items-center transition-colors text-gray-500 hover:text-gray-800"
              >
                {copied ? <Check size={15} className="text-green-500" /> : <Copy size={15} />}
                {copied ? "Copied!" : "Copy"}
              </button>
              <button
                type="button"
                onClick={() => setTeamCode(generateTeamCode())}
                className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-800 transition-colors"
              >
                <RefreshCw size={11} /> Regenerate
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-1">
          <DialogConfirmButton
            type="submit"
            disabled={createTeam.isPending}
            label={createTeam.isPending ? "Creating…" : "Create Team"}
          />
        </div>
      </form>
    </Dialog>
  );
};

export default CreateTeam;