/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImportTicket } from "../../types/ImportTicket";
import { ReqImportTicket } from "../../types/dto/ReqImportTicket";
import axios from "../../utils/axiosCustomize";
import { Pagination } from "../../types/Pagination";
interface ImportTicketState {
  listImportTicket: ImportTicket[];
  pages: number;
  total: number;
}

const initialState: ImportTicketState = {
  listImportTicket: [],
  pages: 0,
  total: 0,
};

export const createImportTicket = createAsyncThunk(
  "/importTicket/create",
  async (body: ReqImportTicket, thunkApi) => {
    try {
      const response = await axios.post<ImportTicket>("/importtickets", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const getAllImportTicket = createAsyncThunk(
  "/importTicket/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{
      meta: Pagination;
      result: ImportTicket[];
    }>(`/importtickets?page=${body.page}&size=${body.size}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const confirmCompleteImportTicket = createAsyncThunk(
  "/importTicket/confirm",
  async (id: string, thunkApi) => {
    try {
      const response = await axios.get("/importtickets/complete/" + id, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const deleteImportTicket = createAsyncThunk(
  "/importTicket/delete",
  async (id: string, thunkAPI) => {
    await axios.delete(`importtickets/${id}`, { signal: thunkAPI.signal });
    return Number(id);
  }
);

const importTicketSlice = createSlice({
  name: "importTicket",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        createImportTicket.fulfilled,
        (state, action: PayloadAction<ImportTicket>) => {
          state.listImportTicket.push(action.payload);
        }
      )
      .addCase(
        getAllImportTicket.fulfilled,
        (
          state,
          action: PayloadAction<{
            meta: Pagination;
            result: ImportTicket[];
          }>
        ) => {
          state.listImportTicket = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(
        confirmCompleteImportTicket.fulfilled,
        (state, action: PayloadAction<ImportTicket>) => {
          state.listImportTicket.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listImportTicket[index].status = action.payload.status;
              return true;
            }
            return false;
          });
        }
      )
      .addCase(
        deleteImportTicket.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.listImportTicket = state.listImportTicket.filter(
            (ticket) => Number(ticket.id) !== action.payload
          );
        }
      );
  },
});

const importTicketReducer = importTicketSlice.reducer;
export default importTicketReducer;
