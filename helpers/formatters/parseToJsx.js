import HtmlToReact from "html-to-react";

export default function parseToJsx(html) {
  const htmlToReactParser = new HtmlToReact.Parser();
  const jsx = htmlToReactParser.parse(html);

  return jsx;
}