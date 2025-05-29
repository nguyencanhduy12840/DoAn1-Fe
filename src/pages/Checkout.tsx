/* eslint-disable @typescript-eslint/no-explicit-any */
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { getAllVouchersExist } from "../services/api";
import { Voucher } from "../types/Voucher";
import { createSaleTicket } from "../redux/slice/saleTicketSlice";
import { toast } from "react-toastify";
import { deleteFromCart, getCartByUser } from "../redux/slice/cartSlice";

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedIds: number[] = location.state?.selectedIds || [];
  const allItems = useSelector((state: RootState) => state.cart.listOrderItem);
  const selectedItems = allItems.filter((item) =>
    selectedIds.includes(item.id)
  );
  const user = useSelector((state: RootState) => state.user.user);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher>();
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [address, setAddress] = useState<string>("");

  const [voucherList, setVoucherList] = useState<Voucher[]>();
  const dispatch = useAppDispatch();
  const username = user.username;
  useEffect(() => {
    if (allItems.length > 0 && selectedItems.length === 0) {
      alert("No items selected for checkout.");
      navigate("/");
    }
  }, [allItems, selectedItems, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhoneNumber(user.phoneNumber || "");
      setAddress(user.address || "");
    }
  }, [user]);

  useEffect(() => {
    const fetchAllVouchers = async () => {
      const res = await getAllVouchersExist({ page: "0", size: "100" });
      setVoucherList(res.data.result);
    };
    fetchAllVouchers();
  }, []);

  const handleCheckout = async () => {
    try {
      const now = new Date();
      const isoString = now.toISOString();
      const listProduct = selectedItems.map((item: any) => {
        return {
          productName: item.productEntity.name,
          quantity: item.quantity,
        };
      });
      dispatch(
        createSaleTicket({
          username: username,
          date: isoString,
          listProducts: listProduct,
          total: finalPrice,
          voucherId: Number(selectedVoucher?.id) || 0,
        })
      ).unwrap();
      const productIdsToDelete = selectedItems.map(
        (item: any) => item.productEntity.id
      );
      await dispatch(
        deleteFromCart({ username, productIds: productIdsToDelete })
      ).unwrap();

      await dispatch(getCartByUser(username));
      toast.success("Order placed successfully!");
      navigate("/orderlist");
    } catch (error) {
      console.log(error);
    }
  };

  const totalPrice = selectedItems.reduce(
    (sum: number, item: any) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = selectedVoucher
    ? selectedVoucher.isPercentage
      ? (totalPrice * Number(selectedVoucher.value)) / 100
      : Number(selectedVoucher.value)
    : 0;

  const finalPrice = Math.max(totalPrice - discountAmount, 0);

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto bg-[#f5ebe0]">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>

        {/* 🧾 Customer Info */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="John Doe"
            value={fullName}
          />
          <label className="block mt-3 mb-1 font-medium">Phone Number</label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="123-456-7890"
            value={phoneNumber}
          />
          <label className="block mt-3 mb-1 font-medium">Address</label>
          <input
            className="input input-bordered w-full"
            type="text"
            placeholder="123 Main St"
            value={address}
          />
        </div>

        {/* 🏷️ Voucher Dropdown */}
        <div className="mb-6">
          <label className="block mb-1 font-medium">Select Voucher</label>
          <select
            className="select select-bordered w-full"
            value={selectedVoucher?.id?.toString() || ""}
            onChange={(e) => {
              const selected = voucherList?.find(
                (v) => v.id.toString() === e.target.value
              );
              setSelectedVoucher(selected);
            }}
          >
            <option value="">-- No Voucher --</option>
            {voucherList?.map((v) => (
              <option key={v.id} value={v.id.toString()}>
                {v.name} -{" "}
                {v.isPercentage ? `${v.value}% off` : `$${v.value} off`}
              </option>
            ))}
          </select>
        </div>

        {/* 🛒 Product List */}
        <div className="bg-white shadow-md rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Selected Products</h2>
          <div className="divide-y">
            {selectedItems.map((item: any) => (
              <div key={item.id} className="flex justify-between py-2">
                <div>
                  <p>{item.productEntity.name}</p>
                  <p className="text-sm text-gray-500">
                    ${item.productEntity.price} x {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.productEntity.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            {selectedVoucher && (
              <div className="flex justify-between text-green-600">
                <span>Voucher ({selectedVoucher.name}):</span>
                <span>- ${discountAmount.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-between font-bold text-lg">
            <span>Total:</span>
            <span>${finalPrice.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-success mt-4 w-full"
            onClick={handleCheckout}
          >
            Place Order
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
