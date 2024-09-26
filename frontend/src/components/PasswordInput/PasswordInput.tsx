import { FC, useState } from "react";

interface PasswordInputProps {
  password: string;
  setPassword: (password: string) => void;
  confirm: boolean;
  autoComplete: "on" | "off";
}

export const PasswordInput: FC<PasswordInputProps> = (props) => {
  const { password, setPassword, confirm, autoComplete } = props;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-floating mb-3">
      <input
        id={confirm ? "confirmPassword" : "password"}
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete={autoComplete}
        placeholder={confirm ? "Подтвердить пароль" : "Пароль"}
        className="form-control"
      />
      <label
        htmlFor={confirm ? "confirmPassword" : "password"}
        className="text-secondary"
      >
        {confirm ? "Подтвердить пароль" : "Пароль"}
      </label>
      {password && (
        <div
          role="button"
          onClick={() => setShowPassword(!showPassword)}
          className="position-absolute top-50 end-0 translate-middle-y text-secondary fs-5 me-3"
        >
          <i className={showPassword ? "bi bi-eye" : "bi bi-eye-slash"}></i>
        </div>
      )}
    </div>
  );
};
