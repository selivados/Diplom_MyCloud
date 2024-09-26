import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  clearError,
  clearUsersList,
  deleteUser,
  getUsersList,
  setStorageOwner,
  updateUser,
  usersState,
} from "../../redux/slices/usersSlice";
import { IFilesSize, IUser } from "../../models";
import { formatFileSize, useAppDispatch, useAppSelector } from "../../hooks";

export const AdminPage: FC = () => {
  const { currentUser, usersList, error } = useAppSelector(usersState);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getUsersList());

    return () => {
      dispatch(clearUsersList());
      dispatch(clearError());
    };
  }, [dispatch]);

  const getTotalFilesSize = (files: IFilesSize[]) => {
    if (files.length === 0) return "-";

    const totalFilesSize = files.reduce((total, file) => total + file.size, 0);
    return formatFileSize(totalFilesSize);
  };

  const handleChooseUser = (user: IUser) => {
    dispatch(setStorageOwner(user));
    navigate("/storage");
  };

  const handleChangeStatus = (id: number, is_admin: boolean) => {
    const newUserData = { id, is_admin: !is_admin };

    dispatch(updateUser(newUserData))
      .unwrap()
      .then(() => {
        console.log("Статус пользователя успешно изменён.");
        dispatch(getUsersList());
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteUser = (id: number) => {
    if (confirm("Вы действительно хотите удалить пользователя?")) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => {
          console.log("Пользователь успешно удалён.");
          dispatch(getUsersList());
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row justify-content-center my-5">
      <div className="col">
        {error && (
          <div className="alert alert-danger text-center mt-3" role="alert">
            {error}
          </div>
        )}
        <h2 className="text-center mt-0 mb-4">Список пользователей</h2>
        <table className="table align-middle">
          <thead className="table-light">
            <tr>
              <th scope="col">Логин</th>
              <th scope="col">Полное имя</th>
              <th scope="col">Email</th>
              <th scope="col" className="text-center">
                Статус администратора
              </th>
              <th scope="col" className="text-center">
                Количество файлов
              </th>
              <th scope="col" className="text-end">
                Размер файлов
              </th>
              <th scope="col" className="text-center">
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((user) => (
              <tr key={user.id}>
                <td scope="row">
                  <div
                    role="button"
                    onClick={() => handleChooseUser(user)}
                    className="text-secondary"
                  >
                    {user.username}
                  </div>
                </td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td className="text-center">
                  <div className="form-switch">
                    <input
                      id={`${user.username}status`}
                      type="checkbox"
                      role="button"
                      title="Изменить статус"
                      checked={user.is_admin ? true : false}
                      onChange={() =>
                        handleChangeStatus(user.id, user.is_admin)
                      }
                      disabled={currentUser?.id === user.id ? true : false}
                      className="form-check-input"
                    />
                  </div>
                </td>
                <td className="text-center">
                  {user.files.length ? user.files.length : "-"}
                </td>
                <td className="text-end">{getTotalFilesSize(user.files)}</td>
                <td className="text-center">
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={currentUser?.id === user.id ? true : false}
                    className="btn border-0 p-0"
                  >
                    <i
                      title="Удалить"
                      style={{ color: "darkred" }}
                      className="bi bi-trash fs-5"
                    ></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
