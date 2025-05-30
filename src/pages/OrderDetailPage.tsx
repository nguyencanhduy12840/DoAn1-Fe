import { useEffect, useState } from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { formatDateTime } from "../utils/dataUtils";

import { useParams } from "react-router-dom";

import { getSaleTicketById } from "../services/api";
import { OrderTicket } from "../types/OrderTicket";
import { useAppDispatch } from "../redux/store";
import { confirmCompleteSaleTicket } from "../redux/slice/saleTicketSlice";

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [saleTicket, setSaleTicket] = useState<OrderTicket | null>(null);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await getSaleTicketById(id as string);
        setSaleTicket(res.data);
      } catch (err) {
        console.log("Failed to fetch order detail:", err);
      }
    };
    if (id) fetchTicket();
  }, [id]);
  console.log(saleTicket);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const shippingFee = 5;
  const orderPrice = saleTicket
    ? saleTicket.saleTicketDetails.reduce(
        (total, product) =>
          total + product.productEntity.price * product.quantity,
        0
      )
    : 0;

  const discountAmount = saleTicket?.voucherEntity?.isPercentage
    ? ((orderPrice ?? 0) * Number(saleTicket.voucherEntity.value)) / 100
    : saleTicket?.voucherEntity?.value;

  const steps = ["PREPARING", "DELIVERING", "COMPLETED"];
  const currentStep = steps.indexOf(
    saleTicket ? (saleTicket as OrderTicket).status : ""
  );

  const handleConfirmComplete = async () => {
    if (!saleTicket) return;
    try {
      const actionResult = await dispatch(
        confirmCompleteSaleTicket(saleTicket.id)
      );
      if (confirmCompleteSaleTicket.fulfilled.match(actionResult)) {
        setSaleTicket({ ...saleTicket, status: "COMPLETED" }); // cập nhật trạng thái tại local state
      }
    } catch (error) {
      console.error("Failed to confirm completion:", error);
    } finally {
      setDialogOpen(false);
    }
  };

  const baseURL = "http://localhost:8080";
  if (!saleTicket) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 py-16 text-center text-gray-500">
          Loading order detail...
        </main>
        <Footer />
      </>
    );
  }
  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-8 font-montserrat bg-base-100 mt-[-60px]">
        <div className="max-w-5xl mx-auto mt-24 p-6 bg-gray-100 rounded-xl">
          <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">Order ID: {saleTicket.id}</h2>
              <p className="text-gray-500">
                Order Date: {formatDateTime(saleTicket.date)}
              </p>
              <p className="text-gray-500">
                Expected Delivery:{" "}
                {formatDateTime(
                  new Date(
                    new Date(saleTicket.date).setDate(
                      new Date(saleTicket.date).getDate() + 5
                    )
                  ).toLocaleDateString()
                )}
              </p>
            </div>
          </div>

          {/* Status Timeline */}
          <ul className="steps steps-horizontal w-full mb-8">
            {steps.map((step, i) => (
              <li
                key={i}
                className={`step ${i <= currentStep ? "step-primary" : "step"}`}
              >
                {step}
              </li>
            ))}
          </ul>

          {/* Order Items */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-lg font-bold text-primary mb-4">Order Items</h3>
            <ul>
              {saleTicket.saleTicketDetails.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between py-2 border-b"
                >
                  <div className="flex items-center">
                    <img
                      src={
                        item.productEntity.productImage.startsWith(baseURL)
                          ? item.productEntity.productImage
                          : baseURL + item.productEntity.productImage
                      }
                      alt={item.productEntity.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <div className="ml-4">
                      <p className="font-medium">{item.productEntity.name}</p>
                      <p className="text-sm text-gray-500">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="font-bold text-right">
                    ${item.productEntity.price.toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-primary mb-4">
              Payment Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <span>Order Price:</span>
              <span className="text-right">${orderPrice?.toFixed(2)}</span>

              <span>Shipping Fee:</span>
              <span className="text-right">${shippingFee.toFixed(2)}</span>

              <span>Voucher ({saleTicket.voucherEntity?.name || "None"}):</span>
              <span className="text-right">
                {saleTicket.voucherEntity
                  ? `- $${(typeof discountAmount === "number"
                      ? discountAmount
                      : 0
                    ).toFixed(2)}${
                      saleTicket.voucherEntity.isPercentage
                        ? ` (${saleTicket.voucherEntity.value}%)`
                        : ""
                    }`
                  : "- $0"}
              </span>

              <span className="font-bold">Final Price:</span>
              <span className="text-right font-bold text-green-600">
                ${saleTicket.total.toFixed(2)}
              </span>

              <span>Payment Method:</span>
              <span className="text-right">Cash on Delivery</span>
            </div>
          </div>

          {saleTicket.status === "DELIVERING" && (
            <div className="flex justify-center mt-6">
              <button
                className="btn btn-primary btn-lg rounded-full px-8 shadow-lg text-lg font-bold"
                onClick={() => setDialogOpen(true)}
              >
                Confirm Completed
              </button>
            </div>
          )}

          {/* Confirmation Dialog */}
          {isDialogOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                style={{ backgroundColor: "transparent" }}
                onClick={() => setDialogOpen(false)}
              />

              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-white p-6 rounded-xl w-96 shadow-xl border border-gray-300 pointer-events-auto">
                  <h3 className="text-lg font-bold mb-4">Confirm Completion</h3>
                  <p className="mb-6">
                    Are you sure you want to mark this order as completed?
                  </p>
                  <div className="flex justify-end gap-4">
                    <button
                      className="btn"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-primary"
                      onClick={handleConfirmComplete}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default OrderDetailPage;
