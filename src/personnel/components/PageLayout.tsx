import React from "react";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

interface PageLayoutProps {
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  title = "人员资质管理",
  subtitle = "统计范围：全市所有在册飞手",
  children,
}) => {
  return (
    <div
      data-cmp="PageLayout"
      className="flex min-h-screen w-full grid-bg"
      style={{ background: "rgba(8, 18, 38, 1)" }}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-5">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageLayout;