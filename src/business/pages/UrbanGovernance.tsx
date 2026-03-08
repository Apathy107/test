import React from 'react';
import AppLayout from '../components/AppLayout';
import UrbanApp from '../urban/UrbanApp';

const UrbanGovernance: React.FC = () => {
  return (
    <AppLayout title="城市综合治理 (Urban Governance)">
      <div
        className="w-full flex flex-col"
        style={{
          flex: 1,
          minHeight: 0,
          height: "100%",
          marginTop: "-24px",
          marginLeft: "-24px",
          marginRight: "-24px",
          width: "calc(100% + 48px)",
        }}
      >
        <UrbanApp />
      </div>
    </AppLayout>
  );
};

export default UrbanGovernance;
