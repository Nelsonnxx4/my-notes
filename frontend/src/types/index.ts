import { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type NoteInfo = {
  id: number;
  name: string;
  noteId: string;
  heading: string;
  text: string;
};
