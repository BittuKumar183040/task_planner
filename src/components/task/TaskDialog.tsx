/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useEffect, useState } from "react";
import { api, type RouterOutputs } from "~/utils/api";
import { useSession } from "next-auth/react";
import Dialog from "../layout/Dialog";
import { getCurrentTeamId } from "~/helper/localstorageHelper";
import Input, { SelectInput, Textarea } from "../ui/Input";
import Tags from "../ui/Tags";
import { TeamInputSearch } from "../team/TeamInputSearch";

type Props = {
  task?: RouterOutputs["task"]["getTasks"][number];
  open: boolean;
  onClose: () => void;
};

const CreateTaskDialog = ({ task, open, onClose }: Props) => {

  const { data: sessionData } = useSession();
  const utils = api.useUtils();

  const [teamId, setTeamId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState<{ id: string; username: string }>({ id: "", username: "" });
  const [status, setStatus] = useState<"new" | "active" | "completed">("new");
  const [date, setDate] = useState<string>("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setTeamId(getCurrentTeamId());
  }, []);

  useEffect(() => {
    setTitle(task?.title ?? "");
    setDescription(task?.description ?? "");
    setStatus((task?.status ?? "new") as typeof status);
    setPriority((task?.priority ?? "medium") as typeof priority);
    setDate(task?.deadline ? new Date(task.deadline).toISOString().slice(0, 10) : "");
    setTags(task?.tags ?? []);
    setAssignedTo({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      id: task?.assignedTo?.id ?? sessionData?.user?.id ?? "",
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      username: task?.assignedTo?.username ?? sessionData?.user?.username ?? "",
    });
  }, [task, sessionData]);

  const createTask = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.getTasks.invalidate();
      setTitle("");
      setTeamId("");
      setDescription("");
      setPriority("medium");
      setStatus("new");
      setDate("");
      setAssignedTo(sessionData?.user ?? { id: sessionData?.user?.id ?? "", username: sessionData?.user?.username ?? "" });
      setTags([]);
      onClose();
    },
  });

  const updateTask = api.task.updateTask.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      onClose();
    },
    onError: (error) => {
      console.error("Failed to update task:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (task) {
      await updateTask.mutateAsync({
        id: task.id,
        title,
        description,
        priority,
        status,
        assignedToId: assignedTo.id,
        deadline: date ? new Date(date) : undefined,
        tags,
      });
    } else {
      await createTask.mutateAsync({
        title,
        teamId,
        description,
        priority,
        status,
        assignedToId: assignedTo.id ?? sessionData?.user?.id,
        deadline: date ? new Date(date) : undefined,
        tags,
      });
    }
  };

  if (!open) return null;

  return (
    <Dialog title={task ?
      <p>Edit Task
        <span className="font-normal ml-2 bg-gray-100 px-2 py-1 rounded shadow-inner">
          #{task.taskId}
        </span>
      </p>
      : "Create Task"}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <Input label="Title" value={title} required onChange={setTitle} placeholder="Enter Task Title" />
        <Textarea label="Description" value={description} onChange={setDescription} />

        <div className="grid grid-cols-2 gap-3">
          <SelectInput
            label="Priority"
            value={priority}
            onChange={(val) => setPriority(val as typeof priority)}
            options={[
              { value: "low", label: "💧   Low" },
              { value: "medium", label: "⚠️   Medium" },
              { value: "high", label: "🚨   High" },
            ]}
          />
          <SelectInput
            label="Status"
            value={status}
            onChange={(val) => setStatus(val as typeof status)}
            options={[
              { value: "new", label: "📰   New" },
              { value: "active", label: "🕐   Active" },
              { value: "completed", label: "✅   Completed" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <TeamInputSearch
            label="Assigned to"
            value={assignedTo.username}
            teamId={teamId}
            onChange={(val) => setAssignedTo({ id: "", username: val })}
            onSelect={(user) => setAssignedTo({ id: user.id, username: user.username })}
            placeholder="Search member..."
          />
          <Input
            label="Deadline"
            value={date}
            type="date"
            onChange={setDate}
            placeholder="Deadline"
          />
        </div>

        <Tags tags={tags} onChange={setTags} />

        <div className="flex justify-end gap-2 pt-1">
          <button type="button" onClick={onClose} className="rounded border px-4 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={createTask.isPending}
            className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {task ? "Update Changes" : createTask.isPending ? "Creating…" : "Create Task"}
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default CreateTaskDialog;