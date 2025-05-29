/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Supplier } from "../../types/Supplier";
import axios from "../../utils/axiosCustomize.ts";
import { Pagination } from "../../types/Pagination";

interface SupplierState {
  listSuppliers: Supplier[];
  editingSupplier: Supplier | null;
  pages: number;
  total: number;
}

const initialState: SupplierState = {
  listSuppliers: [],
  editingSupplier: null,
  pages: 0,
  total: 0,
};

export const createSupplier = createAsyncThunk(
  "/supplier/create",
  async (body: Omit<Supplier, "id">, thunkAPI) => {
    try {
      const response = await axios.post<Supplier>("/suppliers", body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  "/supplier/update",
  async (body: Supplier, thunkAPI) => {
    try {
      const response = await axios.put<Supplier>(`/suppliers`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllSuppliers = createAsyncThunk(
  "/supplier/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{ meta: Pagination; result: Supplier[] }>(
      `/suppliers/all?page=${body.page}&size=${body.size}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const deleteSupplier = createAsyncThunk(
  "/supplier/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`suppliers/${id}`, {
        signal: thunkAPI.signal,
      });
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const supplierSlice = createSlice({
  name: "supplier",
  initialState,
  reducers: {
    startEditingSupplier: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const foundCategory =
        state.listSuppliers.find((item) => item.id === categoryId) || null;
      state.editingSupplier = foundCategory;
    },
    cancelEditingSupplier: (state) => {
      state.editingSupplier = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        createSupplier.fulfilled,
        (state, action: PayloadAction<Supplier>) => {
          state.listSuppliers.push(action.payload);
        }
      )
      .addCase(
        updateSupplier.fulfilled,
        (state, action: PayloadAction<Supplier>) => {
          state.listSuppliers.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listSuppliers[index] = action.payload;
              return true;
            }
            return false;
          });
          state.editingSupplier = null;
        }
      )
      .addCase(
        getAllSuppliers.fulfilled,
        (
          state,
          action: PayloadAction<{ meta: Pagination; result: Supplier[] }>
        ) => {
          state.listSuppliers = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        const index = state.listSuppliers.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.listSuppliers[index].status =
            !state.listSuppliers[index].status;
        }
      });
  },
});
export const { startEditingSupplier, cancelEditingSupplier } =
  supplierSlice.actions;
const supplierReducer = supplierSlice.reducer;
export default supplierReducer;
