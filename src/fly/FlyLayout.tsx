import React from "react";
import { Outlet } from "react-router-dom";
import Layout from "@fly/components/Layout";

/**
 * Flight control module layout: flyreact Layout + nested route content.
 * Mounted at /fly with nested routes (e.g. /fly, /fly/routes, /fly/workflows, /fly/modeling).
 */
const FlyLayout: React.FC = () => {
  return (
    <div className="bg-[#05080f] min-h-screen flex justify-center overflow-x-hidden">
      <div className="w-full max-w-[1920px] min-h-screen bg-background relative shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col">
        <Layout>
          <Outlet />
        </Layout>
      </div>
    </div>
  );
};

export default FlyLayout;
