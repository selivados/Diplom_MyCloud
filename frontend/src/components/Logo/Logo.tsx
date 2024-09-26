import { FC } from "react";
import { Link } from "react-router-dom";

import { usersState } from "../../redux/slices/usersSlice";
import { useAppSelector } from "../../hooks";
import logo from "../../img/logo.png";

export const Logo: FC = () => {
  const { currentUser } = useAppSelector(usersState);

  return (
    <Link
      className="navbar-brand"
      to={currentUser ? `${currentUser.is_admin ? "/admin" : "/storage"}` : "/"}
    >
      <img src={logo} alt="MyCloud" height={60} />
      <span className="text-secondary align-middle fs-3 fw-semibold ms-2">
        MyCloud
      </span>
    </Link>
  );
};
