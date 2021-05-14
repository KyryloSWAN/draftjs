import React, {
  FC,
  useRef,
  useState,
  KeyboardEvent,
  MouseEvent,
  useEffect,
} from "react";
import {
  CompositeDecorator,
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  DraftDecoratorType,
  ContentBlock,
  RawDraftContentState,
  convertFromRaw,
} from "draft-js";
import { Options, stateToHTML } from "draft-js-export-html";
import { FaLink, FaUnlink } from "react-icons/fa";
import { isEntityTypeSelected } from "../utils/links_utils";
import { encodeLinkString, decodeContentToStr } from "../utils/encode_decode";

const styles = {
  root: {
    fontFamily: "'Georgia', serif",
    padding: 20,
    width: 600,
  },
  buttons: {
    marginBottom: 10,
  },
  urlInputContainer: {
    marginBottom: 10,
  },
  urlInput: {
    fontFamily: "'Georgia', serif",
    marginRight: 10,
    padding: 3,
  },
  editor: {
    border: "1px solid #ccc",
    cursor: "text",
    minHeight: 80,
    padding: 10,
  },
  button: {
    marginTop: 10,
    // textAlign: "center",
  },
  link: {
    color: "#3b5998",
    textDecoration: "underline",
  },
};

export interface LinkSpanProps {
  blockKey: string;
  end: number;
  start: number;
  decoratedText: string;
  contentState: ContentState;
  entityKey: string;
  offsetkey: string;
  children: React.ReactNode;
}

const LinkSpan = (props: LinkSpanProps) => {
  const { url } = props.contentState.getEntity(props.entityKey).getData();

  return <a href={url}>{props.children}</a>;
};

// Gets all the links entities in the contentBlock
// and add them via the callback
const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
): void => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

const decorator: DraftDecoratorType = new CompositeDecorator([
  {
    strategy: findLinkEntities,
    component: LinkSpan,
  },
]);

const sampleMarkup = 
// `🏳️‍🌈🇺🇦🔔🇺🇦<a href="http://www.f1.com">12345</a>2🔔`;
// perfect works 🏳️‍🌈🇺🇦🔔🇺😍👍🏽
// wrong ❤️❤️
`✊✋😀🤞🙏🏳️‍🌈🇺🇦🔔🇺😍👍🏽test<a href="http://www.f1.com">1</a>test2🔔`;


const rawContent: RawDraftContentState = encodeLinkString(sampleMarkup);
const blocks: ContentState = convertFromRaw(rawContent);

const LinkEditorFC: FC = () => {
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(blocks, decorator)
  );
  // const [editorState, setEditorState] = useState(() => EditorState.createWithContent(blocks, decorator));
  const [isURLInputOpen, showURLInput] = useState(false);
  const [urlValue, setURLValue] = useState("");
  const editorRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLinkEnabled, setLinkEnabled] = useState(false);
  const [isUnlinkEnabled, setUnlinkEnabled] = useState(false);

  useEffect(() => {
    if (isURLInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
    /* else if (!isURLInputOpen && editorRef.current) {
      ((editorRef.current as unknown) as Editor).focus();
    } */
  });

  interface MyOptions extends Options {
    defaultBlockTag?: any;
  }

  const options: MyOptions = {
    entityStyleFn: (entity) => {
      const entityType = entity.getType();
      if (entityType === "LINK") {
        const data = entity.getData();
        return {
          element: "a",
          attributes: {
            href: data.url,
            // target: "_blank",
            // rel: "noopener nofollow"
          },
        };
      }
    },
    defaultBlockTag: null,
  };

  const onFocusEditor = (): void => {
    if (editorRef.current) {
      (editorRef.current as unknown as Editor).focus();
    }
  };

  // const onFocusInput = (): void => {
  //   console.log("onFocusInput, inputRef.current=",inputRef.current );
  //   setTimeout(() => {
  //     if (isURLInputOpen && inputRef.current) {
  //       inputRef.current.focus()
  //     }}, 0);
  //   }
  // };

  const onEditorChange = (editorState: EditorState): void => {
    setEditorState(editorState);
    const selectionState = editorState.getSelection();
    if (selectionState?.isCollapsed()) {
      setLinkEnabled(false);
      setUnlinkEnabled(false);
    } else {
      setLinkEnabled(true);
      if (isEntityTypeSelected(editorState, "LINK")) {
        setUnlinkEnabled(true);
      } else {
        setUnlinkEnabled(false);
      }
    }
  };

  const logState = (): void => {
    const content = editorState.getCurrentContent();
    console.log(JSON.stringify(content.toMap()));
    console.log(JSON.stringify(content.toJS()));
    // console.log(decodeContentToStr(content));
  };

  const onURLChange = (e: any) => setURLValue(e.target.value);

  const promptForLink = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      const contentState = editorState.getCurrentContent();
      const startKey = editorState.getSelection().getStartKey();
      const startOffset = editorState.getSelection().getStartOffset();
      const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
      const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);

      let url = "";
      if (linkKey) {
        const linkInstance = contentState.getEntity(linkKey);
        url = linkInstance.getData().url;
      }
      showURLInput(true);
      setURLValue(url);
      // inputRef.current?.focus();
      // onFocusInput();
    }
  };

  const confirmLink = (
    e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
  ) => {
    e.preventDefault();
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url: urlValue }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity,
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
    showURLInput(false);
    setURLValue("");
  };

  const onLinkInputKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      confirmLink(e);
    }
  };

  const removeLink = (
    e: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>
  ) => {
    e.preventDefault();
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  const urlInput = (): JSX.Element => {
    if (isURLInputOpen) {
      return (
        <div style={styles.urlInputContainer}>
          <input
            onChange={onURLChange}
            ref={inputRef}
            style={styles.urlInput}
            type='text'
            value={urlValue}
            onKeyDown={onLinkInputKeyDown}
          />
          <button onMouseDown={confirmLink}>Confirm</button>
        </div>
      );
    } else {
      return <></>;
    }
  };

  // added by cz
  const logSelection = () => {
    onFocusEditor();
    /* const selectionState = editorState.getSelection();
    const anchorKey = selectionState.getAnchorKey();
    const currentContent = editorState.getCurrentContent();
    const currentContentBlock = currentContent.getBlockForKey(anchorKey);
    const start = selectionState.getStartOffset();
    const end = selectionState.getEndOffset();
    const selectedText = currentContentBlock.getText().slice(start, end);
    console.log("SelectionState:", selectionState.serialize());
    console.log("anchorKey:", anchorKey);
    console.log("currentContent:", currentContent.toJS());
    console.log("currentContentBlock:", currentContentBlock);
    console.log("start:", start);
    console.log("end:", selectedText);
    console.log("selectedText:", selectedText); */
    console.log("rawContent:", JSON.stringify(rawContent));
  };

  return (
    <div style={styles.root}>
      <div style={{ marginBottom: 10 }}>{sampleMarkup}</div>
      <div style={styles.buttons}>
        <button
          onMouseDown={promptForLink}
          style={{ marginRight: 10 }}
          disabled={!isLinkEnabled}
        >
          {/* Edit Link */}
          <FaLink />
        </button>
        <button onMouseDown={removeLink} disabled={!isUnlinkEnabled}>
          <FaUnlink />
          {/* Remove Link */}
        </button>
      </div>
      {urlInput()}
      <div style={styles.editor} onClick={onFocusEditor} id='editor-container'>
        <Editor
          editorState={editorState}
          onChange={onEditorChange}
          placeholder='Enter some text...'
          ref={editorRef}
        />
      </div>
      <input
        onClick={logState}
        style={styles.button}
        type='button'
        value='Log State'
      />
      <input
        onClick={logSelection}
        style={styles.button}
        type='button'
        value='Log Selection'
      />
      <br />
      <textarea
        className='source'
        placeholder='Editor Source'
        value={stateToHTML(editorState.getCurrentContent(), options)}
        style={{ width: "100%" }}
        rows={5}
        readOnly
      />
    </div>
  );
};

export default LinkEditorFC;
