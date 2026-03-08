import React from "react";

interface ExpiryBarProps {
  expiryDate?: string;
  issueDate?: string;
}

const ExpiryBar: React.FC<ExpiryBarProps> = ({
  expiryDate = "2025-12-31",
  issueDate = "2023-01-01",
}) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const issue = new Date(issueDate);

  const totalDays = Math.max(
    1,
    Math.ceil((expiry.getTime() - issue.getTime()) / (1000 * 60 * 60 * 24))
  );
  const remainingDays = Math.ceil(
    (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  const progress = Math.max(0, Math.min(100, (remainingDays / totalDays) * 100));

  const isExpired = remainingDays <= 0;
  const isExpiring = remainingDays > 0 && remainingDays <= 30;

  let barColor = "rgba(82, 196, 26, 1)";
  if (isExpired) barColor = "rgba(255, 77, 79, 1)";
  else if (isExpiring) barColor = "rgba(250, 173, 20, 1)";

  const displayText = isExpired ? "已过期" : `剩余 ${remainingDays} 天`;

  return (
    <div data-cmp="ExpiryBar" style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 120 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            fontSize: 12,
            color: isExpired ? "rgba(255, 77, 79, 1)" : isExpiring ? "rgba(250, 173, 20, 1)" : "rgba(180, 188, 204, 1)",
          }}
        >
          {displayText}
        </span>
      </div>
      <div style={{ width: "100%", height: 6, borderRadius: 999, overflow: "hidden", background: "rgba(40, 48, 66, 1)" }}>
        <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: barColor, transition: "width 0.3s" }} />
      </div>
      <span style={{ fontSize: 12, color: "rgba(120, 130, 150, 1)" }}>{expiryDate}</span>
    </div>
  );
};

export default ExpiryBar;
