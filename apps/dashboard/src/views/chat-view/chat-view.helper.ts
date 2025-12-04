import DOMPurify from "isomorphic-dompurify";
import { Marked } from "marked";

export const safeHtml = (text: string) => DOMPurify.sanitize(new Marked().parse(text) as string);
