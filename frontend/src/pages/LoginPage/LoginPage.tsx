import { FC, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PasswordInput } from "../../components/PasswordInput";
import { Loader } from "../../components/Loader";
import {
  loginUser,
  clearError,
  usersState,
  setStorageOwner,
} from "../../redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export const LoginPage: FC = () => {
  const { isLoading, error: serverError } = useAppSelector(usersState);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username) {
      setError("Введите логин.");
      return;
    }

    if (!password) {
      setError("Введите пароль.");
      return;
    }

    setError("");
    const formData = { username, password };

    dispatch(loginUser(formData))
      .unwrap()
      .then((data) => {
        console.log("Пользователь успешно вошёл в свою учетную запись.");
        dispatch(clearError());
        localStorage.setItem("token", data.token);

        if (data.user.is_admin) {
          navigate("/admin");
        } else {
          dispatch(setStorageOwner(data.user));
          navigate("/storage");
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-4">
        <h2 className="text-center mt-0 mb-4">Вход</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              id="username"
              type="text"
              placeholder="Логин"
              autoComplete="on"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
            <label htmlFor="username" className="text-secondary">
              Логин
            </label>
          </div>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            confirm={false}
            autoComplete="on"
          />
          <div className="form-check mb-4">
            <input
              id="rememberMe"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-check-input"
            />
            <label className="form-check-label" htmlFor="rememberMe">
              Запомнить меня
            </label>
          </div>
          {error && (
            <div className="alert alert-danger mt-3" role="alert">
              {error}
            </div>
          )}
          {serverError && (
            <div className="alert alert-danger mt-3" role="alert">
              {serverError}
            </div>
          )}
          <button
            type="submit"
            style={{ padding: 13 }}
            className="btn btn-primary fs-5 w-100 mb-5"
            disabled={isLoading ? true : false}
          >
            {isLoading ? <Loader /> : "Войти"}
          </button>
          <p className="text-center">
            Нет аккаунта? <Link to="/signup">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
