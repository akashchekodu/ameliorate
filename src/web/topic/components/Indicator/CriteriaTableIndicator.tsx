import { TableChartOutlined } from "@mui/icons-material";
import { memo, useCallback } from "react";

import { ViewIndicator } from "@/web/topic/components/Indicator/Base/ViewIndicator";
import { useNode, useNodeChildren } from "@/web/topic/diagramStore/nodeHooks";
import { Node, ProblemNode } from "@/web/topic/utils/graph";
import { viewCriteriaTable } from "@/web/view/currentViewStore/filter";

const isProblem = (node: Node): node is ProblemNode => node.type === "problem";

interface Props {
  nodeId: string;
}

const CriteriaTableIndicatorBase = ({ nodeId }: Props) => {
  const node = useNode(nodeId);
  const nodeChildren = useNodeChildren(nodeId);

  const onClick = useCallback(() => viewCriteriaTable(nodeId), [nodeId]);

  if (!node || !isProblem(node)) return <></>;

  const hasCriteria = nodeChildren.some((child) => child.type === "criterion");

  return (
    <ViewIndicator
      Icon={TableChartOutlined}
      filled={hasCriteria}
      title={"View criteria table"}
      onClick={onClick}
    />
  );
};

export const CriteriaTableIndicator = memo(CriteriaTableIndicatorBase);
