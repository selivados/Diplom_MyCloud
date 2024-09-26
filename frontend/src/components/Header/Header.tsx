import { FC } from "react";

import { NavBar } from "../NavBar";

export const Header: FC = () => {
  return (
    <header className="container">
      <div className="row">
        <div className="col">
          <NavBar />
        </div>
      </div>
    </header>
  );
};
