import { type ButtonProps, type SxProps, useTheme } from "@mui/material";
import { memo, useContext, useEffect, useState } from "react";

import { useSessionUser } from "@/web/common/hooks";
import { openContextMenu } from "@/web/common/store/contextMenuActions";
import { clearNewlyAddedNode, isNodeNewlyAdded } from "@/web/common/store/ephemeralStore";
import { CommonIndicatorGroup } from "@/web/topic/components/Indicator/Base/CommonIndicatorGroup";
import {
  BottomDiv,
  LeftCornerStatusIndicators,
  MiddleDiv,
  NodeBox,
  NodeTypeDiv,
  NodeTypeSpan,
  RightCornerContentIndicators,
  StyledTextareaAutosize,
  TopDiv,
} from "@/web/topic/components/Node/EditableNode.styles";
import { WorkspaceContext } from "@/web/topic/components/TopicWorkspace/WorkspaceContext";
import { setCustomNodeType, setNodeLabel } from "@/web/topic/store/actions";
import { useUserCanEditTopicData } from "@/web/topic/store/userHooks";
import { Node } from "@/web/topic/utils/graph";
import { nodeDecorations } from "@/web/topic/utils/node";
import { useUnrestrictedEditing } from "@/web/view/actionConfigStore";
import { setSelected, useIsGraphPartSelected } from "@/web/view/selectedPartStore";
import { useFillNodesWithColor } from "@/web/view/userConfigStore";

interface Props {
  node: Node;
  className?: string;
}

const EditableNodeBase = ({ node, className = "" }: Props) => {
  const { sessionUser } = useSessionUser();
  const userCanEditTopicData = useUserCanEditTopicData(sessionUser?.username);

  const [textAreaSelected, setTextAreaSelected] = useState(false);

  const unrestrictedEditing = useUnrestrictedEditing();
  const fillNodesWithColor = useFillNodesWithColor();
  const selected = useIsGraphPartSelected(node.id);
  const context = useContext(WorkspaceContext);

  const theme = useTheme();
  const textAreaId = `${node.id}-${context}-textarea`;

  useEffect(() => {
    if (!isNodeNewlyAdded(node.id, context)) return;

    clearNewlyAddedNode();

    // Focus newly added node's text.
    // Using timeout because textarea doesn't pull focus via `.focus()` without it. textarea is in DOM at this point, so I'm not sure why.
    setTimeout(() => {
      // Using getElementById instead of ref because ref.current is null after the timeout runs, unless timeout = 0 ms.
      // But when timeout = 0 ms, while focus is successfully pulled to the textarea, focus is pulled back to document body afterwards for some reason.
      // Think that's something to do with how we're rendering the diagram - it doesn't happen for details/table nodes.
      const textAreaEl = document.getElementById(textAreaId) as HTMLTextAreaElement | null;
      textAreaEl?.focus();
      textAreaEl?.setSelectionRange(0, textAreaEl.value.length);
    }, 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- we don't care about re-focusing after initial render
  }, []);

  const nodeDecoration = nodeDecorations[node.type];
  const color = theme.palette[node.type].main;
  const NodeIcon = nodeDecoration.NodeIcon;
  const typeText = node.data.customType ?? nodeDecoration.title;

  const customizable = userCanEditTopicData && (unrestrictedEditing || node.type === "custom");

  const backgroundColorType: ButtonProps["color"] =
    fillNodesWithColor || node.type === "custom" ? node.type : "paperPlain";

  // TODO: use `fill-node`/`no-fill-node` class, and extract these to styles file; not sure how to use type-specific colors without js though? maybe css vars for type-specific colors, and a var for the node type that's scoped to the current node?
  const nodeStyles: SxProps =
    fillNodesWithColor || node.type === "custom" // since custom is white, it can't be used as the border color because it doesn't contrast against the white background; so just treat custom as if it's filled with color
      ? {
          backgroundColor: color,
          borderColor: "black",
        }
      : {
          backgroundColor: "white",
          borderColor: color,

          [NodeTypeDiv.toString()]: {
            backgroundColor: color,
            // anti-aliasing between white node background and colored border/icon background creates a gray line - add colored shadow to hide this https://stackoverflow.com/a/40100710/8409296
            // 0.5px spread instead of 1px because 1px creates a really thin shadow on the bottom/right, which can be seen
            // more clearly e.g. when selecting a benefit node (black shadow against bright background)
            boxShadow: `-1px -1px 0px 0.5px ${color}`,
          },

          [`&.selected ${NodeTypeDiv.toString()}`]: {
            // Match the shadow size of not-selected nodes
            boxShadow: `-1px -1px 0px 0.5px black`,
          },

          [`&.spotlight-secondary ${NodeTypeDiv.toString()}`]: {
            // Match the shadow size of not-selected nodes
            boxShadow: `-1px -1px 0px 0.5px ${theme.palette.info.main}`,
          },
        };

  return (
    <NodeBox
      className={
        className +
        // allow other components to apply conditional css related to this node, e.g. when it's hovered/selected
        // separate from react-flow__node because sometimes nodes are rendered outside of react-flow (e.g. details pane), and we still want to style these
        " diagram-node" +
        (selected ? " selected" : "")
      }
      onClick={() => setSelected(node.id)}
      onContextMenu={(event) => openContextMenu(event, { node })}
      role="button"
      sx={nodeStyles}
    >
      <TopDiv className="flex h-6 items-center justify-between">
        {/* pb/pr-0.5 to have 2px of space below/right, to match the 2px border of the node that's above/left of this node type div */}
        <NodeTypeDiv className="flex h-6 items-center rounded-br rounded-tl pb-0.5 pr-0.5">
          <NodeIcon className="mx-1 size-3.5" />
          <NodeTypeSpan
            contentEditable={customizable}
            suppressContentEditableWarning // https://stackoverflow.com/a/49639256/8409296
            onBlur={(event) => {
              const text = event.target.textContent?.trim();
              if (text && text !== nodeDecoration.title && text !== node.data.customType)
                setCustomNodeType(node, text);
            }}
            className={
              "pr-1 text-sm leading-normal" +
              // without nopan, clicking on the span won't let you edit text
              (customizable ? " nopan" : "")
            }
          >
            {typeText}
          </NodeTypeSpan>
        </NodeTypeDiv>
        <CommonIndicatorGroup graphPart={node} />
      </TopDiv>
      {/* grow to fill out remaining space with this div because it contains the textarea */}
      <MiddleDiv className="flex grow px-1 pb-2 pt-1">
        <StyledTextareaAutosize
          id={textAreaId}
          // Change key if `node.data.label` changes so that textarea re-renders with new default value.
          // This is mainly intended for when the label changes from an external source
          // e.g. undo/redo, changing from the node in the details pane while this one is in the diagram, etc.
          key={textAreaId + node.data.label}
          placeholder="Enter text..."
          defaultValue={node.data.label}
          maxRows={3}
          onClick={(event) => {
            // Track selection of the textbox separate from node selection so that we can allow operations
            // like context menu & dragging to be text-specific when interacting with the text (e.g.
            // highlighting specific words, right-click search-with-google), vs node-specific when
            // interacting with the node (e.g. panning, right-click delete/show/hide).
            // It's a bit janky that we're setting this on click and unsetting on blur (as opposed
            // to onclick/onclickaway or onfocus/onblur), but onclickaway isn't a native thing, and
            // onfocus doesn't work because context menu events happen based on the focused element,
            // so we can't conditionally allow custom context menu vs browser context menu based on
            // whether or not the text area is focused.
            if (!textAreaSelected) setTextAreaSelected(true);
            // Prevent selecting node when we want to just edit text.
            // Particularly important for enabling text editing in details pane without selecting the node.
            event.stopPropagation();
          }}
          onContextMenu={(event) => {
            if (textAreaSelected) {
              // use chrome's context menu instead of our custom context menu if we're editing the text area
              // because in this case, we probably want the context menu to be based on the text
              event.stopPropagation();
            }
          }}
          onBlur={(event) => {
            if (textAreaSelected) setTextAreaSelected(false);
            if (event.target.value !== node.data.label) setNodeLabel(node, event.target.value);
          }}
          className={textAreaSelected ? "nopan" : ""} // allow regular text input drag functionality without using reactflow's pan behavior
          // Previously required selecting a node before editing its text, because oftentimes you'll
          // want to select a node to view more details and the editing will be distracting, but
          // "cursor: pointer" on the node box allows selecting the node without clicking the text.
          // We'll want to keep an eye out on if selecting vs editing is annoying on mobile, because
          // of the lack of hover to convey which one your click will perform.
          readOnly={!userCanEditTopicData}
          spellCheck="false" // often may use terms not in dictionary, and we override browser context menu so we can't "add to dictionary"
        />
      </MiddleDiv>
      <BottomDiv className="relative">
        {node.type !== "rootClaim" && ( // root claim indicators don't seem very helpful
          <>
            {/* TODO?: how to make corner indicators not look bad in the table? they're cut off */}
            <LeftCornerStatusIndicators
              graphPartId={node.id}
              color={backgroundColorType}
              notes={node.data.notes}
            />
            <RightCornerContentIndicators
              graphPartId={node.id}
              graphPartType="node"
              color={backgroundColorType}
            />
          </>
        )}
      </BottomDiv>
    </NodeBox>
  );
};

export const EditableNode = memo(EditableNodeBase);
