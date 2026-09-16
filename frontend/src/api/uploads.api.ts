import { api } from "./axios";

export interface UploadedImage {
  url: string;
  path: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export const uploadImage = async (file: File): Promise<UploadedImage> => {
  const formData = new FormData();

  formData.append("image", file);

  const { data } = await api.post<UploadedImage>("/uploads/images", formData);

  return data;
};
