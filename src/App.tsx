import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NavigationHub from "./pages/NavigationHub";
import CommandCenter from "./pages/CommandCenter";
import DeviceLayout from "./device/DeviceLayout";
import DeviceDashboard from "./device/pages/Dashboard";
import DeviceArchive from "./device/pages/DeviceArchive";
import RemoteMonitor from "./device/pages/RemoteMonitor";
import AlertManage from "./device/pages/AlertManage";
import DeviceLoan from "./device/pages/DeviceLoan";
import Maintenance from "./device/pages/Maintenance";
import FaultRepair from "./device/pages/FaultRepair";
import DamageAssess from "./device/pages/DamageAssess";
import Scrapping from "./device/pages/Scrapping";
import PersonnelLayout from "./personnel/PersonnelLayout";
import PersonnelDashboard from "./personnel/pages/Dashboard";
import PilotArchive from "./personnel/pages/PilotArchive";
import PilotDetail from "./personnel/pages/PilotDetail";
import QualificationMonitor from "./personnel/pages/QualificationMonitor";
import QualificationUpgrade from "./personnel/pages/QualificationUpgrade";
import PilotTransfer from "./personnel/pages/PilotTransfer";
import PersonnelTraining from "./personnel/pages/Training";
import PilotTasks from "./personnel/pages/PilotTasks";
import PilotResignation from "./personnel/pages/PilotResignation";
import PersonnelPerformance from "./personnel/pages/Performance";
import MissionLayout from "./mission/MissionLayout";
import TaskDashboard from "./mission/pages/TaskDashboard";
import TaskCreate from "./mission/pages/TaskCreate";
import TaskApproval from "./mission/pages/TaskApproval";
import TaskArchive from "./mission/pages/TaskArchive";
import AlertCenter from "./mission/pages/AlertCenter";
import SmartDispatch from "./mission/pages/SmartDispatch";
import DataDashboard from "./data/pages/Dashboard";
import DataManagement from "./data/pages/DataManagement";
import DataStatistics from "./data/pages/Statistics";
import DataRawMaterial from "./data/pages/RawMaterial";
import DataOrthoResult from "./data/pages/OrthoResult";
import DataDsmResult from "./data/pages/DsmResult";
import DataModel3dResult from "./data/pages/Model3dResult";
import DataBusinessResult from "./data/pages/BusinessResult";
import DataPilotStats from "./data/pages/PilotStats";
import DataDeviceStats from "./data/pages/DeviceStats";
import DataTaskStats from "./data/pages/TaskStats";
import DataBlackFlyStats from "./data/pages/BlackFlyStats";
import DataPermission from "./data/pages/DataPermission";
import SystemDashboard from "./system/pages/Dashboard";
import SystemOrganization from "./system/pages/Organization";
import SystemUsers from "./system/pages/Users";
import SystemRoles from "./system/pages/Roles";
import SystemMessages from "./system/pages/MessageManager";
import SystemAlgorithms from "./system/pages/AlgorithmManager";
import SystemAuditLog from "./system/pages/AuditLog";
import SystemApiCenter from "./system/pages/ApiCenter";
import SystemIpWhitelist from "./system/pages/IpWhitelist";
import SystemServiceMonitor from "./system/pages/ServiceMonitor";
import SystemMenuManage from "./system/pages/MenuManage";
import SystemDictManage from "./system/pages/DictManage";
import SystemSettings from "./system/pages/Settings";
import BusinessHub from "./business/pages/BusinessHub";
import TrafficEnforcement from "./business/pages/TrafficEnforcement";
import UrbanGovernance from "./business/pages/UrbanGovernance";
import UrbanCityPatrol from "./business/urban/pages/CityPatrol";
import UrbanEventReview from "./business/urban/pages/EventReview";
import UrbanWorkOrder from "./business/urban/pages/WorkOrder";
import UrbanEmergency from "./business/urban/pages/Emergency";
import EmergencyResponse from "./business/pages/EmergencyResponse";
import FlyLayout from "./fly/FlyLayout";
import FlyDashboard from "./fly/pages/Dashboard";
import FlyRoutes from "./fly/pages/Routes";
import FlyAirspace from "./fly/pages/Airspace";
import FlyWorkflows from "./fly/pages/Workflows";
import FlyModeling from "./fly/pages/Modeling";
import { AuditProvider } from "./contexts/AuditContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { UserProvider } from "./contexts/UserContext";

const queryClient = new QueryClient();

const App = () => {
  console.log("UAV Management Platform App initialized");

  return (
    <QueryClientProvider client={queryClient}>
      <AuditProvider>
        <BrowserRouter>
          <NotificationProvider>
            <UserProvider>
          <div
            style={{
              minHeight: "100vh",
              background: "rgb(2, 8, 28)",
              overflowX: "auto",
              maxWidth: "1920px",
              margin: "0 auto",
            }}
          >
            <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/hub" element={<NavigationHub />} />
            <Route path="/fly" element={<FlyLayout />}>
              <Route index element={<FlyDashboard />} />
              <Route path="routes" element={<FlyRoutes />} />
              <Route path="airspace" element={<FlyAirspace />} />
              <Route path="workflows" element={<FlyWorkflows />} />
              <Route path="modeling" element={<FlyModeling />} />
            </Route>
            <Route path="/command" element={<CommandCenter />} />
            <Route path="/personnel" element={<PersonnelLayout />}>
              <Route index element={<PersonnelDashboard />} />
              <Route path="pilot-archive" element={<PilotArchive />} />
              <Route path="pilot-archive/:pilotId" element={<PilotDetail />} />
              <Route path="qualification-monitor" element={<QualificationMonitor />} />
              <Route path="qualification-upgrade" element={<QualificationUpgrade />} />
              <Route path="pilot-transfer" element={<PilotTransfer />} />
              <Route path="training" element={<PersonnelTraining />} />
              <Route path="pilot-tasks" element={<PilotTasks />} />
              <Route path="pilot-resignation" element={<PilotResignation />} />
              <Route path="performance" element={<PersonnelPerformance />} />
            </Route>
            <Route path="/mission" element={<MissionLayout />}>
              <Route index element={<TaskDashboard />} />
              <Route path="task-create" element={<TaskCreate />} />
              <Route path="task-approval" element={<TaskApproval />} />
              <Route path="task-archive" element={<TaskArchive />} />
              <Route path="alert-center" element={<AlertCenter />} />
              <Route path="smart-dispatch" element={<SmartDispatch />} />
            </Route>
            <Route path="/data" element={<DataDashboard />} />
            <Route path="/data/management" element={<DataManagement />} />
            <Route path="/data/statistics" element={<DataStatistics />} />
            <Route path="/data/raw" element={<DataRawMaterial />} />
            <Route path="/data/ortho" element={<DataOrthoResult />} />
            <Route path="/data/dsm" element={<DataDsmResult />} />
            <Route path="/data/model3d" element={<DataModel3dResult />} />
            <Route path="/data/business" element={<DataBusinessResult />} />
            <Route path="/data/pilot-stats" element={<DataPilotStats />} />
            <Route path="/data/device-stats" element={<DataDeviceStats />} />
            <Route path="/data/task-stats" element={<DataTaskStats />} />
            <Route path="/data/black-fly-stats" element={<DataBlackFlyStats />} />
            <Route path="/data/permission" element={<DataPermission />} />
            <Route path="/system" element={<SystemDashboard />} />
            <Route path="/system/organization" element={<SystemOrganization />} />
            <Route path="/system/users" element={<SystemUsers />} />
            <Route path="/system/roles" element={<SystemRoles />} />
            <Route path="/system/messages" element={<SystemMessages />} />
            <Route path="/system/algorithms" element={<SystemAlgorithms />} />
            <Route path="/system/audit-log" element={<SystemAuditLog />} />
            <Route path="/system/api-center" element={<SystemApiCenter />} />
            <Route path="/system/ip-whitelist" element={<SystemIpWhitelist />} />
            <Route path="/system/service-monitor" element={<SystemServiceMonitor />} />
            <Route path="/system/menu-manage" element={<SystemMenuManage />} />
            <Route path="/system/dict-manage" element={<SystemDictManage />} />
            <Route path="/system/settings" element={<SystemSettings />} />
            <Route path="/business" element={<BusinessHub />} />
            <Route path="/business/traffic" element={<TrafficEnforcement />} />
            <Route path="/business/urban" element={<UrbanGovernance />}>
              <Route index element={<UrbanCityPatrol />} />
              <Route path="event-review" element={<UrbanEventReview />} />
              <Route path="work-order" element={<UrbanWorkOrder />} />
              <Route path="emergency" element={<UrbanEmergency />} />
            </Route>
            <Route path="/business/emergency" element={<EmergencyResponse />} />
            <Route path="/device" element={<DeviceLayout />}>
              <Route index element={<DeviceDashboard />} />
              <Route path="device-archive" element={<DeviceArchive />} />
              <Route path="remote-monitor" element={<RemoteMonitor />} />
              <Route path="alert-manage" element={<AlertManage />} />
              <Route path="device-loan" element={<DeviceLoan />} />
              <Route path="maintenance" element={<Maintenance />} />
              <Route path="fault-repair" element={<FaultRepair />} />
              <Route path="damage-assess" element={<DamageAssess />} />
              <Route path="scrapping" element={<Scrapping />} />
            </Route>
          </Routes>
          </div>
          </UserProvider>
          </NotificationProvider>
        </BrowserRouter>
      </AuditProvider>
    </QueryClientProvider>
  );
};

export default App;