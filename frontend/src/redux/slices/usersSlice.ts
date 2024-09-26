import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  IUser,
  IUserForAdmin,
  IRegisterFormData,
  ILoginFormData,
  IUpdateUserData,
} from "../../models";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface IUsersState {
  currentUser: IUser | null;
  storageOwner: IUser | null;
  usersList: IUserForAdmin[];
  isLoading: boolean;
  error: string;
}

const initialState: IUsersState = {
  currentUser: null,
  storageOwner: null,
  usersList: [],
  isLoading: false,
  error: "",
};

export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (formData: IRegisterFormData, { rejectWithValue }) => {
    try {
      const data = {
        username: formData.username,
        full_name: formData.fullname,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch(`${BASE_URL}/users/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();

        if (error.username) {
          return rejectWithValue(error.username[0]);
        } else if (error.email) {
          return rejectWithValue(error.email[0]);
        }
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (formData: ILoginFormData, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/users/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        return rejectWithValue("Неверно введен логин или пароль.");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "users/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/logout/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при выходе пользователя из системы."
        );
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const getUsersList = createAsyncThunk(
  "users/getUsersList",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/`, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при получении списка пользователей."
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (userData: IUpdateUserData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/${userData.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при изменении данных о пользователе."
        );
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/users/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Произошла ошибка при удалении пользователя.");
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  selectors: {
    usersState: (state) => state,
  },
  reducers: {
    setStorageOwner: (state, action) => {
      state.storageOwner = action.payload;
    },
    clearStorageOwner: (state) => {
      state.storageOwner = null;
    },
    clearUsersList: (state) => {
      state.usersList = [];
    },
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutUser.pending, (state) => {
        state.error = "";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.currentUser = null;
        state.usersList = [];
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getUsersList.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getUsersList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = action.payload;
      })
      .addCase(getUsersList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.error = "";
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { usersState } = usersSlice.selectors;
export const {
  setStorageOwner,
  clearStorageOwner,
  clearUsersList,
  clearError,
} = usersSlice.actions;
export default usersSlice.reducer;
