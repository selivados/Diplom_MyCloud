import { FC } from "react";
import { Link } from "react-router-dom";

export const Footer: FC = () => {
  return (
    <footer className="container">
      <div className="row">
        <div className="col">
          <div className="container-fluid bg-light border-top">
            <div className="d-flex justify-content-between align-items-center px-1 py-4">
              <span className="text-secondary">&copy; MyCloud 2024</span>
              <div className="d-flex gap-4">
                <Link className="text-secondary" to="#">
                  <i className="bi bi-facebook fs-4"></i>
                </Link>
                <Link className="text-secondary" to="#">
                  <i className="bi bi-instagram fs-4"></i>
                </Link>
                <Link className="text-secondary" to="#">
                  <i className="bi bi-telegram fs-4"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
