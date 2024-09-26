import { FC } from "react";

export const Loader: FC = () => {
  return (
    <div className="d-flex justify-content-center">
      <div
        role="status"
        style={{ width: 30, height: 30 }}
        className="spinner-border text-light"
      ></div>
    </div>
  );
};
