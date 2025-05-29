/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../../types/Product";
import { ProductDTO } from "../../types/dto/ProductDTO";
import axios from "../../utils/axiosCustomize.ts";
import { Pagination } from "../../types/Pagination.ts";
interface ProductState {
  listProducts: Product[];
  editingProduct: Product | null;
  pages: number;
  total: number;
}

const initialState: ProductState = {
  listProducts: [],
  editingProduct: null,
  pages: 0,
  total: 0,
};

export const createProduct = createAsyncThunk(
  "/products/create",
  async (body: Omit<ProductDTO, "id">, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("name", body.name);
      formData.append("price", body.price.toString());
      formData.append("quantity", body.quantity.toString());
      formData.append("description", body.description);

      if (body.productImage) {
        formData.append("productImage", body.productImage);
      }

      body.categoryDetailId.forEach((id) => {
        formData.append("categoryDetailId", id.toString());
      });

      const response = await axios.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const getAllProducts = createAsyncThunk(
  "/products/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{ meta: Pagination; result: Product[] }>(
      `/products/all?page=${body.page}&size=${body.size}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  "/products/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`products/${id}`, {
        signal: thunkAPI.signal,
      });
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "/products/update",
  async (body: ProductDTO, thunkAPI) => {
    try {
      const formData = new FormData();

      formData.append("id", body.id.toString());
      formData.append("name", body.name);
      formData.append("price", body.price.toString());
      formData.append("quantity", body.quantity.toString());
      formData.append("description", body.description);

      if (body.productImage) {
        formData.append("productImage", body.productImage);
      }

      body.categoryDetailId.forEach((id) => {
        formData.append("categoryDetailId", id.toString());
      });

      const response = await axios.put("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    startEditingProduct: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const foundCategory =
        state.listProducts.find((item) => item.id === categoryId) || null;
      state.editingProduct = foundCategory;
    },
    cancelEditingProduct: (state) => {
      state.editingProduct = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(createProduct.fulfilled, (state, action) => {
        state.listProducts.push(action.payload);
      })
      .addCase(
        getAllProducts.fulfilled,
        (
          state,
          action: PayloadAction<{ meta: Pagination; result: Product[] }>
        ) => {
          state.listProducts = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.listProducts.find((item, index) => {
          if (item.id === action.payload.id) {
            state.listProducts[index] = action.payload;
            return true;
          }
          return false;
        });
        state.editingProduct = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const index = state.listProducts.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.listProducts[index].status = !state.listProducts[index].status;
        }
      });
  },
});
export const { startEditingProduct, cancelEditingProduct } =
  productSlice.actions;
const productReducer = productSlice.reducer;
export default productReducer;
