import { ChangeEvent, FC, FormEvent, useState } from "react";

import { Loader } from "../Loader";
import { usersState } from "../../redux/slices/usersSlice";
import {
  filesState,
  getFilesList,
  uploadFile,
} from "../../redux/slices/filesSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";

interface FileUploadFormProps {
  setShowForm: (show: boolean) => void;
}

export const FileUploadForm: FC<FileUploadFormProps> = ({ setShowForm }) => {
  const { storageOwner } = useAppSelector(usersState);
  const { isLoading } = useAppSelector(filesState);
  const [file, setFile] = useState<File | null>(null);
  const [comment, setComment] = useState("");
  const dispatch = useAppDispatch();

  const handleInputFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setFile(files[0]);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (file) {
      const formData = new FormData();
      formData.append("user", String(storageOwner?.id));
      formData.append("file", file);
      formData.append("comment", comment);

      dispatch(uploadFile(formData))
        .unwrap()
        .then(() => {
          console.log("Файл успешно загружен.");
          setComment("");
          setShowForm(false);
          dispatch(getFilesList(storageOwner?.storage_path));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="col-5">
      <input
        id="file"
        type="file"
        onChange={handleInputFileChange}
        className="form-control mb-3"
      />
      <div className="form-floating mb-3">
        <textarea
          id="comment"
          placeholder="Комментарий к файлу"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="form-control"
        ></textarea>
        <label htmlFor="comment">Комментарий</label>
      </div>
      <button
        type="submit"
        className="btn btn-primary mb-4"
        disabled={isLoading ? true : false}
      >
        {isLoading ? <Loader /> : "Загрузить"}
      </button>
    </form>
  );
};
