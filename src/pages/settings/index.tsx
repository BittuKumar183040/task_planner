import { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import { api } from "~/utils/api";

const Settings = () => {
  const { data: user } = api.user.getSelf.useQuery();

  const utils = api.useUtils();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");
  const [password, setPassword] = useState("");

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
      alert("Profile updated successfully");
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

  return (
    <AppLayout>
      <div className="mx-auto w-full">
        <h1 className="mb-6 text-sm font-bold">Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white">

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
            <div className="text-xs text-gray-500">
              {updateImage.isPending
                ? "Saving avatar..."
                : ""}
            </div>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              onBlur={async () => {
                if (
                  image.trim() &&
                  image !== user?.image &&
                  !updateImage.isPending
                ) {
                  await updateImage.mutateAsync({
                    image,
                  });
                }
              }}
              className="w-54 rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-md border px-3 py-2"
            />
          </div>


          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              New Password
            </label>
            <div className=" flex flex-wrap max-w-xs gap-2 text-xs text-gray-500">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Leave empty to keep current password"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Leave empty to keep current password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={updateUser.isPending}
            className="rounded-md bg-black px-4 py-2 text-white hover:bg-black/80"
          >
            {updateUser.isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </AppLayout>
  );
};

export default Settings;