import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Check } from "lucide-react";

/**
 * 绑定码分享页：手机扫描二维码后打开此页，展示绑定信息并支持复制给第三方使用
 * 路由：/share/bind?code=xxx&sn=xxx&unit=xxx&name=xxx
 */
const ShareBindPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code") ?? "";
  const sn = searchParams.get("sn") ?? "";
  const unit = searchParams.get("unit") ?? "";
  const name = searchParams.get("name") ?? "";
  const orgId = searchParams.get("orgId") ?? "";
  const mqttUrl = searchParams.get("mqttUrl") ?? "";
  const mqttUser = searchParams.get("mqttUser") ?? "";
  const mqttPwd = searchParams.get("mqttPwd") ?? "";

  const [copied, setCopied] = useState(false);

  const textBlock = [
    code && `绑定码：${code}`,
    name && `设备名称：${name}`,
    sn && `设备SN：${sn}`,
    unit && `部门：${unit}`,
    orgId && `组织ID：${orgId}`,
    mqttUrl && `MQTT网址：${mqttUrl}`,
    mqttUser && `MQTT用户名：${mqttUser}`,
    mqttPwd && `MQTT密码：${mqttPwd}`,
  ]
    .filter(Boolean)
    .join("\n");

  const handleCopy = async () => {
    if (!textBlock) return;
    try {
      await navigator.clipboard.writeText(textBlock);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    document.title = "绑定信息 - 设备绑定";
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
        color: "#e2e8f0",
        padding: "24px 16px",
        fontFamily: "'Microsoft YaHei', sans-serif",
      }}
    >
      <div style={{ maxWidth: 400, margin: "0 auto" }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, textAlign: "center" }}>
          设备绑定信息
        </h1>
        <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16, textAlign: "center" }}>
          手机扫码后展示的绑定信息，可复制给第三方使用
        </p>
        <div
          style={{
            background: "rgba(30, 41, 59, 0.8)",
            border: "1px solid rgba(51, 65, 85, 1)",
            borderRadius: 8,
            padding: 16,
            marginBottom: 16,
          }}
        >
          {code ? (
            <>
              <div style={{ marginBottom: 12 }}>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>绑定码</span>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#38bdf8", fontFamily: "monospace", marginTop: 4 }}>
                  {code}
                </div>
              </div>
              {name && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>设备名称</span>
                  <div style={{ fontSize: 14, marginTop: 2 }}>{name}</div>
                </div>
              )}
              {sn && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>设备SN</span>
                  <div style={{ fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{sn}</div>
                </div>
              )}
              {unit && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>部门</span>
                  <div style={{ fontSize: 14, marginTop: 2 }}>{unit}</div>
                </div>
              )}
              {orgId && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>组织ID</span>
                  <div style={{ fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{orgId}</div>
                </div>
              )}
              {mqttUrl && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>MQTT网址</span>
                  <div style={{ fontSize: 12, wordBreak: "break-all", marginTop: 2 }}>{mqttUrl}</div>
                </div>
              )}
              {mqttUser && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>MQTT用户名</span>
                  <div style={{ fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{mqttUser}</div>
                </div>
              )}
              {mqttPwd && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>MQTT密码</span>
                  <div style={{ fontSize: 13, fontFamily: "monospace", marginTop: 2 }}>{mqttPwd}</div>
                </div>
              )}
            </>
          ) : (
            <div style={{ fontSize: 14, color: "#94a3b8", textAlign: "center" }}>
              未携带绑定参数，请重新扫描二维码
            </div>
          )}
        </div>
        {textBlock && (
          <button
            type="button"
            onClick={handleCopy}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "12px 16px",
              background: copied ? "rgba(34, 197, 94, 0.2)" : "rgba(56, 189, 248, 0.2)",
              border: `1px solid ${copied ? "rgba(34, 197, 94, 0.5)" : "rgba(56, 189, 248, 0.5)"}`,
              borderRadius: 8,
              color: copied ? "#22c55e" : "#38bdf8",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {copied ? <Check size={18} /> : <Copy size={18} />}
            {copied ? "已复制" : "复制绑定信息给第三方"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShareBindPage;
