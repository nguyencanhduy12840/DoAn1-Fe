/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Voucher } from "../../types/Voucher";
import axios from "../../utils/axiosCustomize";
import { Pagination } from "../../types/Pagination";
interface VoucherState {
  listVouchers: Voucher[];
  editingVoucher: Voucher | null;
  pages: number;
  total: number;
}

const initialState: VoucherState = {
  listVouchers: [],
  editingVoucher: null,
  pages: 0,
  total: 0,
};

export const createVoucher = createAsyncThunk(
  "/voucher/create",
  async (body: Omit<Voucher, "id">, thunkApi) => {
    try {
      const response = await axios.post<Voucher>("vouchers", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateVoucher = createAsyncThunk(
  "/voucher/update",
  async (body: Voucher, thunkApi) => {
    try {
      const response = await axios.put<Voucher>("vouchers", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllVouchers = createAsyncThunk(
  "/voucher/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{
      meta: Pagination;
      result: Voucher[];
    }>(`/vouchers/all?page=${body.page}&size=${body.size}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const deleteVoucher = createAsyncThunk(
  "/voucher/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`vouchers/${id}`, {
        signal: thunkAPI.signal,
      });
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const voucherSlice = createSlice({
  name: "voucher",
  initialState,
  reducers: {
    startEditingVoucher: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const foundCategory =
        state.listVouchers.find((item) => item.id === categoryId) || null;
      state.editingVoucher = foundCategory;
    },
    cancelEditingVoucher: (state) => {
      state.editingVoucher = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        createVoucher.fulfilled,
        (state, action: PayloadAction<Voucher>) => {
          state.listVouchers.push(action.payload);
        }
      )
      .addCase(
        updateVoucher.fulfilled,
        (state, action: PayloadAction<Voucher>) => {
          state.listVouchers.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listVouchers[index] = action.payload;
              return true;
            }
            return false;
          });
          state.editingVoucher = null;
        }
      )
      .addCase(
        getAllVouchers.fulfilled,
        (
          state,
          action: PayloadAction<{
            meta: Pagination;
            result: Voucher[];
          }>
        ) => {
          state.listVouchers = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(deleteVoucher.fulfilled, (state, action) => {
        const index = state.listVouchers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.listVouchers[index].status = !state.listVouchers[index].status;
        }
      });
  },
});

export const { startEditingVoucher, cancelEditingVoucher } =
  voucherSlice.actions;
const voucherReducer = voucherSlice.reducer;
export default voucherReducer;
