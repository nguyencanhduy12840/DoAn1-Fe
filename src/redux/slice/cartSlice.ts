/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CartDTO } from "../../types/dto/CartDTO";
import axios from "../../utils/axiosCustomize";
import { ResCartEntity } from "../../types/dto/ResCartEntity";

import { CartDetail } from "../../types/dto/CartDetailDTO";

interface CartState {
  username: string;
  listOrderItem: CartDetail[];
  totalPrice: number;
}

const initialState: CartState = {
  username: "",
  listOrderItem: [],
  totalPrice: 0,
};
export const addToCart = createAsyncThunk(
  "cart/add",
  async (body: CartDTO, thunkApi) => {
    try {
      const response = await axios.post<ResCartEntity>("/carts", body, {
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error || "Add to cart failed");
    }
  }
);

export const deleteFromCart = createAsyncThunk(
  "cart/delete",
  async (
    { username, productIds }: { username: string; productIds: number[] },
    thunkApi
  ) => {
    try {
      const response = await axios.delete<ResCartEntity>("/carts", {
        params: {
          username,
          productId: productIds,
        },
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error || "Delete failed");
    }
  }
);

export const getCartByUser = createAsyncThunk(
  "cart/get",
  async (username: string, thunkApi) => {
    try {
      const response = await axios.get<ResCartEntity>("/carts", {
        params: { username },
        signal: thunkApi.signal,
      });
      return response.data;
    } catch (error: any) {
      return thunkApi.rejectWithValue(error || "Get cart failed");
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(
        addToCart.fulfilled,
        (state, action: PayloadAction<ResCartEntity>) => {
          state.username = action.payload.userEntity.username;
          state.listOrderItem = action.payload.cartDetailEntities;
          state.totalPrice = action.payload.sum;
        }
      )

      .addCase(
        getCartByUser.fulfilled,
        (state, action: PayloadAction<ResCartEntity>) => {
          console.log(action.payload);
          state.username = action.payload.userEntity.username;
          state.listOrderItem = action.payload.cartDetailEntities;
          state.totalPrice = action.payload.sum;
        }
      )

      .addCase(
        deleteFromCart.fulfilled,
        (state, action: PayloadAction<ResCartEntity>) => {
          state.username = action.payload.userEntity.username;
          state.listOrderItem = action.payload.cartDetailEntities;
          state.totalPrice = action.payload.sum;
        }
      );
  },
});

const cartReducer = CartSlice.reducer;
export default cartReducer;
