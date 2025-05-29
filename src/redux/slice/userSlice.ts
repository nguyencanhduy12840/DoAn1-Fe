/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "../../types/User.ts";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "../../utils/axiosCustomize.ts";
import { Pagination } from "../../types/Pagination.ts";

interface UserState {
  user: User;
  isAuthenticated: boolean;
  listUsers: User[];
  pages: number;
  total: number;
}
const initialState: UserState = {
  user: {
    id: "",
    username: "",
    role: "",
    fullName: "",
    image: "",
    address: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
    refresh_token: "",
  },
  isAuthenticated: false,
  listUsers: [],
  pages: 0,
  total: 0,
};
type UserLogin = {
  username: string;
  password: string;
};
type UserRegister = {
  username: string;
  password: string;
  fullName: string;
};

export const updateUserInformation = createAsyncThunk(
  "user/updateUserInformation",
  async (updatedUser: User, { rejectWithValue }) => {
    try {
      const response = await axios.put<User>(
        "/users/updateInformation",
        updatedUser
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Error updating user information"
      );
    }
  }
);

export const changeUserPassword = createAsyncThunk(
  "user/changeUserPassword",
  async (
    {
      id,
      newPassword,
    }: {
      id: number;
      newPassword: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put("users/changePassword", {
        id,
        newPassword,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Error changing password");
    }
  }
);
export const login = createAsyncThunk(
  "user/login",
  async (body: UserLogin, thunkApi) => {
    const response = await axios.post<{ user: User; access_token: string }>(
      "auth/login",
      body,
      {
        signal: thunkApi.signal,
      }
    );
    return response.data;
  }
);

export const register = createAsyncThunk(
  "user/register",
  async (body: UserRegister, thunkApi) => {
    const response = await axios.post<User>("auth/register", body, {
      signal: thunkApi.signal,
    });
    return response.data;
  }
);

export const getAllUsers = createAsyncThunk(
  "user/getAll",
  async (body: { page: string; size: string }, thunkAPI) => {
    const response = await axios.get<{ meta: Pagination; result: User[] }>(
      `/users?page=${body.page}&size=${body.size}`,
      {
        signal: thunkAPI.signal,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk("user/logoutUser", async () => {
  await axios.post("/auth/logout");
});

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = {
        id: "",
        username: "",
        role: "",
        fullName: "",
        image: "",
        address: "",
        gender: "",
        birthday: "",
        phoneNumber: "",
        refresh_token: "",
      };
      state.isAuthenticated = false;
      localStorage.removeItem("access_token");
    },
  },
  extraReducers(builder) {
    builder
      .addCase(
        login.fulfilled,
        (
          state,
          action: PayloadAction<{
            user: User;
            access_token: string;
          }>
        ) => {
          state.user.id = action.payload.user.id;
          state.user.username = action.payload.user.username;
          state.user.role = action.payload.user.role;
          state.user.fullName = action.payload.user.fullName;
          state.user.image = action.payload.user.image;
          state.user.address = action.payload.user.address;
          state.user.birthday = action.payload.user.birthday;
          state.user.gender = action.payload.user.gender;
          state.user.phoneNumber = action.payload.user.phoneNumber;
          state.user.refresh_token = action.payload.access_token;
          state.isAuthenticated = true;
          localStorage.setItem("access_token", action.payload.access_token);
        }
      )
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.user.id = action.payload.id;
        state.user.fullName = action.payload.fullName;
        state.user.username = action.payload.username;
        state.user.birthday = action.payload.birthday;
        state.user.gender = action.payload.gender;
        state.user.address = action.payload.address;
        state.listUsers.push(action.payload);
      })
      .addCase(
        getAllUsers.fulfilled,
        (
          state,
          action: PayloadAction<{ meta: Pagination; result: User[] }>
        ) => {
          state.listUsers = action.payload.result;
          state.pages = action.payload.meta.pages;
          state.total = action.payload.meta.total;
        }
      )
      .addCase(changeUserPassword.fulfilled, (state, action) => {
        const index = state.listUsers.findIndex(
          (user) => user.id === action.payload.id
        );
        if (index !== -1) {
          state.listUsers[index] = action.payload;
        }
      })
      .addCase(
        updateUserInformation.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.user = action.payload;
        }
      );
  },
});
export const { logout } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;
