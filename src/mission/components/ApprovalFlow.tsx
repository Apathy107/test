import React from "react";
import { Check, X, Clock, User } from "lucide-react";

export interface FlowStep {
  role: string;
  name: string;
  status: "approved" | "rejected" | "pending" | "waiting";
  time?: string;
  remark?: string;
}

interface ApprovalFlowProps {
  steps?: FlowStep[];
}

const defaultSteps: FlowStep[] = [
  { role: "创建人",     name: "张伟",   status: "approved", time: "09:15", remark: "提交审批" },
  { role: "部门负责人", name: "李局长", status: "approved", time: "09:32", remark: "同意" },
  { role: "分管领导",  name: "王主任", status: "pending",  time: "" },
];

const STATUS_CFG = {
  approved: { color: "rgba(0, 200, 120, 1)",  bg: "rgba(0, 200, 120, 0.15)", icon: Check },
  rejected: { color: "rgba(255, 59, 59, 1)",  bg: "rgba(255, 59, 59, 0.15)", icon: X },
  pending:  { color: "rgba(0, 212, 255, 1)",  bg: "rgba(0, 212, 255, 0.1)",  icon: Clock },
  waiting:  { color: "rgba(100, 130, 180, 1)", bg: "rgba(100, 130, 180, 0.1)", icon: User },
};

const ApprovalFlow: React.FC<ApprovalFlowProps> = ({ steps = defaultSteps }) => {
  return (
    <div
      data-cmp="ApprovalFlow"
      style={{ display: "flex", alignItems: "flex-start", gap: 0 }}
    >
      {steps.map((step, idx) => {
        const cfg = STATUS_CFG[step.status];
        const Icon = cfg.icon;
        return (
          <React.Fragment key={idx}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "100px" }}>
              {/* Circle */}
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  background: cfg.bg,
                  border: `2px solid ${cfg.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon size={16} style={{ color: cfg.color }} />
              </div>
              <div style={{ marginTop: "6px", fontSize: "11px", color: "rgba(100, 150, 200, 1)", textAlign: "center" }}>
                {step.role}
              </div>
              <div style={{ fontSize: "12px", color: "rgba(180, 210, 240, 1)", fontWeight: 500, textAlign: "center" }}>
                {step.name}
              </div>
              {step.time && (
                <div style={{ fontSize: "10px", color: "rgba(80, 120, 180, 1)", textAlign: "center" }}>
                  {step.time}
                </div>
              )}
              {step.remark && (
                <div style={{ fontSize: "10px", color: cfg.color, textAlign: "center" }}>
                  {step.remark}
                </div>
              )}
            </div>
            {/* Connector line */}
            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: "2px",
                  background:
                    steps[idx + 1].status === "waiting"
                      ? "rgba(60, 90, 140, 0.5)"
                      : "rgba(0, 150, 200, 0.5)",
                  marginTop: "17px",
                  minWidth: "24px",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default ApprovalFlow;
