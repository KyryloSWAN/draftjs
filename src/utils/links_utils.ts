import type { EditorState, ContentBlock } from "draft-js";

export type EntityDescription = {
  entityKey: string;
  blockKey: string;
  startOffset: number;
  endOffset: number;
};

function getEntityAtOffset(
  block: ContentBlock,
  offset: number
): EntityDescription | null {
  const entityKey = block.getEntityAt(offset);
  if (entityKey == null) {
    return null;
  }
  let startOffset = offset;
  while (startOffset > 0 && block.getEntityAt(startOffset - 1) === entityKey) {
    startOffset -= 1;
  }
  let endOffset = startOffset;
  const blockLength = block.getLength();
  while (
    endOffset < blockLength &&
    block.getEntityAt(endOffset + 1) === entityKey
  ) {
    endOffset += 1;
  }
  return {
    entityKey,
    blockKey: block.getKey(),
    startOffset,
    endOffset: endOffset + 1,
  };
}

function getEntityAtCursor(editorState: EditorState): EntityDescription | null {
  const selection = editorState.getSelection();
  const startKey = selection.getStartKey();
  const startBlock = editorState.getCurrentContent().getBlockForKey(startKey);
  const startOffset = selection.getStartOffset();
  if (selection.isCollapsed()) {
    // Get the entity before the cursor (unless the cursor is at the start).
    return getEntityAtOffset(
      startBlock,
      startOffset === 0 ? startOffset : startOffset - 1
    );
  }
  if (startKey !== selection.getEndKey()) {
    return null;
  }
  const endOffset = selection.getEndOffset();
  const startEntityKey = startBlock.getEntityAt(startOffset);
  for (let i = startOffset; i < endOffset; i++) {
    const entityKey = startBlock.getEntityAt(i);
    if (entityKey == null || entityKey !== startEntityKey) {
      return null;
    }
  }
  return {
    entityKey: startEntityKey,
    blockKey: startBlock.getKey(),
    startOffset: startOffset,
    endOffset: endOffset,
  };
}

function cursorEntityType(editorState: EditorState) {
  const cursorEntity = getEntityAtCursor(editorState);
  const currentContent = editorState.getCurrentContent();
  if (cursorEntity) {
    const cursorFullEntity = currentContent.getEntity(cursorEntity.entityKey);
    return cursorFullEntity.getType();
  }
}

/*
  return true if entity with entityType selected in draft-js Editor with editorState state
*/
export const isEntityTypeSelected = (
  editorState: EditorState,
  entityType: string
) => {
  if (cursorEntityType(editorState) === entityType) {
    return true;
  } else return false;
};
