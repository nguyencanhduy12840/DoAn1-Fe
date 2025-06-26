import { FaUser, FaShoppingCart } from "react-icons/fa";
import { useSelector } from "react-redux";
import { persistor, RootState, useAppDispatch } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  addToCart,
  deleteFromCart,
  getCartByUser,
} from "../../redux/slice/cartSlice";
import { toast } from "react-toastify";
import { logout, logoutUser } from "../../redux/slice/userSlice";

export default function Header() {
  const isLogin = useSelector((state: RootState) => state.user.isAuthenticated);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const listCartItem = useSelector(
    (state: RootState) => state.cart.listOrderItem
  );
  const username = useSelector((state: RootState) => state.user.user.username);
  const role = useSelector(
    (state: RootState) => state.user.user.roleEntity.name
  );
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const toggleUserMenu = () => setShowUserMenu((prev) => !prev);
  useEffect(() => {
    const fetchAllCartItem = async () => {
      try {
        const res = await dispatch(getCartByUser(username)).unwrap();
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (username) {
      fetchAllCartItem();
    }
  }, [dispatch, username]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("#user-menu")) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const cartTotalQty = listCartItem?.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotalPrice = listCartItem?.reduce((total, item) => {
    return selectedItems.includes(item.id)
      ? total + item.price * item.quantity
      : total;
  }, 0);

  const handleCheckboxChange = (itemId: number) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuantityChange = async (
    productId: number,
    currentQuantity: number,
    change: number
  ) => {
    try {
      if (currentQuantity === 1 && change === -1) {
        // Nếu số lượng hiện tại là 1 và người dùng giảm, thì xóa sản phẩm khỏi giỏ
        await dispatch(
          deleteFromCart({ username, productIds: [productId] })
        ).unwrap();
      } else {
        // Tăng hoặc giảm số lượng
        await dispatch(
          addToCart({ username, productId, quantity: change })
        ).unwrap();
      }

      // Refresh giỏ hàng sau mỗi thay đổi
      await dispatch(getCartByUser(username));
    } catch (error) {
      console.error("Thay đổi số lượng thất bại:", error);
    }
  };

  const handleCheckout = () => {
    const selectedProducts = listCartItem.filter((item) =>
      selectedItems.includes(item.id)
    );

    if (selectedProducts.length === 0) {
      toast("Please select at least one product to checkout.");
      return;
    }

    navigate("/checkout", { state: { selectedIds: selectedItems } });
  };

  return (
    <div className="drawer drawer-end z-50">
      <input id="cart-drawer" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content">
        <header className="navbar bg-[#ffc2d1] shadow-md px-4">
          <div className="w-[30%]">
            <a className="text-xl font-bold text-pink-600">FlowerShop</a>
          </div>

          <div className="flex items-center justify-between w-[70%]">
            <nav className="flex gap-4">
              <Link to="/" className="btn btn-ghost">
                Home
              </Link>
              <Link to="/product" className="btn btn-ghost">
                Products
              </Link>
            </nav>

            {isLogin ? (
              <div className="flex items-center gap-4 text-pink-700 text-lg">
                <div className="relative" id="user-menu">
                  <button className="btn btn-ghost" onClick={toggleUserMenu}>
                    <FaUser />
                  </button>

                  {showUserMenu && (
                    <ul className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                      {role === "ADMIN" && (
                        <li>
                          <Link
                            to="/admin"
                            className="block px-4 py-2 hover:bg-pink-100 text-sm"
                          >
                            Admin
                          </Link>
                        </li>
                      )}
                      <li>
                        <Link
                          to="/orderlist"
                          className="block px-4 py-2 hover:bg-pink-100 text-sm"
                        >
                          Order List
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/profile"
                          className="block px-4 py-2 hover:bg-pink-100 text-sm"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={async () => {
                            try {
                              await dispatch(logoutUser()); // gọi API xóa cookie
                              localStorage.removeItem("access_token");
                              localStorage.removeItem("refresh_token");
                              localStorage.removeItem("persist:user"); // XÓA dữ liệu redux-persist

                              persistor.purge(); // XÓA cache redux-persist trong bộ nhớ
                            } catch (error) {
                              console.error("Logout failed:", error);
                            } finally {
                              dispatch(logout()); // clear redux state
                              navigate("/login"); // chuyển hướng về login
                              toast.success("Logged out successfully");
                            }
                          }}
                          className="block w-full text-left px-4 py-2 hover:bg-pink-100 text-sm"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
                <label
                  htmlFor="cart-drawer"
                  className="btn btn-ghost drawer-button relative"
                >
                  <FaShoppingCart />
                  {cartTotalQty > 0 && (
                    <span className="badge badge-sm bg-red-500 text-white absolute -top-2 -right-2">
                      {cartTotalQty}
                    </span>
                  )}
                </label>
              </div>
            ) : (
              <div className="flex items-center gap-4 text-pink-700 text-lg">
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </button>
              </div>
            )}
          </div>
        </header>
      </div>

      <div className="drawer-side">
        <label htmlFor="cart-drawer" className="drawer-overlay"></label>
        <div className="menu p-4 w-80 min-h-full bg-white text-base-content">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-pink-600">Your Cart</h2>
            <label
              htmlFor="cart-drawer"
              className="btn btn-sm btn-circle btn-outline text-red-500"
            >
              ✕
            </label>
          </div>

          {/* Cart Items with Checkboxes */}
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh]">
            {listCartItem.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 items-start border p-2 rounded"
              >
                <input
                  type="checkbox"
                  className="checkbox mt-2"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
                <img
                  src={
                    "http://localhost:8080" + item.productEntity.productImage
                  }
                  alt={item.productEntity.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.productEntity.name}</p>
                  <p className="text-sm text-gray-600">
                    ${item.productEntity.price}
                  </p>
                  <div className="flex items-center mt-1 gap-2">
                    <button
                      className="btn btn-xs"
                      onClick={() =>
                        handleQuantityChange(
                          +item.productEntity.id,
                          item.quantity,
                          -1
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      className="btn btn-xs"
                      onClick={() =>
                        handleQuantityChange(
                          +item.productEntity.id,
                          item.quantity,
                          1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <p className="text-lg font-bold">
              Total: ${cartTotalPrice.toFixed(2)}
            </p>
            <button
              className="btn btn-primary w-full mt-2"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
