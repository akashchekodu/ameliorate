import { Build, Group, VerticalSplit } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { StepType } from "@reactour/tour";
import Image from "next/image";

import { Link } from "@/web/common/components/Link";
import { celebrateGif } from "@/web/common/urls";
import { StepContent } from "@/web/tutorial/StepContent";
import {
  quickViewDropdownSelector,
  tutorialDefaultAnchorClass,
} from "@/web/tutorial/tutorialUtils";

export const navigatingTopicSteps: StepType[] = [
  {
    selector: quickViewDropdownSelector,
    content: (
      <StepContent
        stepTitle="Quick Views"
        text={
          <span>Quick Views allow you to easily jump between different aspects of a topic.</span>
        }
        imageSlot={
          <>
            <Image
              key="https://github.com/user-attachments/assets/87055acd-debb-45f2-981f-ef511e770222"
              src="https://github.com/user-attachments/assets/87055acd-debb-45f2-981f-ef511e770222"
              alt="clicking between views in cars-going-too-fast topic"
              width={1096}
              height={847}
              unoptimized // warning without this - gifs aren't optimized by nextjs apparently
              // extra padding & bg because spacing seems to look better
              className="rounded-xl border bg-paperPlain-main p-2 shadow"
            />
            <Typography variant="caption">
              From:{" "}
              <Link
                href="https://ameliorate.app/examples/detailed-cars-going-too-fast"
                target="_blank"
              >
                cars-going-too-fast
              </Link>
            </Typography>
          </>
        }
      />
    ),
  },
  {
    selector: `.${tutorialDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle="More details"
        text={
          <span>
            Indicators convey at-a-glance where extra details are.
            <br />
            <br />
            Details can be found by selecting the piece and looking at the Details Pane{" "}
            <VerticalSplit color="primary" />.
          </span>
        }
        imageSlot={
          <>
            <Image
              key="https://github.com/user-attachments/assets/bc02d4e2-5507-49d6-bd10-a32ea0ebd841"
              src="https://github.com/user-attachments/assets/bc02d4e2-5507-49d6-bd10-a32ea0ebd841"
              alt="indicators"
              width={600}
              height={467}
              unoptimized // without this, nextjs sometimes tries to optimize the gif as an image - not sure why only sometimes though; thanks https://github.com/vercel/next.js/discussions/18628#discussioncomment-4036940
              className="rounded-xl border shadow"
            />
          </>
        }
      />
    ),
  },
  {
    selector: `.${tutorialDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle="Perspectives"
        text={
          <span>
            If you're logged in, you'll see your own scores, otherwise you'll see the scores of the
            topic's creator.
            <br />
            <br />
            You can compare multiple people's scores via the Compare button <Group />, or select
            specific perspectives via the More Actions Drawer <Build />.
          </span>
        }
        imageSlot={
          <Image
            key="https://github.com/user-attachments/assets/bdf7fd16-d44a-4a74-8e5e-24cd577dc647"
            src="https://github.com/user-attachments/assets/bdf7fd16-d44a-4a74-8e5e-24cd577dc647"
            alt="viewing other perspectives"
            width={492}
            height={411}
            unoptimized // without this, nextjs sometimes tries to optimize the gif as an image - not sure why only sometimes though; thanks https://github.com/vercel/next.js/discussions/18628#discussioncomment-4036940
            className="rounded-xl border shadow"
          />
        }
      />
    ),
  },
  {
    selector: `.${tutorialDefaultAnchorClass}`,
    content: (
      <StepContent
        stepTitle='Completed "Navigating a topic"! 🎉'
        text="Yay! You've learned the basics for viewing in Ameliorate. Now you can go forth and understand other people's topics! 🔥"
        imageSlot={
          <Image
            key={celebrateGif}
            src={celebrateGif}
            alt="Celebrate completed tutorial!"
            width={256}
            height={143}
            unoptimized // without this, nextjs sometimes tries to optimize the gif as an image - not sure why only sometimes though; thanks https://github.com/vercel/next.js/discussions/18628#discussioncomment-4036940
          />
        }
      />
    ),
  },
];
