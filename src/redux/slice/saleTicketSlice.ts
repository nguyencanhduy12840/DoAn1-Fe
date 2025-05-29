/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ReqSaleTicket } from "../../types/dto/ReqSaleTicket";
import axios from "../../utils/axiosCustomize";
import { Pagination } from "../../types/Pagination";
import { OrderTicket } from "../../types/OrderTicket";
import { ReqSaleTicketAdmin } from "../../types/dto/ReqSaleTicketAdmin";

interface SaleTicketState {
  listSaleTicket: OrderTicket[];
  username: string;
  pages: number;
  total: number;
}

const initialState: SaleTicketState = {
  listSaleTicket: [],
  username: "",
  pages: 0,
  total: 0,
};

export const createSaleTicket = createAsyncThunk(
  "/saleTicket/create",
  async (body: ReqSaleTicket, thunkApi) => {
    try {
      const response = await axios.post<OrderTicket>(
        "/saletickets/client",
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

export const getAllSaleTickets = createAsyncThunk(
  "/saleTicket/getAll/client",
  async (username: string, thunkAPI) => {
    const response = await axios.get<OrderTicket[]>(
      `/saletickets/all/client/${username}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const getAllSaleTicketAdmin = createAsyncThunk(
  "/saleTicket/getAll/admin",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{
      meta: Pagination;
      result: OrderTicket[];
    }>(`/saletickets/all?page=${body.page}&size=${body.size}`, {
      signal: thunkAPI.signal,
    });
    return response.data;
  }
);

export const confirmDeliverySaleTicket = createAsyncThunk(
  "/saleTicket/confirmDelivery",
  async (id: string, thunkApi) => {
    try {
      const response = await axios.get("/saletickets/confirmDelivery/" + id, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const confirmCompleteSaleTicket = createAsyncThunk(
  "/saleTicket/confirmComplete",
  async (id: string, thunkApi) => {
    try {
      const response = await axios.get("/saletickets/confirmComplete/" + id, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error);
    }
  }
);

export const createSaleTicketAdmin = createAsyncThunk(
  "/saleTicket/admin/create",
  async (body: ReqSaleTicketAdmin, thunkApi) => {
    try {
      const response = await axios.post<OrderTicket>(
        "/saletickets/admin",
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

export const deleteSaleTicket = createAsyncThunk(
  "/saleTicket/delete",
  async (id: string, thunkAPI) => {
    await axios.delete(`saletickets/${id}`, { signal: thunkAPI.signal });
    return Number(id);
  }
);

const saleTicketSlice = createSlice({
  name: "saleTicket",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        createSaleTicket.fulfilled,
        (state, action: PayloadAction<OrderTicket>) => {
          state.listSaleTicket.push(action.payload);
        }
      )
      .addCase(
        getAllSaleTickets.fulfilled,
        (state, action: PayloadAction<OrderTicket[]>) => {
          state.listSaleTicket = action.payload;
        }
      )
      .addCase(
        getAllSaleTicketAdmin.fulfilled,
        (
          state,
          action: PayloadAction<{
            meta: Pagination;
            result: OrderTicket[];
          }>
        ) => {
          state.listSaleTicket = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(
        createSaleTicketAdmin.fulfilled,
        (state, action: PayloadAction<OrderTicket>) => {
          state.listSaleTicket.push(action.payload);
        }
      )
      .addCase(
        confirmDeliverySaleTicket.fulfilled,
        (state, action: PayloadAction<OrderTicket>) => {
          state.listSaleTicket.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listSaleTicket[index].status = action.payload.status;
              return true;
            }
            return false;
          });
        }
      )
      .addCase(
        confirmCompleteSaleTicket.fulfilled,
        (state, action: PayloadAction<OrderTicket>) => {
          state.listSaleTicket.find((item, index) => {
            if (item.id === action.payload.id) {
              state.listSaleTicket[index].status = action.payload.status;
              return true;
            }
            return false;
          });
        }
      )
      .addCase(
        deleteSaleTicket.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.listSaleTicket = state.listSaleTicket.filter(
            (ticket) => Number(ticket.id) !== action.payload
          );
        }
      );
  },
});

const saleTicketReducer = saleTicketSlice.reducer;
export default saleTicketReducer;
