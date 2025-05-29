import React, { useState } from "react";
import {
  FaBars,
  FaTachometerAlt,
  FaList,
  FaInfoCircle,
  FaBoxOpen,
  FaFileImport,
  FaFileInvoiceDollar,
  FaWarehouse,
  FaUserFriends,
  FaTruckLoading,
  FaTicketAlt,
} from "react-icons/fa";

type SidebarProps = {
  selectedTab: string;
  onSelectTab: (tab: string) => void;
};

const tabs = [
  { name: "Dashboard", icon: <FaTachometerAlt /> },
  { name: "Inventory", icon: <FaWarehouse /> },
  { name: "Categories", icon: <FaList /> },
  { name: "Categories Detail", icon: <FaInfoCircle /> },
  { name: "Products", icon: <FaBoxOpen /> },
  { name: "Import Tickets", icon: <FaFileImport /> },
  { name: "Order Tickets", icon: <FaFileInvoiceDollar /> },
  { name: "Users", icon: <FaUserFriends /> },
  { name: "Suppliers", icon: <FaTruckLoading /> },
  { name: "Vouchers", icon: <FaTicketAlt /> },
];

const Sidebar: React.FC<SidebarProps> = ({ selectedTab, onSelectTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={`${
        isCollapsed ? "w-20" : "w-64"
      } p-4 shadow-md flex flex-col transition-all duration-300 bg-[#3d5a80]`}
    >
      {/* Toggle */}
      <button
        onClick={() => setIsCollapsed((prev) => !prev)}
        className="text-xl mb-6 self-right"
        title="Toggle Sidebar"
      >
        <FaBars />
      </button>

      {/* Menu */}
      <ul className="menu rounded-box gap-2">
        {tabs.map((tab) => (
          <li key={tab.name} title={isCollapsed ? tab.name : ""}>
            <button
              onClick={() => onSelectTab(tab.name)}
              className={`flex items-center gap-3 rounded-md flex-1 text-white ${
                selectedTab === tab.name ? "bg-primary text-white" : ""
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              {!isCollapsed && <span>{tab.name}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
