import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "../redux/store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export const formatFileSize = (size: number) => {
  const units = ["B", "KB", "MB", "GB", "TB"];

  for (const unit of units) {
    if (size < 1024) {
      return `${size.toFixed(1)} ${unit}`;
    }

    size = size / 1024;
  }
};
