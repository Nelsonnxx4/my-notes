import { useCallback, useState } from "react";
import type { Editor } from "@tiptap/react";

import { uploadImage } from "@/api/uploads.api";

export const useUploadEditorImage = (
  editor: Editor | null,
  onError?: (message: string) => void,
) => {
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const insertImage = useCallback(() => {
    if (!editor || isUploadingImage) return;

    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/png,image/jpeg,image/webp,image/gif";
    input.onchange = async () => {
      const file = input.files?.[0];

      if (!file) return;

      setIsUploadingImage(true);
      try {
        const uploaded = await uploadImage(file);

        editor
          .chain()
          .focus()
          .setImage({ src: uploaded.url, alt: file.name, title: file.name })
          .createParagraphNear()
          .run();
      } catch {
        onError?.("Image upload failed. Please try a smaller image.");
      } finally {
        setIsUploadingImage(false);
      }
    };

    input.click();
  }, [editor, isUploadingImage, onError]);

  return { insertImage, isUploadingImage };
};
