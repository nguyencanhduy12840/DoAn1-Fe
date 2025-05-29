import { useState } from "react";
import Sidebar from "../components/admin/Sidebar/Sidebar";
import Category from "../components/admin/Category/Category";
import CategoryDetail from "../components/admin/CategoryDetail/CategoryDetail";
import Product from "../components/admin/Product/Product";
import ImportTicket from "../components/admin/ImportTicket/ImportTicket";
import OrderTicket from "../components/admin/OrderTicket/OrderTicket";
import User from "../components/admin/User/User";
import Supplier from "../components/admin/Supplier/Supplier";
import Voucher from "../components/admin/Voucher/Voucher";
import Dashboard from "../components/admin/Dashboard/Dashboard";
import InventoryTable from "../components/admin/Inventory/InventoryTable";

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const renderContent = () => {
    switch (activeTab) {
      case "Dashboard":
        return <Dashboard />;
      case "Inventory":
        return <InventoryTable />;
      case "Categories":
        return <Category />;
      case "Categories Detail":
        return <CategoryDetail />;
      case "Products":
        return <Product />;
      case "Import Tickets":
        return <ImportTicket />;
      case "Order Tickets":
        return <OrderTicket />;
      case "Users":
        return <User />;
      case "Suppliers":
        return <Supplier />;
      case "Vouchers":
        return <Voucher />;
      default:
        return <div>Select a tab</div>;
    }
  };
  return (
    <>
      <div className="flex justify-center gap-[20px]">
        <Sidebar selectedTab={activeTab} onSelectTab={setActiveTab} />

        <div className="flex-1 bg-[#98c1d9] h-[100vh]">
          <div className="mt-[20px] ml-[20px]">
            <div className="mb-[30px]">{activeTab} Page</div>
            <div>{renderContent()}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
