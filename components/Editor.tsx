import { MdEditor, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";

config({
  editorConfig: {
    languageUserDefined: {
      "en-US": {
        toolbarTips: {
          bold: "bold",
          underline: "underline",
          italic: "italic",
          strikeThrough: "strikeThrough",
          title: "title",
          sub: "subscript",
          sup: "superscript",
          quote: "quote",
          unorderedList: "unordered list",
          orderedList: "ordered list",
          task: "task list",
          codeRow: "inline code",
          code: "block-level code",
          link: "link",
          image: "image",
          table: "table",
          mermaid: "mermaid",
          katex: "formula",
          revoke: "revoke",
          next: "undo revoke",
          save: "save",
          prettier: "prettier",
          pageFullscreen: "fullscreen in page",
          fullscreen: "fullscreen",
          preview: "preview",
          htmlPreview: "html preview",
          catalog: "catalog",
          github: "source code",
        },
        titleItem: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
        },
        imgTitleItem: {
          link: "Add Img Link",
        },
        linkModalTips: {
          linkTitle: "Add Link",
          imageTitle: "Add Image",
          descLabel: "Desc:",
          descLabelPlaceHolder: "Enter a description...",
          urlLabel: "Link:",
          urlLabelPlaceHolder: "Enter a link...",
          buttonOK: "OK",
        },
        copyCode: {
          text: "Copy",
          successTips: "Copied!",
          failTips: "Copy failed!",
        },
        mermaid: {
          flow: "flow",
          sequence: "sequence",
          gantt: "gantt",
          class: "class",
          state: "state",
          pie: "pie",
          relationship: "relationship",
          journey: "journey",
        },
        katex: {
          inline: "inline",
          block: "block",
        },
      },
    },
  },
});

const Editor = ({
  text,
  setText,
}: {
  text: string;
  setText: (text: string) => void;
}) => {
  return (
    <div className="max-w-2xl">
      <MdEditor value={text} onChange={setText} language="en-US" />
    </div>
  );
};

export default Editor;
