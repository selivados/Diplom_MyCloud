import { FC } from "react";

export const NotFoundPage: FC = () => {
  return (
    <div className="row justify-content-center text-center my-5">
      <div className="col">
        <h1 className="text-secondary">404</h1>
        <h2>Страница не найдена</h2>
        <span>Неправильно набран адрес, или такой страницы больше нет.</span>
      </div>
    </div>
  );
};
