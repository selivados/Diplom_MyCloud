import moment from "moment";
import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { FileUploadForm } from "../../components/FileUploadForm";
import { clearStorageOwner, usersState } from "../../redux/slices/usersSlice";
import {
  changeFile,
  clearError,
  clearFilesList,
  deleteFile,
  downloadFile,
  filesState,
  getFileLink,
  getFilesList,
} from "../../redux/slices/filesSlice";
import { formatFileSize, useAppDispatch, useAppSelector } from "../../hooks";

export const StoragePage: FC = () => {
  const { currentUser, storageOwner } = useAppSelector(usersState);
  const { filesList, isLoading, error } = useAppSelector(filesState);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getFilesList(storageOwner?.storage_path));

    return () => {
      dispatch(clearFilesList());
      dispatch(clearError());
      dispatch(clearStorageOwner());
    };
  }, [dispatch, storageOwner?.storage_path]);

  const handleGoBack = () => {
    navigate("/admin");
  };

  const handleEditFileName = (id: number, file_name: string) => {
    const newFileName = prompt("Укажите новое имя файла:", file_name);

    if (newFileName) {
      const newFileData = { id, file_name: newFileName };

      dispatch(changeFile(newFileData))
        .unwrap()
        .then(() => {
          console.log("Файл успешно переименован.");
          dispatch(getFilesList(storageOwner?.storage_path));
        })
        .catch((error) => console.log(error));
    }
  };

  const handleEditFileComment = (id: number, comment: string) => {
    const newFileComment = prompt(
      "Укажите новый комментарий к файлу:",
      comment
    );

    const newFileData = { id, comment: newFileComment };

    dispatch(changeFile(newFileData))
      .unwrap()
      .then(() => {
        console.log("Комментарий к файлу успешно изменён.");
        dispatch(getFilesList(storageOwner?.storage_path));
      })
      .catch((error) => console.log(error));
  };

  const handleDownloadFile = (id: number, file_name: string) => {
    const fileData = { id, file_name };

    dispatch(downloadFile(fileData))
      .unwrap()
      .then(() => {
        console.log("Файл успешно скачан.");
        dispatch(getFilesList(storageOwner?.storage_path));
      })
      .catch((error) => console.log(error));
  };

  const handleGetFileLink = (id: number) => {
    dispatch(getFileLink(id))
      .unwrap()
      .then((data) => {
        console.log("Специальная ссылка на файл успешно получена.");
        prompt("Специальная ссылка на файл:", data.special_link);
      })
      .catch((error) => console.log(error));
  };

  const handleDeleteFile = (id: number) => {
    if (confirm("Вы действительно хотите удалить файл?")) {
      dispatch(deleteFile(id))
        .unwrap()
        .then(() => {
          console.log("Файл успешно удалён.");
          dispatch(getFilesList(storageOwner?.storage_path));
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
        <div className="d-flex gap-3 mb-4">
          {currentUser?.is_admin && (
            <button
              type="button"
              onClick={handleGoBack}
              className="btn btn-outline-primary"
            >
              Назад
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className="btn btn-outline-primary"
          >
            Загрузить файл
          </button>
        </div>
        {showForm && <FileUploadForm setShowForm={setShowForm} />}
        {!isLoading && filesList.length === 0 && (
          <div
            className="alert alert-info text-center col-6 mx-auto mb-0"
            role="alert"
          >
            <h4 className="alert-heading">В хранилище нет файлов</h4>
            <span>Загрузите файлы, чтобы начать работу.</span>
          </div>
        )}
        {filesList.length > 0 && (
          <>
            <h2 className="text-center mt-0 mb-4">
              Файловое хранилище
              {currentUser?.is_admin ? ` (${storageOwner?.username})` : ""}
            </h2>
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th scope="col" className="col-1">
                    Имя файла
                  </th>
                  <th scope="col" className="col-3">
                    Комментарий
                  </th>
                  <th scope="col" className="text-end">
                    Размер
                  </th>
                  <th scope="col" className="text-center">
                    Дата загрузки
                  </th>
                  <th scope="col" className="text-center">
                    Дата последнего скачивания
                  </th>
                  <th scope="col" className="text-center">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody>
                {filesList.map((file) => (
                  <tr key={file.id}>
                    <td scope="row" className="align-top">
                      {file.file_name}
                    </td>
                    <td className="align-top">{file.comment}</td>
                    <td className="text-end align-top">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="text-center align-top">
                      {moment(file.uploaded_at).format("DD.MM.YYYY HH:mm")}
                    </td>
                    <td className="text-center align-top">
                      {file.downloaded_at
                        ? moment(file.downloaded_at).format("DD.MM.YYYY HH:mm")
                        : "-"}
                    </td>
                    <td className="text-center align-top">
                      <div className="d-flex justify-content-center gap-3">
                        <i
                          role="button"
                          title="Переименовать"
                          onClick={() =>
                            handleEditFileName(file.id, file.file_name)
                          }
                          className="bi bi-pencil-fill fs-5"
                        ></i>
                        <i
                          role="button"
                          title="Изменить комментарий"
                          onClick={() =>
                            handleEditFileComment(file.id, file.comment)
                          }
                          className="bi bi-pencil-square fs-5"
                        ></i>
                        <i
                          role="button"
                          title="Скачать"
                          onClick={() =>
                            handleDownloadFile(file.id, file.file_name)
                          }
                          className="bi bi-download fs-5"
                        ></i>
                        <i
                          role="button"
                          title="Поделиться"
                          onClick={() => handleGetFileLink(file.id)}
                          className="bi bi-share fs-5"
                        ></i>
                        <i
                          role="button"
                          title="Удалить"
                          style={{ color: "darkred" }}
                          onClick={() => handleDeleteFile(file.id)}
                          className="bi bi-trash fs-5"
                        ></i>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};
