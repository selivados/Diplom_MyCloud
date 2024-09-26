import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { IChangeFileData, IDownloadFileData, IFile } from "../../models";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface IFilesState {
  filesList: IFile[];
  isLoading: boolean;
  error: string;
}

const initialState: IFilesState = {
  filesList: [],
  isLoading: false,
  error: "",
};

export const getFilesList = createAsyncThunk(
  "files/getFilesList",
  async (storage_path: string | undefined, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/files/list/${storage_path}/`, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при получении списка файлов пользователя."
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const uploadFile = createAsyncThunk(
  "files/uploadFile",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/files/file/`, {
        method: "POST",
        headers: { Authorization: `Token ${token}` },
        body: formData,
      });

      if (!response.ok) {
        return rejectWithValue("Произошла ошибка при загрузке файла.");
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const changeFile = createAsyncThunk(
  "files/changeFile",
  async (fileData: IChangeFileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/files/file/${fileData.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(fileData),
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при изменении данных о файле."
        );
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const downloadFile = createAsyncThunk(
  "users/downloadFile",
  async (fileData: IDownloadFileData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_URL}/files/file/${fileData.id}/download/`,
        {
          method: "GET",
          headers: { Authorization: `Token ${token}` },
        }
      );

      if (!response.ok) {
        return rejectWithValue("Произошла ошибка при скачивании файла.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.download = fileData.file_name;
      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const getFileLink = createAsyncThunk(
  "files/getFileLink",
  async (fileId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/files/file/${fileId}/link/`, {
        method: "GET",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue(
          "Произошла ошибка при получении специальной ссылки на файл."
        );
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

export const deleteFile = createAsyncThunk(
  "users/deleteFile",
  async (fileId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_URL}/files/file/${fileId}/`, {
        method: "DELETE",
        headers: { Authorization: `Token ${token}` },
      });

      if (!response.ok) {
        return rejectWithValue("Произошла ошибка при удалении файла.");
      }
    } catch (error) {
      return rejectWithValue("Произошла ошибка со стороны сервера.");
    }
  }
);

const filesSlice = createSlice({
  name: "files",
  initialState,
  selectors: {
    filesState: (state) => state,
  },
  reducers: {
    clearFilesList: (state) => {
      state.filesList = [];
    },
    clearError: (state) => {
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFilesList.pending, (state) => {
        state.isLoading = true;
        state.error = "";
      })
      .addCase(getFilesList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filesList = action.payload;
      })
      .addCase(getFilesList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadFile.pending, (state) => {
        state.error = "";
      })
      .addCase(uploadFile.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(changeFile.pending, (state) => {
        state.error = "";
      })
      .addCase(changeFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(downloadFile.pending, (state) => {
        state.error = "";
      })
      .addCase(downloadFile.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(getFileLink.pending, (state) => {
        state.error = "";
      })
      .addCase(getFileLink.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteFile.pending, (state) => {
        state.error = "";
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { filesState } = filesSlice.selectors;
export const { clearFilesList, clearError } = filesSlice.actions;
export default filesSlice.reducer;
