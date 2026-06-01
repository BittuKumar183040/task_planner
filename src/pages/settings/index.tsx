/* eslint-disable @next/next/no-img-element */
import { Loader2, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import CreateTeam from "~/components/team/CreateTeam";
import JoinTeam from "~/components/team/JoinTeam";
import TeamList from "~/components/team/TeamList";
import { SubmitButton } from "~/components/ui/Button";
import Input from "~/components/ui/Input";
import { api } from "~/utils/api";

export type Dialogs = "createTeam" | "joinTeam"

const Settings = () => {
  const { data: user } = api.user.getSelf.useQuery();

  const utils = api.useUtils();
  const [isOpen, setIsOpen] = useState<Dialogs | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("***********");

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setImage(user.image ?? "");
    }
  }, [user]);

  const updateImage = api.user.updateImage.useMutation({
    onSuccess: async () => {
      await utils.user.getSelf.invalidate();
    },
  });

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.getSelf.invalidate();
    },
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    await updateUser.mutateAsync({
      name,
      email,
      image,
      password: password || undefined,
    });

    setPassword("");
  };

  const onClose = () => {
    setIsOpen(null)
  }

  return (
    <>
      <AppLayout>
        <h1 className="text-sm font-bold">Settings</h1>
        <div className=" h-px w-full bg-black/10 my-3" />
        <form onSubmit={handleSubmit} className=" overflow-y-auto space-y-4 rounded-lg bg-white">
          <div className="flex flex-col items-center gap-2">
            {image && image.length > 0 ?
              <img
                src={`https://api.dicebear.com/10.x/micah/svg?seed=${image}`}
                alt={image}
                className="h-40 w-40 rounded-full border-2 border-gray-300 object-cover"
              /> :
              <img
                src={`https://api.dicebear.com/10.x/shape-grid/svg?seed=unahcpm9`}
                alt={"Default Avatar"}
                className="h-40 w-40 rounded-full border-2 border-gray-300 object-cover"
              />
            }
            <div className="relative text-xs text-gray-500 flex items-center gap-2">
              <div className="relative">
                {updateImage.isPending ? <Loader2 size={20} className=" absolute h-full animate-spin right-2 " /> : ""}
                <input type="text" value={image} placeholder={"Enter keyword"} onChange={(e) => setImage(e.target.value)} className="w-54 rounded-md border px-3 py-2"
                  onBlur={async () => {
                    if (
                      image.trim() &&
                      image !== user?.image &&
                      !updateImage.isPending
                    ) {
                      await updateImage.mutateAsync({ image });
                    }
                  }}
                />
              </div>
              <button onClick={() => {
                const value = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
                setImage(value);
                void updateImage.mutateAsync({ image: value });
              }}
                type="button" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Shuffle size={15} />
              </button>
            </div>
            <TeamList />
            <div className=" flex gap-4">
              <SubmitButton type="button" label={"Create Team"} onClick={() => setIsOpen("createTeam")} />
              <SubmitButton className="bg-gray-400 text-black border border-gray-600 hover:bg-gray-500" type="button" label={"Join Team"} onClick={() => setIsOpen("joinTeam")} />
            </div>
          </div>
          <Input label="Name" onChange={setName} value={name} />
          <Input label="Email" onChange={setEmail} value={email} />
          <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="Leave empty to keep current password" />
          <div className=" h-5" />
        </form>
        <div className=" w-44 p-2">
          <SubmitButton type="submit" label={updateUser.isPending ? "Saving..." : "Save Changes"} />
        </div>
      </AppLayout>
      {isOpen === "createTeam" && <CreateTeam onClose={onClose} closeable={true} />}
      {isOpen === "joinTeam" && <JoinTeam onClose={onClose} closeable={true} />}
    </>
  );
};

export default Settings;