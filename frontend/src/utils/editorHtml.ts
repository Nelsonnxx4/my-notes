import DOMPurify from "dompurify";

const SANITIZE_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "h1",
    "h2",
    "h3",
    "a",
    "img",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "src", "alt", "title"],
};

export function sanitizeEditorHtml(html: string | null | undefined): string {
  return DOMPurify.sanitize(html ?? "", SANITIZE_CONFIG);
}

export function textFromHtml(html: string): string {
  return (
    new DOMParser().parseFromString(html, "text/html").body.textContent ?? ""
  );
}

export function firstImageFromHtml(html: string): string | null {
  const image = new DOMParser()
    .parseFromString(html, "text/html")
    .querySelector("img");

  return image?.getAttribute("src") ?? null;
}

export function isEditorHtmlEmpty(html: string): boolean {
  return !textFromHtml(html).trim() && !/<img[\s>]/i.test(html);
}

export function parseEditorStats(html: string) {
  const text = textFromHtml(html);
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const lines = Math.max(
    1,
    (html.match(/<br|<\/p>|<\/li>|<\/h[1-6]>/gi) ?? []).length + 1,
  );

  return { words, chars: text.length, lines };
}
