import { MdEditor, ToolbarTips, config } from "md-editor-rt";
import "md-editor-rt/lib/style.css";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

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
        } as ToolbarTips,
        titleItem: {
          h1: "h1",
          h2: "h2",
          h3: "h3",
          h4: "h4",
          h5: "h5",
          h6: "h6",
        },
        imgTitleItem: {
          upload: "Upload Image",
          link: "Enter Image Link",
          clip2upload: "Clip to upload",
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
        clipModalTips: {
          title: "Clip to Upload",
          buttonUpload: "Upload",
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
  const onUploadImg = async (
    files: File[],
    callback: (urls: string[]) => void
  ) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise<string>(async (resolve, reject) => {
          try {
            const uploadedUrl = await uploadImageToCloudinary(file);
            resolve(uploadedUrl);
          } catch (error) {
            reject(error);
          }
        });
      })
    );

    callback(res.map((item) => item));
  };

  return (
    <div className="max-w-2xl">
      <MdEditor
        value={text}
        onChange={setText}
        language="en-US"
        previewTheme="github"
        codeTheme="github"
        toolbarsExclude={["github", "htmlPreview", "catalog"]}
        onUploadImg={onUploadImg}
      />
    </div>
  );
};

export default Editor;
