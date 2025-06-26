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
  refreshToken: string;
  accessToken: string;
}
const initialState: UserState = {
  user: {
    id: "",
    username: "",
    roleEntity: {
      id: "",
      name: "",
      description: "",
    },
    fullName: "",
    image: "",
    address: "",
    gender: "",
    birthday: "",
    phoneNumber: "",
  },
  refreshToken: "",
  accessToken: "",
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
    const response = await axios.post<{ user: User; accessToken: string }>(
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
        roleEntity: {
          id: "",
          name: "",
          description: "",
        },
        fullName: "",
        image: "",
        address: "",
        gender: "",
        birthday: "",
        phoneNumber: "",
      };
      state.refreshToken = "";
      state.accessToken = "";
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
            accessToken: string;
            refreshToken?: string;
          }>
        ) => {
          const { user, accessToken, refreshToken } = action.payload;
          console.log("✅ accessToken:", accessToken);
          console.log("✅ refreshToken:", refreshToken);
          console.log("✅ user:", user);
          state.user = {
            ...user,
          };
          state.refreshToken = refreshToken ?? "";
          state.accessToken = accessToken;
          state.isAuthenticated = true;

          localStorage.setItem("access_token", accessToken);
          if (refreshToken) {
            localStorage.setItem("refresh_token", refreshToken);
          }
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
