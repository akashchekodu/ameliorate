import { RelationName } from "@/common/edge";
import { NodeType } from "@/common/node";
import {
  useCriterionHasContext,
  useFulfillsHasContext,
  useSolutionHasContext,
} from "@/web/topic/diagramStore/partContextHooks";
import {
  viewCriterionContext,
  viewFulfillsEdgeContext,
  viewSolutionContext,
} from "@/web/view/currentViewStore/filter";

export const diagramPartContextMethods: Partial<
  Record<
    NodeType | RelationName,
    { useHasContext: (graphPartId: string) => boolean; viewContext: (graphPartId: string) => void }
  >
> = {
  solution: {
    useHasContext: useSolutionHasContext,
    viewContext: viewSolutionContext,
  },
  criterion: {
    useHasContext: useCriterionHasContext,
    viewContext: viewCriterionContext,
  },
  fulfills: {
    useHasContext: useFulfillsHasContext,
    viewContext: viewFulfillsEdgeContext,
  },
};
