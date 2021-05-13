import React from "react";
/*  import { Editor, EditorState, RichUtils } from "draft-js";
import LinkEditor from "./LinkEditor"; */
import "draft-js/dist/Draft.css";
import LinkEditorFC from "./LinkEditorFC";

const App = () => {
/*  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  );

  const handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setEditorState(newState);
      return 'handled';
    }

    return 'not-handled';
  }
 
  const onBoldClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
  }

  const onItalicClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
  } */

  // console.log(editorState);

  return (
    <div className="App">
      {/* <div style={{ border: "1px solid black" }}>
        <button onClick={onBoldClick}>B</button>
        <button onClick={onItalicClick}>I</button>
        <Editor
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          onChange={setEditorState}
        />
      </div> */}
      <br />
      <br />
      <br />
      <LinkEditorFC />
      {/* <LinkEditor /> */}

    </div>
  );
};

export default App;
