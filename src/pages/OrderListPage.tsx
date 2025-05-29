import React, { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { getAllSaleTickets } from "../redux/slice/saleTicketSlice";

import { formatDateTime } from "../utils/dataUtils";
import { Link } from "react-router-dom";
import { OrderTicket } from "../types/OrderTicket";

const OrderListPage: React.FC = () => {
  const username = useSelector((state: RootState) => state.user.user.username);
  const [orders, setOrders] = useState<OrderTicket[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const dispatch = useAppDispatch();

  const totalPages = Math.ceil(orders ? orders.length / itemsPerPage : 0);
  const displayedOrders = orders?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    const fetchSaleTicketByUser = async () => {
      try {
        const res = await dispatch(getAllSaleTickets(username)).unwrap();

        // 1. Sắp xếp theo trạng thái (PREPARING, DELIVERING, COMPLETED) và ngày
        const statusOrder = { PREPARING: 1, DELIVERING: 2, COMPLETED: 3 };
        const sorted = [...res].sort((a, b) => {
          const statusA = statusOrder[a.status as keyof typeof statusOrder];
          const statusB = statusOrder[b.status as keyof typeof statusOrder];

          if (statusA !== statusB) return statusA - statusB;

          // Nếu cùng trạng thái, sắp xếp theo ngày giảm dần (mới nhất trước)
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });

        setOrders(sorted);
      } catch (error) {
        console.log(error);
      }
    };

    fetchSaleTicketByUser();
  }, [username, dispatch]);
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8 bg-[#EFF3EA]">
        <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Order History</h2>

          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200 text-base font-semibold">
                <tr>
                  <th className="text-center">Order ID</th>
                  <th className="text-center">Order Date</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedOrders && displayedOrders.length > 0 ? (
                  displayedOrders.map((order) => (
                    <tr key={order.id} className="hover">
                      <td className="text-center">{order.id}</td>
                      <td className="text-center">
                        {formatDateTime(order.date)}
                      </td>
                      <td className="text-center">
                        <div
                          className={`badge px-4 py-2 font-semibold ${
                            order.status === "COMPLETED"
                              ? "bg-[#88C273] text-black"
                              : order.status === "PREPARING"
                              ? "bg-[#FEEE91] text-black"
                              : "bg-[#A2D2DF] text-black"
                          }`}
                        >
                          {order.status}
                        </div>
                      </td>
                      <td className="text-center">
                        <Link to={`orderticket/client/${order.id}`}>
                          <button className="btn btn-sm btn-primary btn-outline">
                            View Details
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-4">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            <div className="flex justify-center mt-4 gap-2">
              <button
                className="btn btn-sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  className={`btn btn-sm ${
                    currentPage === idx + 1 ? "btn-active" : ""
                  }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="btn btn-sm"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderListPage;
