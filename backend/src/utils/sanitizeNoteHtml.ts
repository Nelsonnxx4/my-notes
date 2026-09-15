import sanitizeHtml from "sanitize-html";

const allowedTags = [
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
];

export const sanitizeNoteHtml = (html?: string | null) => {
	if (!html) return html;

	return sanitizeHtml(html, {
		allowedTags,
		allowedAttributes: {
			a: ["href", "target", "rel"],
			img: ["src", "alt", "title"],
		},
		allowedSchemes: ["http", "https", "mailto"],
		allowedSchemesByTag: {
			img: ["http", "https"],
		},
		transformTags: {
			a: (_tagName, attribs) => ({
				tagName: "a",
				attribs: {
					...attribs,
					target: "_blank",
					rel: "noopener noreferrer",
				},
			}),
		},
	});
};
