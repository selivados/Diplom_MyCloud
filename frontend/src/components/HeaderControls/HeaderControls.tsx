import { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { logoutUser, usersState } from "../../redux/slices/usersSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

export const HeaderControls: FC = () => {
  const { currentUser } = useAppSelector(usersState);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        console.log("Пользователь успешно вышел из системы.");
        localStorage.removeItem("token");
        navigate("/");
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="d-flex gap-3">
      {["/", "/login"].includes(location.pathname) && (
        <Link to="/signup">
          <button type="button" className="btn btn-outline-primary">
            Регистрация
          </button>
        </Link>
      )}
      {["/", "/signup"].includes(location.pathname) && (
        <Link to="/login">
          <button type="button" className="btn btn-primary">
            Войти
          </button>
        </Link>
      )}
      {["/admin", "/storage"].includes(location.pathname) && (
        <div className="d-flex align-items-center gap-3">
          <span>{currentUser?.username}</span>
          <button
            type="button"
            onClick={handleLogout}
            className="btn btn-primary"
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
