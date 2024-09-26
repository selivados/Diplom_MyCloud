import { FC } from "react";

import { Logo } from "../Logo";
import { HeaderControls } from "../HeaderControls";

export const NavBar: FC = () => {
  return (
    <nav className="navbar bg-body-tertiary border-bottom px-1">
      <div className="container-fluid">
        <Logo />
        <HeaderControls />
      </div>
    </nav>
  );
};
