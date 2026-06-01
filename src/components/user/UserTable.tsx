/* eslint-disable @next/next/no-img-element */
import { Users, ClipboardCheck, Pencil } from "lucide-react";
import { type RouterOutputs } from "~/utils/api";

type UserType = RouterOutputs["user"]["getUsersByTeam"];

const UserTable = ({ users }: { users: UserType }) => {
  console.log(users)
  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
            <Users size={16} /> Team members
          </div>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr>
                {["User", "Email", "Assigned", "Created", "role"].map((header) => (
                  <th key={header} className="px-4 py-2.5 text-left text-[11px] font-medium uppercase tracking-wide text-gray-400 border-b border-gray-100">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="group hover:bg-gray-50">
                  <td className="px-4 py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-[11px] font-medium text-violet-600">
                        <img src={`https://api.dicebear.com/10.x/micah/svg?seed=${user.image}`} alt={''} />
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
                        <p className="text-[11px] text-gray-400">@{user.username}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-gray-500 border-b border-gray-100">{user.email}</td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] font-medium text-teal-700">
                      <ClipboardCheck size={10} /> {user._count.tasksAssigned}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-medium text-orange-700">
                      <Pencil size={10} /> {user._count.tasksCreated}
                    </span>
                  </td>
                  <td className="px-4 py-3 border-b border-gray-100">
                    <span className={`text-xs font-medium capitalize ${user.role === "admin" ? "text-red-700" : "text-black/60"}`}>
                      {user.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="sm:hidden divide-y divide-gray-100">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center justify-between px-4 py-3 transition-colors ${user.role === "admin" ? "bg-gray-50 border-l-2 border-gray-400" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-50 text-sm font-medium text-violet-600">
                  <img src={`https://api.dicebear.com/10.x/micah/svg?seed=${user.image}`} alt={''} />
                </div>
                <div>
                  <p className="text-[13px] font-medium text-gray-900">{user.name}</p>
                  <p className="text-[11px] text-gray-400">{user.email}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-[11px] text-teal-700">
                  <ClipboardCheck size={10} /> {user._count.tasksAssigned}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] text-orange-700">
                  <Pencil size={10} /> {user._count.tasksCreated}
                </span>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <p className="py-8 text-center text-sm text-gray-400">No members found.</p>
        )}
      </div>
    </div>
  );
};

export default UserTable;