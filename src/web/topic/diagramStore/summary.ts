import {
  getAddressed,
  getCauses,
  getComponents,
  getDetriments,
  getNeighborsByRelationDescription,
  getObstacles,
  getSolutionBenefits,
  getSolutions,
} from "@/web/summary/aspectFilter";
import { useDiagramStore } from "@/web/topic/diagramStore/store";
import { Node } from "@/web/topic/utils/graph";

// hooks
// These are simple because of the following plan to enable reusing summary filtering in the diagram view:
// - diagramStore/summary.ts with hook `useX` for each aspect filter, e.g. `useNeighborsByRelationDescription`
// - summary/aspectFilter.ts for individual `getX` e.g. `getNeighborsByRelationDescription`
// - future: focusedFilter.ts? has if-else to invoke the right `getX` from aspectFilter.ts, similar to infoFilter's `applyStandardFilter`

export const useNeighborsByRelationDescription = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getNeighborsByRelationDescription(summaryNode, state);
  }); // could use shallow/deep-compare to avoid re-rendering summary tabs unless these lists change
};

// solution
export const useComponents = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getComponents(summaryNode, state);
  });
};

export const useAddressed = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getAddressed(summaryNode, state);
  });
};

export const useObstacles = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getObstacles(summaryNode, state);
  });
};

// problem
export const useSolutions = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getSolutions(summaryNode, state);
  });
};

// effect
export const useBenefits = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getSolutionBenefits(summaryNode, state);
  });
};

export const useDetriments = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getDetriments(summaryNode, state);
  });
};

export const useCauses = (summaryNode: Node) => {
  return useDiagramStore((state) => {
    return getCauses(summaryNode, state);
  });
};
