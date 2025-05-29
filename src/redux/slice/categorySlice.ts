/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCustomize.ts";
import { Category } from "../../types/Category.ts";
import { Pagination } from "../../types/Pagination.ts";

interface CategoryState {
  listCategories: Category[];
  editingCategory: Category | null;
  pages: number;
  total: number;
}
const initialState: CategoryState = {
  listCategories: [],
  editingCategory: null,
  pages: 0,
  total: 0,
};

export const createCategory = createAsyncThunk(
  "category/create",
  async (body: Omit<Category, "id">, thunkApi) => {
    try {
      const response = await axios.post<Category>("category", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getCategoryById = createAsyncThunk(
  "/category/getById",
  async (id: string, thunkAPI) => {
    const response = await axios.get<Category>(`category/${id}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const getAllCategories = createAsyncThunk(
  "/category/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{ meta: Pagination; result: Category[] }>(
      `/category/all?page=${body.page}&size=${body.size}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const getAllCategoriesExist = createAsyncThunk(
  "/category/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{ meta: Pagination; result: Category[] }>(
      `/category/all?filter=status:true&page=${body.page}&size=${body.size}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const updateCategory = createAsyncThunk(
  "/category/update",
  async (body: Category, thunkAPI) => {
    try {
      const response = await axios.put<Category>(`/category`, body, {
        signal: thunkAPI.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "/category/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`category/${id}`, {
        signal: thunkAPI.signal,
      });
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

const categorySlide = createSlice({
  name: "category",
  initialState,
  reducers: {
    startEditingCategory: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const foundCategory =
        state.listCategories.find((item) => item.id === categoryId) || null;
      state.editingCategory = foundCategory;
    },
    cancelEditingCategory: (state) => {
      state.editingCategory = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        createCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.listCategories.push(action.payload);
        }
      )
      .addCase(
        getAllCategories.fulfilled,
        (
          state,
          action: PayloadAction<{ meta: Pagination; result: Category[] }>
        ) => {
          state.listCategories = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(
        updateCategory.fulfilled,
        (state, action: PayloadAction<Category>) => {
          state.listCategories.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listCategories[index] = action.payload;
              return true;
            }
            return false;
          });
          state.editingCategory = null;
        }
      )
      .addCase(deleteCategory.fulfilled, (state, action) => {
        const index = state.listCategories.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.listCategories[index].status =
            !state.listCategories[index].status;
        }
      });
  },
});

export const { startEditingCategory, cancelEditingCategory } =
  categorySlide.actions;

const categoryReducer = categorySlide.reducer;
export default categoryReducer;
