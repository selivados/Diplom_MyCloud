import { FC, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { PasswordInput } from "../../components/PasswordInput";
import { Loader } from "../../components/Loader";
import {
  registerUser,
  usersState,
  clearError,
} from "../../redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export const SignupPage: FC = () => {
  const { isLoading, error: serverError } = useAppSelector(usersState);
  const [username, setUsername] = useState("");
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //Проверка логина
    if (username.length < 4 || username.length > 20) {
      setError("Логин должен быть длиной от 4 до 20 символов.");
      return;
    }
    if (!/^[a-zA-Z0-9]+$/.test(username)) {
      setError("Логин должен содержать только латинские буквы и цифры.");
      return;
    }
    if (!/^[a-zA-Z]/.test(username)) {
      setError("Логин должен начинаться на букву.");
      return;
    }

    //Проверка имени и фамилии
    if (!fullname) {
      setError("Введите имя и фамилию.");
      return;
    }

    //Проверка Email
    if (!email) {
      setError("Введите адрес электронной почты.");
      return;
    }
    if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
      setError("Некорректный адрес электронной почты.");
      return;
    }

    // Проверка пароля
    if (password.length < 6) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setError("Пароль должен содержать хотя бы одну заглавную букву.");
      return;
    }
    if (!/\d/.test(password)) {
      setError("Пароль должен содержать хотя бы одну цифру.");
      return;
    }
    if (!/\W/.test(password)) {
      setError("Пароль должен содержать хотя бы один специальный символ.");
      return;
    }

    //Проверка подтверждающего пароля
    if (!confirmPassword) {
      setError("Подтвердите пароль.");
      return;
    }
    if (confirmPassword !== password) {
      setError("Введённые пароли не совпадают.");
      return;
    }

    setError("");
    const formData = { username, fullname, email, password };

    dispatch(registerUser(formData))
      .unwrap()
      .then(() => {
        console.log("Пользователь успешно зарегистрирован.");
        dispatch(clearError());
        navigate("/login");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col-4">
        <h2 className="text-center mt-0 mb-4">Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-floating mb-3">
            <input
              id="username"
              type="text"
              placeholder="Логин"
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
            />
            <label htmlFor="username" className="text-secondary">
              Логин
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="fullname"
              type="text"
              placeholder="Имя и Фамилия"
              autoComplete="off"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="form-control"
            />
            <label htmlFor="fullname" className="text-secondary">
              Имя и Фамилия
            </label>
          </div>
          <div className="form-floating mb-3">
            <input
              id="email"
              type="text"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-control"
            />
            <label htmlFor="email" className="text-secondary">
              Email
            </label>
          </div>
          <PasswordInput
            password={password}
            setPassword={setPassword}
            confirm={false}
            autoComplete="off"
          />
          <PasswordInput
            password={confirmPassword}
            setPassword={setConfirmPassword}
            confirm={true}
            autoComplete="off"
          />
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
            {isLoading ? <Loader /> : "Зарегистрироваться"}
          </button>
          <p className="text-center">
            Есть аккаунт? <Link to="/login">Войти в систему</Link>
          </p>
        </form>
      </div>
    </div>
  );
};
