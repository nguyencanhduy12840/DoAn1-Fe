/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

import { RiOrderPlayFill } from "react-icons/ri";
import { IoMdCash } from "react-icons/io";
import { FaBoxes } from "react-icons/fa";
import { BiSolidCategoryAlt } from "react-icons/bi";

import SummaryCard from "./SummaryCard";
import PerformanceOverview from "./PerformanceOverview";
import Donut from "./Donut";
import TopProductSales from "./TopProductSales";
import { getInventoryDetail } from "../../../services/api";
import { useAppDispatch } from "../../../redux/store";
import { getAllProducts } from "../../../redux/slice/productSlice";
import { getAllImportTicket } from "../../../redux/slice/importTicketSlice";
import { getAllSaleTicketAdmin } from "../../../redux/slice/saleTicketSlice";

const Dashboard = () => {
  const [totalProducts, setTotalProducts] = useState("0");
  const [soldOutProducts, setSoldOutProducts] = useState("0");
  const [processingImportTickets, setProcessingImportTickets] = useState("0");
  const [completedImportTickets, setCompletedImportTickets] = useState("0");
  const [processingOrderTickets, setProcessingOrderTickets] = useState("0");
  const [processedOrderTickets, setProcessedOrderTickets] = useState("0");
  const [completedOrderTickets, setCompletedOrderTickets] = useState("0");
  const [inventoryDetails, setInventoryDetails] = useState([]);
  const [lastSixMonthsRevenue, setLastSixMonthsRevenue] = useState<number[]>(
    []
  );
  const [lastSixMonthsProfit, setLastSixMonthsProfit] = useState<number[]>([]);
  const [sixRecentMonths, setSixRecentMonths] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const FetchInventoryDetails = async () => {
    try {
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const response = await getInventoryDetail(currentMonth, currentYear);
      const sortedData = response.data
        .filter((item: { product: any }) => item.product !== null)
        .sort(
          (a: { totalSold: number }, b: { totalSold: number }) =>
            b.totalSold - a.totalSold
        );
      setInventoryDetails(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateRevenueByCategory = (inventoryDetail: any[]) => {
    const revenueByParentCategory: { [key: string]: number } = {};
    console.log(inventoryDetail);
    inventoryDetail.forEach((item) => {
      const revenue = item.totalSold * item.product.price;

      // Lấy các danh mục cha duy nhất từ categoryDetails
      const parentCategories = [
        ...new Set(
          item.product.categoryDetails
            .map((cat: any) => cat.categoryEntity?.name) // Dùng category.name
            .filter(Boolean)
        ),
      ];

      const share = revenue / parentCategories.length;

      parentCategories.forEach((parentCategoryName: any) => {
        revenueByParentCategory[parentCategoryName] =
          (revenueByParentCategory[parentCategoryName] || 0) + share;
      });
    });

    return Object.entries(revenueByParentCategory).map(
      ([category, revenue]) => ({
        category,
        revenue,
      })
    );
  };

  const revenueData = calculateRevenueByCategory(inventoryDetails);
  const donutlabels = revenueData.map((item) => item.category);
  const donutseries = revenueData.map((item) => item.revenue);

  const FetchPerformanceData = async () => {
    try {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      const sixRecentMonths = [];
      const revenueData = [];
      const profitData = [];

      for (let i = 0; i < 6; i++) {
        const monthIndex = (currentMonth - i + 12) % 12;
        const year = currentMonth - i < 0 ? currentYear - 1 : currentYear;
        const month = monthIndex + 1;
        const response = await getInventoryDetail(month, year);
        const monthlyRevenue = response.data.reduce(
          (
            total: number,
            item: { totalSold: number; product: { unitPrice: number } }
          ) => total + item.totalSold * item.product.unitPrice,
          0
        );
        revenueData.unshift(monthlyRevenue);
        profitData.unshift(monthlyRevenue * 0.1);
        sixRecentMonths.unshift(monthNames[monthIndex]);
      }

      setLastSixMonthsRevenue(revenueData);
      setLastSixMonthsProfit(profitData);
      setSixRecentMonths(sixRecentMonths);
    } catch (error) {
      console.error("Error fetching performance data:", error);
    }
  };

  const FetchAllProducts = async () => {
    try {
      const response = await dispatch(
        getAllProducts({ page: "0", size: "100" })
      ).unwrap();
      const allProducts = response.result;
      setTotalProducts(allProducts.length.toString());
      setSoldOutProducts(
        allProducts
          .filter((product: any) => product.quantity < 1)
          .length.toString()
      );
    } catch {
      console.log("Error");
    }
  };

  const FetchAllImportTickets = async () => {
    try {
      const response = await dispatch(
        getAllImportTicket({ page: "0", size: "100" })
      ).unwrap();
      const allImportTickets = response.result;
      setProcessingImportTickets(
        allImportTickets
          .filter((ticket: any) => !ticket.status)
          .length.toString()
      );
      setCompletedImportTickets(
        allImportTickets
          .filter((ticket: any) => ticket.status)
          .length.toString()
      );
    } catch {
      console.log("Error");
    }
  };

  const FetchAllOrderTickets = async () => {
    try {
      const response = await dispatch(
        getAllSaleTicketAdmin({ page: "0", size: "100" })
      ).unwrap();
      const allOrderTickets = response.result;
      setProcessingOrderTickets(
        allOrderTickets
          .filter((ticket: any) => ticket.status === "PREPARING")
          .length.toString()
      );
      setProcessedOrderTickets(
        allOrderTickets
          .filter((ticket: any) => ticket.status === "DELIVERING")
          .length.toString()
      );
      setCompletedOrderTickets(
        allOrderTickets
          .filter((ticket: any) => ticket.status === "COMPLETED")
          .length.toString()
      );
    } catch {
      console.log("Error");
    }
  };

  const totalTickets =
    (Number(processedOrderTickets) || 0) +
    (Number(processingOrderTickets) || 0);

  useEffect(() => {
    FetchAllProducts();
    FetchAllImportTickets();
    FetchAllOrderTickets();
    FetchInventoryDetails();
    FetchPerformanceData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        <SummaryCard
          icon={<FaBoxes />}
          title="Products Status"
          primaryValue={totalProducts}
          primaryLabel="Total"
          secondaryValue={soldOutProducts}
          secondaryLabel="Sold out"
        />
        <SummaryCard
          icon={<BiSolidCategoryAlt />}
          title="Imports Status"
          primaryValue={processingImportTickets}
          primaryLabel="Processing"
          secondaryValue={completedImportTickets}
          secondaryLabel="Checked"
        />
        <SummaryCard
          icon={<RiOrderPlayFill />}
          title="Orders Status"
          primaryValue={processingOrderTickets}
          primaryLabel="Processing"
          secondaryValue={processedOrderTickets}
          secondaryLabel="Delivering"
        />
        <SummaryCard
          icon={<IoMdCash />}
          title="Orders Payment"
          primaryValue={completedOrderTickets}
          primaryLabel="Paid"
          secondaryValue={totalTickets.toString()}
          secondaryLabel="Pending"
        />
      </div>

      <div className="mt-10 grid lg:grid-cols-3 gap-4">
        <PerformanceOverview
          revenueData={lastSixMonthsRevenue}
          months={sixRecentMonths}
          profitData={lastSixMonthsProfit}
        />
        <Donut series={donutseries} labels={donutlabels} />
        <TopProductSales topSale={inventoryDetails.slice(0, 3)} />
      </div>
    </div>
  );
};

export default Dashboard;
