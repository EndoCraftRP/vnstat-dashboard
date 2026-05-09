import React from "react";
import Header from "./Header";

const Dashboard = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="w-full max-w-7xl mx-auto p-4 flex flex-col gap-6">
        <Header />
        <main className="flex flex-col gap-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

interface Props {
  children: React.ReactNode;
}
