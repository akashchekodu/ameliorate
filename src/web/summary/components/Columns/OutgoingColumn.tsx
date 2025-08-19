import { NorthEast } from "@mui/icons-material";
import { Divider, Typography } from "@mui/material";
import { Fragment } from "react";

import { Row } from "@/web/summary/components/Row";
import { AddNodeButtonGroup } from "@/web/topic/components/Node/AddNodeButtonGroup";
import { useEffectType } from "@/web/topic/diagramStore/nodeTypeHooks";
import { useOutgoingNodesByRelationDescription } from "@/web/topic/diagramStore/summary";
import { addableRelationsFrom } from "@/web/topic/utils/edge";
import { Node } from "@/web/topic/utils/graph";

interface Props {
  summaryNode: Node;
}

export const OutgoingColumn = ({ summaryNode }: Props) => {
  const outgoingByDescription = useOutgoingNodesByRelationDescription(summaryNode);
  const effectType = useEffectType(summaryNode.id);

  // edges always point from child toward parent right now, so outgoing nodes will always be parents
  const defaultParentAddableRelations = addableRelationsFrom(
    summaryNode.type,
    "parent",
    false,
    effectType,
  );

  const addableRelations = defaultParentAddableRelations;

  const AddButtons = (
    <div className="pb-1.5">
      <AddNodeButtonGroup fromNodeId={summaryNode.id} addableRelations={addableRelations} />
    </div>
  );

  return (
    <div className="flex flex-col">
      <Row title="Outgoing" Icon={NorthEast} addButtonsSlot={AddButtons} />

      {Object.keys(outgoingByDescription).length === 0 && (
        <Typography variant="body2" className="self-center">
          No nodes yet!
        </Typography>
      )}

      {Object.entries(outgoingByDescription).map(([relationDescription, nodes], index) => (
        <Fragment key={relationDescription}>
          {index > 0 && <Divider className="mx-2 my-1" />}

          <Row title={relationDescription} Icon={NorthEast} nodes={nodes} />
        </Fragment>
      ))}
    </div>
  );
};
