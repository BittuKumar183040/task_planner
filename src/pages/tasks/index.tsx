import React from "react";
import Header from "~/components/layout/Header";
import Sidebar from "~/components/layout/Sidebar";
import TaskBoard from "~/components/layout/TaskBoard";

const Dashboard = () => {
  return <div className="flex flex-col">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <section>
        <TaskBoard />
      </section>
    </div>
  </div>;
};


export default Dashboard;