import type {
  AnalyticsProvider,
  ChartBlockData,
  ContactBlockData,
  CustomBlockData,
  KitBlock,
  Profile,
  SeparatorBlockData,
  StatsBlockData,
} from "@repo/db";
import { cn } from "@repo/ui";
import { Case, Default, Switch } from "react-if";
import { ChartBlock } from "./blocks/chart-block";
import { ContactBlock } from "./blocks/contact-block";
import { CustomBlock } from "./blocks/custom-block";
import { SeparatorBlock } from "./blocks/separator-block";
import { StatsBlock } from "./blocks/stats-block";

interface BlockRendererProps {
  kitId: string;
  block: KitBlock;
  profile: Profile;
  analyticsProvider: AnalyticsProvider;
  className?: string;
}

export function BlockRenderer({
  kitId,
  block,
  profile,
  analyticsProvider,
  className,
}: BlockRendererProps) {
  const getBlockSpan = (block: KitBlock) => {
    switch (block.type) {
      case "chart":
        return "col-span-1 sm:col-span-2";
      case "contact":
        return "col-span-1 sm:col-span-2 lg:col-span-3";
      case "custom":
        return "col-span-1";
      case "stats":
        return "col-span-1";
      default:
        return "col-span-1";
    }
  };

  return (
    <div className={cn(getBlockSpan(block), "min-h-64", className)}>
      <Switch>
        <Case condition={block.type === "separator"}>
          <SeparatorBlock data={block.data as SeparatorBlockData} />
        </Case>

        <Case condition={block.type === "stats"}>
          <StatsBlock data={block.data as StatsBlockData} analyticsProvider={analyticsProvider} />
        </Case>

        <Case condition={block.type === "chart"}>
          <ChartBlock data={block.data as ChartBlockData} analyticsProvider={analyticsProvider} />
        </Case>

        <Case condition={block.type === "custom"}>
          <CustomBlock data={block.data as CustomBlockData} />
        </Case>

        <Case condition={block.type === "contact"}>
          <ContactBlock
            kitId={kitId}
            profileId={profile.id}
            data={block.data as ContactBlockData}
          />
        </Case>

        <Default>{null}</Default>
      </Switch>
    </div>
  );
}
