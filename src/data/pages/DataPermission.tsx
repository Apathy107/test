import React from 'react';
import Layout from '../components/layout/Layout';
import DataWorkspace from '../components/layout/DataWorkspace';
import { Shield, User, Users, Building2 } from 'lucide-react';

const breadcrumbs = [{ label: '数据智能中心', path: '/data' }, { label: '系统管理' }, { label: '数据权限' }];

const ROLES = [
  { name: '飞手', scope: '本人拍摄', icon: User },
  { name: '项目管理员', scope: '本项目/本辖区', icon: Users },
  { name: '市级管理员', scope: '全量数据', icon: Building2 },
];

export default function DataPermission() {
  return (
    <Layout>
      <DataWorkspace breadcrumbs={breadcrumbs} actions={<button type="button" className="px-3 py-1.5 text-xs rounded bg-primary text-primary-foreground">保存配置</button>}>
        <div className="max-w-2xl space-y-6">
          <p className="text-sm text-muted-foreground">基于角色的访问控制（RBAC）。配置「禁止下载」的敏感区域后，列表中敏感数据的下载按钮将置灰，仅支持在线预览。</p>
          <div className="rounded-lg border border-border divide-y divide-border">
            {ROLES.map((r) => (
              <div key={r.name} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <r.icon size={20} className="text-primary" />
                  <div>
                    <div className="font-medium text-foreground">{r.name}</div>
                    <div className="text-xs text-muted-foreground">数据范围：{r.scope}</div>
                  </div>
                </div>
                <button type="button" className="text-sm text-primary hover:underline">配置</button>
              </div>
            ))}
          </div>
          <div className="rounded-lg border border-border p-4">
            <h4 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
              <Shield size={16} /> 敏感区域（禁止下载）
            </h4>
            <p className="text-xs text-muted-foreground">在此配置政府机关、军事禁区等敏感区域，这些区域内的数据仅支持在线预览。</p>
            <button type="button" className="mt-3 px-3 py-1.5 text-xs rounded border border-border hover:bg-secondary">+ 添加敏感区域</button>
          </div>
        </div>
      </DataWorkspace>
    </Layout>
  );
}
