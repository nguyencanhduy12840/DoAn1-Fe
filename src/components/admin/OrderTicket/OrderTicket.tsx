/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import AddOrderTicket from "./AddOrderTicket/AddOrderTicket";
// import { OrderTicket as OrderTicketType } from "../../../types/OrderTicket";
import { RootState, useAppDispatch } from "../../../redux/store";
import {
  confirmCompleteSaleTicket,
  confirmDeliverySaleTicket,
  deleteSaleTicket,
  getAllSaleTicketAdmin,
} from "../../../redux/slice/saleTicketSlice";
import { useSelector } from "react-redux";
import { formatDateTime } from "../../../utils/dataUtils";
import ViewOrderDetailModal from "./AddOrderTicket/ViewOrderDetailModal";
import { OrderTicket as OrderTicketType } from "../../../types/OrderTicket";
import jsPDF from "jspdf";
import "jspdf-autotable";
import autoTable from "jspdf-autotable";
export default function OrderTicket() {
  const [isAddTicketModalOpen, setIsAddTicketModalOpen] = useState(false);
  const [isViewDetailModalOpen, setIsViewDetailModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderTicketType>();
  const [page, setPage] = useState(1);
  const size = 2;
  const orders = useSelector(
    (state: RootState) => state.saleTicket.listSaleTicket
  );

  const dispatch = useAppDispatch();
  const handleExport = async (id: string) => {
    try {
      const ticketDetails = orders.find((item) => item.id === id);
      if (!ticketDetails) return;

      const exportData = {
        id: ticketDetails.id,
        date: ticketDetails.date,
        user: {
          name: ticketDetails.userEntity.fullName,
        },
        total: ticketDetails.total,
        discount: ticketDetails.voucherEntity,
        details: {
          listProducts: ticketDetails.saleTicketDetails.map((detail) => ({
            quantity: detail.quantity,
            product: {
              name: detail.productEntity.name,
              unitPrice: detail.productEntity.price,
            },
          })),
        },
      };

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: "a4",
      });
      const pageWidth = pdf.internal.pageSize.width;

      // Set font before using autoTable
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);

      pdf.setFont("times", "bold");
      pdf.setFontSize(16);
      pdf.text("BEAUTIFY", 50, 40);
      pdf.setFont("times", "normal");
      pdf.setFontSize(12);
      pdf.text(
        "University of Information Technology, HCM City, Vietnam",
        50,
        55
      );
      pdf.text("Phone: (123) 456-7890 | Email: beautify@gmail.com", 50, 70);
      pdf.setFont("times", "bold");
      pdf.setFontSize(18);
      pdf.text("SALE TICKET DETAIL", pageWidth - 100, 40, {
        align: "right",
      });

      pdf.setLineWidth(0.5);
      pdf.line(50, 85, pageWidth - 50, 85);

      pdf.setFontSize(12);
      pdf.setFont("times", "normal");
      pdf.text(`Sale Ticket ID: ${exportData.id}`, 50, 110);
      pdf.text(`Date: ${formatDateTime(exportData.date)}`, 50, 125);
      pdf.text(`Customer: ${exportData.user.name}`, 50, 140);
      pdf.text(`Total Price: $${exportData.total.toFixed(2)}`, 50, 155);

      const tableColumns = ["#", "Product Name", "Price", "Quantity", "Total"];
      const tableRows = exportData.details.listProducts.map(
        (product, index) => [
          index + 1,
          product.product.name,
          `$${product.product.unitPrice.toFixed(2)}`,
          product.quantity,
          `$${(product.quantity * product.product.unitPrice).toFixed(2)}`,
        ]
      );

      // ✅ PASS pdf AS FIRST ARGUMENT
      autoTable(pdf, {
        head: [tableColumns],
        body: tableRows,
        startY: 180,
        theme: "grid",
        headStyles: {
          fillColor: [200],
          textColor: [0],
          fontSize: 12,
          halign: "center",
        },
        columnStyles: {
          0: { cellWidth: 40, halign: "center" },
          1: { cellWidth: 220 },
          2: { cellWidth: 80, halign: "center" },
          3: { cellWidth: 80, halign: "center" },
          4: { cellWidth: 80, halign: "center" },
        },
        styles: {
          fontSize: 10,
          lineColor: [0, 0, 0],
          lineWidth: 0.15,
        },
        margin: { left: 50, right: 50 },
      });

      const lastTableY = (pdf as any).lastAutoTable.finalY;

      const subtotal = exportData.details.listProducts.reduce(
        (acc, product) => acc + product.quantity * product.product.unitPrice,
        0
      );

      let voucherText = "Voucher: None";
      let discountAmount = 0;
      if (exportData.discount) {
        const discountValue = exportData.discount.value;
        if (exportData.discount.isPercentage) {
          discountAmount = (subtotal * (discountValue as number)) / 100;
          voucherText = `Voucher: -$${discountAmount.toFixed(
            2
          )} (-${discountValue}%)`;
        } else {
          discountAmount = discountValue as number;
          voucherText = `Voucher: -$${discountAmount.toFixed(2)}`;
        }
      }

      let grandTotal = subtotal - discountAmount;
      let deliveryFee = 0;
      if (grandTotal !== exportData.total) {
        deliveryFee = 5;
        grandTotal += deliveryFee;
      }

      pdf.text(
        `Subtotal: $${subtotal.toFixed(2)}`,
        pageWidth - 160,
        lastTableY + 30
      );
      pdf.text(voucherText, pageWidth - 160, lastTableY + 50);
      if (deliveryFee > 0) {
        pdf.text(
          `Delivery Fee: $${deliveryFee.toFixed(2)}`,
          pageWidth - 160,
          lastTableY + 70
        );
      }
      pdf.text(
        `Grand Total: $${grandTotal.toFixed(2)}`,
        pageWidth - 160,
        lastTableY + (deliveryFee > 0 ? 90 : 70)
      );

      pdf.line(
        50,
        lastTableY + (deliveryFee > 0 ? 100 : 80),
        pageWidth - 50,
        lastTableY + (deliveryFee > 0 ? 100 : 80)
      );

      pdf.setFont("times", "italic");
      pdf.setFontSize(10);
      pdf.text(
        "Thank you for your business!",
        50,
        lastTableY + (deliveryFee > 0 ? 75 : 55)
      );
      pdf.text(
        "If you have any questions, please contact us at beautify@gmail.com.",
        50,
        lastTableY + (deliveryFee > 0 ? 90 : 70)
      );

      pdf.save(`Sale_Ticket_${exportData.id}.pdf`);
    } catch (error) {
      console.error("Error exporting sale ticket:", error);
    }
  };

  const handleToggleStatus = (id: string, status: string) => {
    if (status === "PREPARING") {
      dispatch(confirmDeliverySaleTicket(id));
    } else if (status === "DELIVERING") {
      dispatch(confirmCompleteSaleTicket(id));
    }
    // Completed thì không dispatch gì cả
  };

  const handleViewDetail = (id: string) => {
    const order = orders.find((o) => o.id === id);
    if (order) {
      setSelectedOrder(order);
      setIsViewDetailModalOpen(true);
    }
    console.log(order);
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteSaleTicket(id)).unwrap();

      const currentPage = page;
      const res = await dispatch(
        getAllSaleTicketAdmin({
          page: (currentPage - 1).toString(),
          size: size.toString(),
        })
      ).unwrap();

      // Nếu sau khi xoá mà danh sách trống và không phải trang đầu, lùi về trang trước
      if (res.result.length === 0 && currentPage > 1) {
        const newPage = currentPage - 1;
        setPage(newPage);
        // Gọi lại API với trang mới
        await dispatch(
          getAllSaleTicketAdmin({
            page: (newPage - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      }
    } catch (error) {
      console.error("Failed to delete and reload:", error);
    }
  };

  useEffect(() => {
    const fetchAllOrderTickets = async () => {
      try {
        await dispatch(
          getAllSaleTicketAdmin({
            page: (page - 1).toString(),
            size: size.toString(),
          })
        ).unwrap();
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllOrderTickets();
  }, [dispatch, page]);

  const pages = useSelector((state: RootState) => state.saleTicket.pages);
  return (
    <>
      <div className="mx-auto w-[95%]">
        <div className="mb-[30px] flex justify-end">
          <button
            className="btn bg-[#293241] text-white"
            onClick={() => setIsAddTicketModalOpen(true)}
          >
            Add
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="table bg-[#e0fbfc] text-center">
            {/* head */}
            <thead>
              <tr>
                <th>STT</th>
                <th>Date</th>
                <th>Total Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order.id}>
                  <th>{(page - 1) * size + index + 1}</th>
                  <td>{formatDateTime(order.date)}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <div className="flex justify-center gap-2 flex-wrap">
                      {/* Export (nếu bạn có logic riêng, bạn thêm vào) */}
                      <button
                        className="btn btn-sm btn-outline btn-success"
                        onClick={() => handleExport(order.id)}
                      >
                        Export
                      </button>

                      {/* Status */}
                      <button
                        className={`btn btn-sm btn-outline ${
                          order.status === "PREPARING"
                            ? "btn-warning"
                            : order.status === "DELIVERING"
                            ? "btn-info"
                            : "btn-success"
                        }`}
                        onClick={() =>
                          handleToggleStatus(order.id.toString(), order.status)
                        }
                        disabled={order.status === "Completed"}
                      >
                        {order.status}
                      </button>

                      {/* View Detail */}
                      <button
                        className="btn btn-sm btn-outline btn-primary"
                        onClick={() => handleViewDetail(order.id)}
                      >
                        View Detail
                      </button>

                      {/* Delete */}
                      <button
                        className="btn btn-sm btn-outline btn-error"
                        onClick={() => handleDelete(order.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <div className="flex justify-center mt-4 gap-2">
            <button
              className="btn btn-sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Prev
            </button>
            {[...Array(pages)].map((_, idx) => (
              <button
                key={idx}
                className={`btn btn-sm ${page === idx + 1 ? "btn-active" : ""}`}
                onClick={() => setPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="btn btn-sm"
              disabled={page === pages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Add Import Ticket Modal */}
      <AddOrderTicket
        isOpen={isAddTicketModalOpen}
        onClose={() => setIsAddTicketModalOpen(false)}
        reload={() =>
          dispatch(
            getAllSaleTicketAdmin({
              page: (page - 1).toString(),
              size: size.toString(),
            })
          )
        }
      />

      {selectedOrder && (
        <ViewOrderDetailModal
          isOpen={isViewDetailModalOpen}
          onClose={() => setIsViewDetailModalOpen(false)}
          customerName={selectedOrder?.userEntity?.fullName}
          phoneNumber={selectedOrder.userEntity.phoneNumber}
          address={selectedOrder.userEntity.address}
          totalPrice={selectedOrder.total}
          voucher={selectedOrder?.voucherEntity}
          products={selectedOrder.saleTicketDetails}
        />
      )}
    </>
  );
}
