import { useCallback, type RefObject } from "react";

export const useEditorActions = (editorRef: RefObject<HTMLDivElement | null>) => {
  const execFormat = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      editorRef.current?.focus();
    },
    [editorRef],
  );

  const insertImage = useCallback(() => {
    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";
    input.onchange = () => {
      const file = input.files?.[0];

      if (!file) return;
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;

        editorRef.current?.focus();
        document.execCommand("insertImage", false, dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }, [editorRef]);

  return { execFormat, insertImage };
};
