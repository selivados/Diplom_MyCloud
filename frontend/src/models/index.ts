export interface IUser {
  id: number;
  username: string;
  full_name: string;
  email: string;
  storage_path: string;
  is_admin: boolean;
}

export interface IFilesSize {
  size: number;
}

export interface IUserForAdmin {
  id: number;
  username: string;
  full_name: string;
  email: string;
  storage_path: string;
  is_admin: boolean;
  files: IFilesSize[];
}

export interface IRegisterFormData {
  username: string;
  fullname: string;
  email: string;
  password: string;
}

export interface ILoginFormData {
  username: string;
  password: string;
}

export interface IUpdateUserData {
  id: number;
  username?: string;
  fullname?: string;
  email?: string;
  password?: string;
  is_admin?: boolean;
}

export interface IFile {
  id: number;
  file_name: string;
  comment: string;
  size: number;
  uploaded_at: string;
  downloaded_at: string;
  special_link: string;
}

export interface IChangeFileData {
  id: number;
  file_name?: string;
  comment?: string | null;
}

export interface IDownloadFileData {
  id: number;
  file_name: string;
}
