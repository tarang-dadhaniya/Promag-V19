import React from "react";
import { PublisherTable } from "@/components/PublisherTable";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

export default function ManageApps() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeMenuItem="apps" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Manage Apps" />
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-full mx-auto">
            <PublisherTable />
          </div>
        </main>
      </div>
    </div>
  );
}
