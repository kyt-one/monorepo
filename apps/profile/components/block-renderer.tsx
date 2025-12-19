import type {
  AnalyticsProvider,
  ChartBlockData,
  ContactBlockData,
  CustomBlockData,
  KitBlock,
  Profile,
  ProfileBlockData,
  SeparatorBlockData,
  StatsBlockData,
} from "@repo/db";
import { Case, Default, Switch } from "react-if";
import { ChartBlock } from "./blocks/chart-block";
import { ContactBlock } from "./blocks/contact-block";
import { CustomBlock } from "./blocks/custom-block";
import { ProfileBlock } from "./blocks/profile-block";
import { SeparatorBlock } from "./blocks/separator-block";
import { StatsBlock } from "./blocks/stats-block";

interface BlockRendererProps {
  kitId: string;
  block: KitBlock;
  profile: Profile;
  analyticsProvider: AnalyticsProvider;
}

export function BlockRenderer({ kitId, block, profile, analyticsProvider }: BlockRendererProps) {
  return (
    <Switch>
      <Case condition={block.type === "profile"}>
        <ProfileBlock profile={profile} data={block.data as ProfileBlockData} />
      </Case>

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
          className="w-full h-12 text-base font-semibold shadow-sm text-white bg-primary hover:bg-(--primary)/90 rounded-(--radius)"
        />
      </Case>

      <Default>{null}</Default>
    </Switch>
  );
}
