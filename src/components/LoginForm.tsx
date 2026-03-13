import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, Phone, Lock, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CREDENTIALS } from "../auth/credentials";

const STORAGE_KEY_REMEMBER = "fly_login_remember";
const STORAGE_KEY_USERNAME = "fly_saved_username";
const STORAGE_KEY_PASSWORD = "fly_saved_password";
const DEFAULT_ADMIN = "admin";
const DEFAULT_PASSWORD = CREDENTIALS[DEFAULT_ADMIN] ?? "";

/**
 * LoginForm - Tech-style login form with phone/password fields
 * 默认 admin 账号，记住密码，支持免密自动登录
 */
const LoginForm: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [phoneHover, setPhoneHover] = useState(false);
  const [pwHover, setPwHover] = useState(false);
  const navigate = useNavigate();
  const autoLoginAttempted = useRef(false);

  /** 从本地存储恢复记住的账号密码，无则使用默认 admin */
  useEffect(() => {
    try {
      const savedRemember = localStorage.getItem(STORAGE_KEY_REMEMBER) === "1";
      const savedUsername = localStorage.getItem(STORAGE_KEY_USERNAME);
      const savedPassword = localStorage.getItem(STORAGE_KEY_PASSWORD);
      if (savedRemember && savedUsername != null && savedPassword != null) {
        setPhone(savedUsername);
        setPassword(savedPassword);
        setRememberMe(true);
      } else {
        setPhone(DEFAULT_ADMIN);
        setPassword(DEFAULT_PASSWORD);
        setRememberMe(true);
      }
    } catch {
      setPhone(DEFAULT_ADMIN);
      setPassword(DEFAULT_PASSWORD);
      setRememberMe(true);
    }
  }, []);

  /** 已勾选记住密码且凭证有效时自动登录（免密）；首次默认 admin 也会自动登入 */
  useEffect(() => {
    if (autoLoginAttempted.current || !phone.trim() || !password) return;
    const expectedPwd = CREDENTIALS[phone.trim()];
    if (expectedPwd === undefined || password !== expectedPwd) return;
    if (!rememberMe) return;
    autoLoginAttempted.current = true;
    setIsLoading(true);
    setTimeout(() => {
      if (rememberMe) {
        try {
          localStorage.setItem(STORAGE_KEY_REMEMBER, "1");
          localStorage.setItem(STORAGE_KEY_USERNAME, phone.trim());
          localStorage.setItem(STORAGE_KEY_PASSWORD, password);
        } catch {
          /* ignore */
        }
      }
      setIsLoading(false);
      navigate("/hub");
    }, 600);
  }, [phone, password, rememberMe, navigate]);

  /** 校验用户名与密码，通过后进入导航页；记住密码时写入本地存储 */
  const handleLogin = () => {
    setError("");
    const username = phone.trim();
    const pwd = password;
    const expectedPwd = CREDENTIALS[username];
    if (expectedPwd !== undefined && pwd === expectedPwd) {
      if (rememberMe) {
        try {
          localStorage.setItem(STORAGE_KEY_REMEMBER, "1");
          localStorage.setItem(STORAGE_KEY_USERNAME, username);
          localStorage.setItem(STORAGE_KEY_PASSWORD, pwd);
        } catch {
          /* ignore */
        }
      } else {
        try {
          localStorage.removeItem(STORAGE_KEY_REMEMBER);
          localStorage.removeItem(STORAGE_KEY_USERNAME);
          localStorage.removeItem(STORAGE_KEY_PASSWORD);
        } catch {
          /* ignore */
        }
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        navigate("/hub");
      }, 800);
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setError("用户名或密码错误");
    }, 600);
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(0, 20, 60, 0.55)",
    border: "1px solid rgba(0, 150, 200, 0.4)",
    borderRadius: "4px",
    padding: "11px 14px 11px 42px",
    color: "rgb(200, 235, 255)",
    fontSize: "14px",
    fontFamily: "'Microsoft YaHei', sans-serif",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.3s, box-shadow 0.3s",
    letterSpacing: "0.04em",
  };

  return (
    <div
      data-cmp="LoginForm"
      style={{
        width: "340px",
        background: "linear-gradient(160deg, rgba(0, 30, 80, 0.82) 0%, rgba(0, 15, 50, 0.88) 100%)",
        border: "1px solid rgba(0, 160, 220, 0.35)",
        borderRadius: "8px",
        padding: "40px 36px 36px",
        backdropFilter: "blur(18px)",
        boxShadow:
          "0 0 40px rgba(0, 120, 200, 0.2), 0 0 0 1px rgba(0, 180, 255, 0.12), inset 0 0 30px rgba(0, 60, 130, 0.12)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top highlight line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "15%",
          right: "15%",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.7), transparent)",
        }}
      />
      {/* Inner grid texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(0, 180, 255, 0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 180, 255, 0.025) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          pointerEvents: "none",
        }}
      />

      {/* Corner accents */}
      {[
        { top: 0, left: 0 },
        { top: 0, right: 0 },
        { bottom: 0, left: 0 },
        { bottom: 0, right: 0 },
      ].map((pos, i) => (
        <div key={i} style={{ position: "absolute", ...pos, zIndex: 10, pointerEvents: "none" }}>
          <div
            style={{
              position: "absolute",
              width: "18px",
              height: "2px",
              background: "rgb(0, 212, 255)",
              ...("top" in pos ? { top: 0 } : { bottom: 0 }),
              ...("left" in pos ? { left: 0 } : { right: 0 }),
              boxShadow: "0 0 6px rgba(0, 212, 255, 0.8)",
            }}
          />
          <div
            style={{
              position: "absolute",
              width: "2px",
              height: "18px",
              background: "rgb(0, 212, 255)",
              ...("top" in pos ? { top: 0 } : { bottom: 0 }),
              ...("left" in pos ? { left: 0 } : { right: 0 }),
              boxShadow: "0 0 6px rgba(0, 212, 255, 0.8)",
            }}
          />
        </div>
      ))}

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: "32px", position: "relative", zIndex: 2 }}>
        <h2
          style={{
            fontSize: "26px",
            fontWeight: "700",
            color: "rgb(210, 240, 255)",
            fontFamily: "'Microsoft YaHei', 'PingFang SC', sans-serif",
            letterSpacing: "0.3em",
            textShadow: "0 0 16px rgba(0, 212, 255, 0.7), 0 0 32px rgba(0, 180, 255, 0.4)",
            margin: 0,
          }}
        >
          登 录
        </h2>
        <p
          style={{
            fontSize: "11px",
            color: "rgba(0, 180, 220, 0.5)",
            fontFamily: "monospace",
            letterSpacing: "0.35em",
            marginTop: "6px",
          }}
        >
          WELCOME TO LOGIN
        </p>
        <div
          style={{
            width: "60px",
            height: "1px",
            background: "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.6), transparent)",
            margin: "10px auto 0",
          }}
        />
      </div>

      {/* Phone input */}
      <div style={{ position: "relative", marginBottom: "18px", zIndex: 2 }}>
        <div
          style={{
            position: "absolute",
            left: "13px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
          }}
        >
          <Phone size={15} style={{ color: "rgba(0, 180, 220, 0.7)" }} />
        </div>
        <input
          type="tel"
          placeholder="请输入用户名或手机号"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={() => setPhoneHover(true)}
          onBlur={() => setPhoneHover(false)}
          style={{
            ...inputBase,
            borderColor: phoneHover ? "rgba(0, 212, 255, 0.7)" : "rgba(0, 150, 200, 0.4)",
            boxShadow: phoneHover
              ? "0 0 12px rgba(0, 180, 255, 0.2), inset 0 0 8px rgba(0, 80, 150, 0.1)"
              : "none",
          }}
          maxLength={32}
        />
      </div>

      {error && (
        <div
          style={{
            marginBottom: "12px",
            padding: "8px 12px",
            background: "rgba(200, 60, 60, 0.2)",
            border: "1px solid rgba(255, 100, 100, 0.5)",
            borderRadius: "4px",
            color: "rgb(255, 180, 180)",
            fontSize: "13px",
            zIndex: 2,
          }}
        >
          {error}
        </div>
      )}

      {/* Password input */}
      <div style={{ position: "relative", marginBottom: "18px", zIndex: 2 }}>
        <div
          style={{
            position: "absolute",
            left: "13px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 3,
          }}
        >
          <Lock size={15} style={{ color: "rgba(0, 180, 220, 0.7)" }} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="请输入密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onFocus={() => setPwHover(true)}
          onBlur={() => setPwHover(false)}
          style={{
            ...inputBase,
            paddingRight: "42px",
            borderColor: pwHover ? "rgba(0, 212, 255, 0.7)" : "rgba(0, 150, 200, 0.4)",
            boxShadow: pwHover
              ? "0 0 12px rgba(0, 180, 255, 0.2), inset 0 0 8px rgba(0, 80, 150, 0.1)"
              : "none",
          }}
        />
        <button
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: "12px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "rgba(0, 180, 220, 0.6)",
            padding: 0,
            zIndex: 3,
          }}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>

      {/* Remember me */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          marginBottom: "28px",
          zIndex: 2,
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => setRememberMe(!rememberMe)}
      >
        <div
          style={{
            width: "14px",
            height: "14px",
            border: "1px solid rgba(0, 160, 210, 0.5)",
            borderRadius: "2px",
            background: rememberMe ? "rgba(0, 180, 255, 0.3)" : "rgba(0, 20, 60, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.2s",
            flexShrink: 0,
            boxShadow: rememberMe ? "0 0 6px rgba(0, 180, 255, 0.4)" : "none",
          }}
        >
          {rememberMe && (
            <div
              style={{
                width: "7px",
                height: "5px",
                borderLeft: "1.5px solid rgb(0, 212, 255)",
                borderBottom: "1.5px solid rgb(0, 212, 255)",
                transform: "rotate(-45deg) translateY(-1px)",
              }}
            />
          )}
        </div>
        <span
          style={{
            fontSize: "13px",
            color: "rgba(0, 180, 220, 0.65)",
            fontFamily: "'Microsoft YaHei', sans-serif",
            userSelect: "none",
          }}
        >
          记住密码
        </span>
      </div>

      {/* Login button */}
      <button
        onClick={handleLogin}
        disabled={isLoading}
        className="animate-btn-glow"
        style={{
          width: "100%",
          padding: "12px",
          background: isLoading
            ? "linear-gradient(90deg, rgba(0, 130, 180, 0.6), rgba(0, 100, 160, 0.6))"
            : "linear-gradient(90deg, rgb(0, 170, 230), rgb(0, 130, 210))",
          border: "1px solid rgba(0, 220, 255, 0.5)",
          borderRadius: "4px",
          color: "rgb(220, 245, 255)",
          fontSize: "16px",
          fontWeight: "700",
          fontFamily: "'Microsoft YaHei', sans-serif",
          letterSpacing: "0.4em",
          cursor: isLoading ? "not-allowed" : "pointer",
          transition: "all 0.3s ease",
          boxShadow: "0 0 20px rgba(0, 180, 255, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.08)",
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "linear-gradient(90deg, rgb(0, 190, 255), rgb(0, 150, 230))";
            e.currentTarget.style.boxShadow = "0 0 30px rgba(0, 200, 255, 0.55), inset 0 0 12px rgba(255, 255, 255, 0.12)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.currentTarget.style.background = "linear-gradient(90deg, rgb(0, 170, 230), rgb(0, 130, 210))";
            e.currentTarget.style.boxShadow = "0 0 20px rgba(0, 180, 255, 0.35), inset 0 0 10px rgba(255, 255, 255, 0.08)";
          }
        }}
      >
        {isLoading ? (
          <>
            <div
              style={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid rgb(255,255,255)",
                borderRadius: "50%",
                animation: "spin 0.8s linear infinite",
              }}
            />
            <span>登录中...</span>
          </>
        ) : (
          <>
            <LogIn size={16} />
            <span>登 录</span>
          </>
        )}
      </button>

      {/* Bottom decoration */}
      <div
        style={{
          marginTop: "24px",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            fontSize: "10px",
            color: "rgba(0, 150, 190, 0.4)",
            fontFamily: "monospace",
            letterSpacing: "0.2em",
          }}
        >
          SECURE CONNECTION ESTABLISHED
        </div>
      </div>
    </div>
  );
};

export default LoginForm;