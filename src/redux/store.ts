// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import userReducer from "./slice/userSlice.ts";
import categoryReducer from "./slice/categorySlice.ts";
import categoryDetailReducer from "./slice/categoryDetailSlice.ts";
import productReducer from "./slice/productSlice.ts";
import supplierReducer from "./slice/supplierSlice.ts";
import voucherReducer from "./slice/voucherSlice.ts";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import cartReducer from "./slice/cartSlice.ts";
import saleTicketReducer from "./slice/saleTicketSlice.ts";
import importTicketReducer from "./slice/importTicketSlice.ts";

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const persistedUserReducer = persistReducer(userPersistConfig, userReducer);

export const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    category: categoryReducer,
    categoryDetail: categoryDetailReducer,
    product: productReducer,
    supplier: supplierReducer,
    voucher: voucherReducer,
    cart: cartReducer,
    saleTicket: saleTicketReducer,
    importTicket: importTicketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
