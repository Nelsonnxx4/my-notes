import { forwardRef, useEffect, useRef } from "react";

interface Props {
  defaultContent?: string;
  onChange: (html: string) => void;
}

const NoteContentEditor = forwardRef<HTMLDivElement, Props>(
  ({ defaultContent = "", onChange }, ref) => {
    const initialized = useRef(false);

    useEffect(() => {
      if (initialized.current) return;
      if (ref && "current" in ref && ref.current) {
        ref.current.innerHTML = defaultContent;
        initialized.current = true;
      }
    }, [defaultContent, ref]);

    return (
      <>
        <div
          ref={ref}
          contentEditable
          suppressContentEditableWarning
          aria-multiline="true"
          className="w-full min-h-[60vh] bg-transparent text-base leading-8 outline-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_img]:max-w-full [&_img]:rounded-lg [&_img]:my-2"
          data-placeholder="Start writing..."
          role="textbox"
          tabIndex={0}
          onInput={(e) => onChange(e.currentTarget.innerHTML)}
        />
        <style>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}</style>
      </>
    );
  },
);

NoteContentEditor.displayName = "NoteContentEditor";
export default NoteContentEditor;
