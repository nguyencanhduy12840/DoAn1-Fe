/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CategoryDetail } from "../../types/CategoryDetail";
import axios from "../../utils/axiosCustomize.ts";
import { Pagination } from "../../types/Pagination.ts";

interface CategoryDetailState {
  listCategoriesDetail: CategoryDetail[];
  editingCategoryDetail: CategoryDetail | null;
  pages: number;
  total: number;
}

const initialState: CategoryDetailState = {
  listCategoriesDetail: [],
  editingCategoryDetail: null,
  pages: 0,
  total: 0,
};

export const deleteCategoryDetail = createAsyncThunk(
  "/categoryDetail/delete",
  async (id: string, thunkAPI) => {
    try {
      await axios.delete(`categorydetails/${id}`, {
        signal: thunkAPI.signal,
      });
      return { id };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);

export const createCategoryDetail = createAsyncThunk(
  "/categoryDetail/create",
  async (body: Omit<CategoryDetail, "id">, thunkApi) => {
    try {
      const response = await axios.post<CategoryDetail>(
        "categorydetails",
        body,
        {
          signal: thunkApi.signal,
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const updateCategoryDetail = createAsyncThunk(
  "/categoryDetail/update",
  async (body: CategoryDetail, thunkApi) => {
    try {
      const response = await axios.put<CategoryDetail>(
        "categorydetails",
        body,
        {
          signal: thunkApi.signal,
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllCategoriesDetail = createAsyncThunk(
  "/categoryDetail/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{
      meta: Pagination;
      result: CategoryDetail[];
    }>(`/categorydetails/all?page=${body.page}&size=${body.size}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

const categoryDetailSlice = createSlice({
  name: "categoryDetail",
  initialState,
  reducers: {
    startEditingCategoryDetail: (state, action: PayloadAction<string>) => {
      const categoryId = action.payload;
      const foundCategory =
        state.listCategoriesDetail.find((item) => item.id === categoryId) ||
        null;
      state.editingCategoryDetail = foundCategory;
    },
    cancelEditingCategoryDetail: (state) => {
      state.editingCategoryDetail = null;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        createCategoryDetail.fulfilled,
        (state, action: PayloadAction<CategoryDetail>) => {
          state.listCategoriesDetail.push(action.payload);
        }
      )
      .addCase(
        updateCategoryDetail.fulfilled,
        (state, action: PayloadAction<CategoryDetail>) => {
          state.listCategoriesDetail.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listCategoriesDetail[index] = action.payload;
              return true;
            }
            return false;
          });
          state.editingCategoryDetail = null;
        }
      )
      .addCase(
        getAllCategoriesDetail.fulfilled,
        (
          state,
          action: PayloadAction<{
            meta: Pagination;
            result: CategoryDetail[];
          }>
        ) => {
          state.listCategoriesDetail = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(deleteCategoryDetail.fulfilled, (state, action) => {
        const index = state.listCategoriesDetail.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.listCategoriesDetail[index].status =
            !state.listCategoriesDetail[index].status;
        }
      });
  },
});
export const { startEditingCategoryDetail, cancelEditingCategoryDetail } =
  categoryDetailSlice.actions;
const categoryDetailReducer = categoryDetailSlice.reducer;
export default categoryDetailReducer;
