"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { KitBlock } from "@repo/db";
import { Button, FormInput, FormSelect } from "@repo/ui";
import { getProviderMetricOptions, ProviderOptions } from "@repo/utils";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Case, Default, Switch } from "react-if";
import {
  ChartSchema,
  ContactSchema,
  CustomSchema,
  SeparatorSchema,
  StatsSchema,
} from "@/lib/schemas/editor-blocks";

interface Props {
  block: KitBlock;
  onSave: (data: KitBlock["data"]) => void;
  onCancel: () => void;
}

export function BlockConfig({ block, onSave, onCancel }: Props) {
  const schema = {
    separator: SeparatorSchema,
    stats: StatsSchema,
    chart: ChartSchema,
    custom: CustomSchema,
    contact: ContactSchema,
  }[block.type];

  const form = useForm<KitBlock["data"]>({
    resolver: zodResolver(schema),
    defaultValues: block.data,
  });

  const selectedProvider = useWatch({
    control: form.control,
    name: "provider",
  });

  useEffect(() => {
    form.reset(block.data);
  }, [block.data, form]);

  const onSubmit = (data: KitBlock["data"]) => {
    onSave(data);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Switch>
        <Case condition={block.type === "separator"}>
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="title"
              label="Section Title"
              placeholder="e.g. My Stats"
            />
            <FormInput
              control={form.control}
              name="content"
              label="Content (Optional)"
              placeholder="e.g. Here are my latest numbers..."
            />
          </div>
        </Case>

        <Case condition={block.type === "stats"}>
          {() => {
            const metricOptions = getProviderMetricOptions(selectedProvider, "stats");
            return (
              <div className="space-y-4">
                <FormSelect
                  control={form.control}
                  name="provider"
                  label="Platform"
                  placeholder="Select platform"
                  options={ProviderOptions}
                />

                <FormSelect
                  control={form.control}
                  name="metric"
                  label="Metric"
                  placeholder="Select metric"
                  options={metricOptions}
                />
              </div>
            );
          }}
        </Case>

        <Case condition={block.type === "chart"}>
          {() => {
            const metricOptions = getProviderMetricOptions(selectedProvider, "chart");
            return (
              <div className="space-y-4">
                <FormSelect
                  control={form.control}
                  name="provider"
                  label="Platform"
                  placeholder="Select platform"
                  options={ProviderOptions}
                />

                <FormSelect
                  control={form.control}
                  name="metric"
                  label="Metric"
                  placeholder="Select metric"
                  options={metricOptions}
                />

                <FormInput
                  control={form.control}
                  name="days"
                  label="Time Range (Days)"
                  type="number"
                />
              </div>
            );
          }}
        </Case>

        <Case condition={block.type === "custom"}>
          <div className="space-y-4">
            <FormInput
              control={form.control}
              name="title"
              label="Card Heading"
              placeholder="e.g. My Newsletter"
            />
            <FormInput
              control={form.control}
              name="description"
              label="Description"
              placeholder="e.g. Join 10k readers..."
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="backgroundColor"
                  label="Background"
                  type="color"
                  className="h-10 w-full p-1 cursor-pointer"
                />
              </div>
              <div className="space-y-2">
                <FormInput
                  control={form.control}
                  name="textColor"
                  label="Text Color"
                  type="color"
                  className="h-10 w-full p-1 cursor-pointer"
                />
              </div>
            </div>
            <FormInput
              control={form.control}
              name="link"
              label="Link URL (Optional)"
              placeholder="https://..."
            />
          </div>
        </Case>

        <Case condition={block.type === "contact"}>
          <FormInput control={form.control} name="buttonText" label="Button Text" />
        </Case>

        <Default>
          <p className="text-sm text-muted-foreground">No settings available for this block.</p>
        </Default>
      </Switch>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
