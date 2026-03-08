import React, { useState } from "react";
import { Upload, FileText, Image, X, Eye, Download } from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  type: "pdf" | "image" | "excel";
  size: string;
  date: string;
}

interface FileUploadProps {
  label?: string;
  files?: UploadedFile[];
  accept?: string;
}

const defaultFiles: UploadedFile[] = [
  { id: "f1", name: "采购合同_DJI-M300-2024001.pdf", type: "pdf", size: "2.4MB", date: "2024-01-15" },
  { id: "f2", name: "产品合格证.pdf", type: "pdf", size: "0.8MB", date: "2024-01-15" },
  { id: "f3", name: "设备照片_正面.jpg", type: "image", size: "3.2MB", date: "2024-01-16" },
];

const FileUpload: React.FC<FileUploadProps> = ({
  label = "附件管理",
  files = defaultFiles,
  accept = ".pdf,.jpg,.png,.xlsx",
}) => {
  const [fileList, setFileList] = useState<UploadedFile[]>(files);
  const [dragging, setDragging] = useState(false);

  const removeFile = (id: string) => {
    setFileList((prev) => prev.filter((f) => f.id !== id));
    console.log("Remove file:", id);
  };

  const iconForType = (type: string) => {
    if (type === "image") return <Image size={14} color="rgba(38,198,218,1)" />;
    return <FileText size={14} color="rgba(239,83,80,1)" />;
  };

  return (
    <div data-cmp="FileUpload">
      <div style={{ fontSize: 12, color: "rgba(120,145,180,1)", marginBottom: 8 }}>{label}</div>

      {/* Drop zone */}
      <div
        onDragEnter={() => setDragging(true)}
        onDragLeave={() => setDragging(false)}
        onDrop={() => setDragging(false)}
        style={{
          border: `2px dashed ${dragging ? "rgba(30,136,229,1)" : "rgba(40,58,90,1)"}`,
          borderRadius: 5,
          padding: "20px",
          textAlign: "center",
          marginBottom: 12,
          background: dragging ? "rgba(30,136,229,0.05)" : "transparent",
          transition: "all 0.2s",
          cursor: "pointer",
        }}
        onClick={() => console.log("Open file picker")}
      >
        <Upload size={20} color="rgba(100,130,170,1)" style={{ margin: "0 auto 8px" }} />
        <div style={{ fontSize: 12, color: "rgba(120,145,180,1)" }}>
          拖拽文件至此或 <span style={{ color: "rgba(100,181,246,1)", cursor: "pointer" }}>点击上传</span>
        </div>
        <div style={{ fontSize: 11, color: "rgba(80,110,150,1)", marginTop: 4 }}>
          支持 PDF、图片、Excel，单文件不超过 20MB
        </div>
      </div>

      {/* File list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {fileList.map((file) => (
          <div
            key={file.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              background: "rgba(18,26,44,1)",
              border: "1px solid rgba(30,50,80,1)",
              borderRadius: 4,
            }}
          >
            {iconForType(file.type)}
            <span style={{ flex: 1, fontSize: 12, color: "rgba(180,200,230,1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {file.name}
            </span>
            <span style={{ fontSize: 11, color: "rgba(80,110,150,1)", whiteSpace: "nowrap" }}>{file.size}</span>
            <span style={{ fontSize: 11, color: "rgba(80,110,150,1)", whiteSpace: "nowrap" }}>{file.date}</span>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => console.log("Preview:", file.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(100,181,246,1)", padding: 2 }}>
                <Eye size={13} />
              </button>
              <button onClick={() => console.log("Download:", file.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(100,181,246,1)", padding: 2 }}>
                <Download size={13} />
              </button>
              <button onClick={() => removeFile(file.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(120,145,180,1)", padding: 2 }}>
                <X size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;