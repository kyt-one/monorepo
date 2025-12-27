"use client";

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { KitBlock } from "@repo/db";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@repo/ui";
import { createDefaultBlock } from "@repo/utils";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { When } from "react-if";
import { updateKitBlocksAction } from "@/app/editor/actions";
import { BlockConfig } from "./block-config";
import { SortableBlock } from "./sortable-block";

interface Props {
  kitId: string;
  initialBlocks: KitBlock[];
}

export function BlocksEditor({ kitId, initialBlocks }: Props) {
  const [blocks, setBlocks] = useState<KitBlock[]>(initialBlocks);
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [_, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((i) => i.id === active.id);
      const newIndex = blocks.findIndex((i) => i.id === over.id);

      const newOrder = arrayMove(blocks, oldIndex, newIndex);

      setBlocks(newOrder);
      saveBlocks(newOrder);
    }
  };

  const handleRemove = (id: string) => {
    const newBlocks = blocks.filter((b) => b.id !== id);
    setBlocks(newBlocks);
    saveBlocks(newBlocks);
  };

  const handleAdd = (type: KitBlock["type"]) => {
    const newBlock: KitBlock = createDefaultBlock(type);
    const newBlocks = [...blocks, newBlock];
    setBlocks(newBlocks);
    saveBlocks(newBlocks);
  };

  const saveBlocks = (newBlocks: KitBlock[]) => {
    startTransition(async () => {
      await updateKitBlocksAction(kitId, newBlocks);
    });
  };

  const handleSaveBlock = (id: string, data: KitBlock["data"]) => {
    const newBlocks = blocks.map((b) => (b.id === id ? ({ ...b, data } as KitBlock) : b));
    setBlocks(newBlocks);
    saveBlocks(newBlocks);
    setEditingBlockId(null);
  };

  const activeBlock = blocks.find((b) => b.id === editingBlockId);

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Content Blocks</CardTitle>
          <AddBlockDropdown onAdd={handleAdd} />
        </CardHeader>

        <CardContent>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
              {blocks.map((block) => (
                <SortableBlock
                  key={block.id}
                  block={block}
                  onRemove={handleRemove}
                  onEdit={setEditingBlockId}
                />
              ))}
            </SortableContext>
          </DndContext>

          <When condition={blocks.length === 0}>
            <div className="text-center py-10 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
              No blocks added yet. Start building!
            </div>
          </When>
        </CardContent>
      </Card>

      <Sheet open={!!editingBlockId} onOpenChange={() => setEditingBlockId(null)}>
        <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle className="capitalize">Edit {activeBlock?.type} Block</SheetTitle>
            <SheetDescription>Make changes to this section of your media kit.</SheetDescription>
          </SheetHeader>

          <div className="py-6">
            {activeBlock && (
              <BlockConfig
                block={activeBlock}
                onSave={(data) => handleSaveBlock(activeBlock.id, data)}
                onCancel={() => setEditingBlockId(null)}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

function AddBlockDropdown({ onAdd }: { onAdd: (t: KitBlock["type"]) => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="mr-2 size-4" /> Add Block
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onAdd("stats")}>Stats Grid</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("chart")}>Growth Chart</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("separator")}>Section Title</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("custom")}>Custom Card</DropdownMenuItem>
        <DropdownMenuItem onClick={() => onAdd("contact")}>Contact Button</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
