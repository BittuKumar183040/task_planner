import React, { useEffect, useState } from "react";
import AppLayout from "~/components/layout/AppLayout";
import TeamStats from "~/components/team/TeamStats";
import UserTable from "~/components/user/UserTable";
import { getCurrentTeamId } from "~/helper/localstorageHelper";
import { api } from "~/utils/api";

const Users = () => {
  const [teamId, setTeamId] = useState("");

  useEffect(() => {
    setTeamId(getCurrentTeamId());
  }, []);

  const { data: users } = api.user.getUsersByTeam.useQuery(
    { teamId },
    {
      enabled: !!teamId,
    },
  );
  console.log(users)
  return (
    <AppLayout>
      <TeamStats users={users ?? []} />
      <div className=" flex-1 overflow-auto flex flex-col gap-4">
        <UserTable users={users ?? []} />
      </div>
    </AppLayout>
  );
};


export default Users;