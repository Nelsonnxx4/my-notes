import DOMPurify from "dompurify";

/**
 * Notes are rich text, not arbitrary HTML. Keeping this allow-list in one place
 * means pasted content and server responses pass through the same safety boundary.
 */
export function sanitizeNoteHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p",
      "br",
      "strong",
      "em",
      "s",
      "code",
      "pre",
      "blockquote",
      "ul",
      "ol",
      "li",
      "a",
      "h2",
      "h3",
      "hr",
      "img",
      "input",
      "label",
      "div",
    ],
    ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "type", "checked", "data-type"],
    ALLOW_DATA_ATTR: false,
  });
}
