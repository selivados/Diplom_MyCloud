import { FC } from "react";

import "./homePage.css";

export const HomePage: FC = () => {
  return (
    <div className="banner my-4 d-flex justify-content-center align-items-center">
      <div className="text-center text-white">
        <p className="fs-1 fw-medium mb-1">
          Добро пожаловать в облачное хранилище MyCloud!
        </p>
        <p className="fs-4">
          Для начала работы с сервисом войдите в свою учетную запись или
          зарегистрируйтесь
        </p>
      </div>
    </div>
  );
};
