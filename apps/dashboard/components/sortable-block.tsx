"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { KitBlock } from "@repo/db";
import { Button, Card } from "@repo/ui";
import { GripVertical, Pencil, Trash2 } from "lucide-react";

interface Props {
  block: KitBlock;
  onRemove: (id: string) => void;
  onEdit: (id: string) => void;
}

export function SortableBlock({ block, onRemove, onEdit }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-3">
      <Card className="flex items-center p-3 gap-3 bg-white dark:bg-zinc-900 group">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab touch-none p-1 text-muted-foreground hover:text-foreground"
        >
          <GripVertical className="size-5" />
        </button>

        <div className="flex-1 flex flex-col">
          <span className="text-sm font-semibold capitalize">{block.type.replace("_", " ")}</span>
          <span className="text-xs text-muted-foreground truncate">{getBlockSummary(block)}</span>
        </div>

        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-primary"
            onClick={(e) => handleAction(e, () => onEdit(block.id))}
          >
            <Pencil className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-destructive"
            onClick={(e) => handleAction(e, () => onRemove(block.id))}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

function getBlockSummary(block: KitBlock): string {
  switch (block.type) {
    case "separator":
      return block.data.title;
    case "stats":
      return `${block.data.provider} • ${block.data.metric}`;
    case "chart":
      return `${block.data.provider} • ${block.data.metric} chart`;
    case "custom":
      return block.data.title || "Custom Block";
    case "contact":
      return "Contact Button";
    default:
      return "";
  }
}
