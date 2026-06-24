import { useMemo, useState, type ReactNode } from 'react';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Move, GripVertical } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { ResultPanel } from '@/components/common/ResultPanel';
import { cn } from '@/lib/utils';

type ColumnId = 'todo' | 'in-progress' | 'done';

const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};

const CARD_LABELS: Record<string, string> = {
  'task-1': 'Write test plan',
  'task-2': 'Build login page',
  'task-3': 'Add CI pipeline',
  'task-4': 'Review pull request',
  'task-5': 'Fix flaky test',
  'task-6': 'Ship release',
};

interface SortableItemProps {
  id: string;
  label: string;
  testId: string;
}

function SortableItem({ id, label, testId }: SortableItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-testid={testId}
      className={cn(
        'flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-sm',
        isDragging && 'opacity-50',
      )}
      {...attributes}
      {...listeners}
    >
      <GripVertical className="h-4 w-4 cursor-grab text-muted-foreground" aria-hidden="true" />
      <span className="font-medium text-foreground">{label}</span>
    </li>
  );
}

interface DroppableColumnProps {
  id: ColumnId;
  count: number;
  children: ReactNode;
}

// The whole column is a drop target (not just its cards), so an empty column
// still accepts dropped cards.
function DroppableColumn({ id, count, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div
      ref={setNodeRef}
      data-testid={`column-${id}`}
      className={cn(
        'rounded-xl border bg-muted/30 p-3 transition-colors',
        isOver && 'border-primary/60 bg-primary/5',
      )}
    >
      <h3 className="mb-3 px-1 text-sm font-semibold text-foreground">
        {COLUMN_LABELS[id]} <span className="text-muted-foreground">({count})</span>
      </h3>
      {children}
    </div>
  );
}

export default function DragDropPage() {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  // --- Sortable list ---
  const [order, setOrder] = useState<string[]>(['alpha', 'bravo', 'charlie', 'delta', 'echo']);

  const handleListDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((items) => {
      const from = items.indexOf(String(active.id));
      const to = items.indexOf(String(over.id));
      return arrayMove(items, from, to);
    });
  };

  // --- Kanban board ---
  const [columns, setColumns] = useState<Record<ColumnId, string[]>>({
    todo: ['task-1', 'task-2', 'task-3'],
    'in-progress': ['task-4', 'task-5'],
    done: ['task-6'],
  });
  const [activeCard, setActiveCard] = useState<string | null>(null);

  const findColumn = (id: UniqueIdentifier): ColumnId | undefined => {
    const key = String(id);
    if (key in columns) return key as ColumnId;
    return (Object.keys(columns) as ColumnId[]).find((col) => columns[col].includes(key));
  };

  const handleDragStart = (event: DragStartEvent) => setActiveCard(String(event.active.id));

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeColumn = findColumn(active.id);
    const overColumn = findColumn(over.id);
    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setColumns((prev) => {
      const activeItems = prev[activeColumn];
      const overItems = prev[overColumn];
      const activeId = String(active.id);
      const overId = String(over.id);
      const overIndex = overItems.indexOf(overId);
      const insertAt = overIndex >= 0 ? overIndex : overItems.length;
      return {
        ...prev,
        [activeColumn]: activeItems.filter((item) => item !== activeId),
        [overColumn]: [...overItems.slice(0, insertAt), activeId, ...overItems.slice(insertAt)],
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;
    const column = findColumn(active.id);
    const overColumn = findColumn(over.id);
    if (!column || !overColumn || column !== overColumn) return;
    const items = columns[column];
    const from = items.indexOf(String(active.id));
    const to = items.indexOf(String(over.id));
    if (from !== to && from >= 0 && to >= 0) {
      setColumns((prev) => ({ ...prev, [column]: arrayMove(prev[column], from, to) }));
    }
  };

  const kanbanState = useMemo(
    () =>
      (Object.keys(columns) as ColumnId[])
        .map((col) => `${COLUMN_LABELS[col]}: ${columns[col].length}`)
        .join(' · '),
    [columns],
  );

  return (
    <PageContainer>
      <PageHeader
        icon={<Move className="h-5 w-5" />}
        title="Drag & Drop"
        description="Reorder a sortable list and move cards across kanban columns. Keyboard accessible via dnd-kit."
      />

      <Section title="Sortable list" id="sortable" description="Drag items or use keyboard (Space then arrow keys).">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleListDragEnd}>
              <SortableContext items={order} strategy={verticalListSortingStrategy}>
                <ul className="space-y-2" data-testid="sortable-list">
                  {order.map((id) => (
                    <SortableItem key={id} id={id} label={id.toUpperCase()} testId={`sortable-item-${id}`} />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
            <ResultPanel label="Current order" value={order.join(' → ')} testId="sortable-order" tone="success" />
          </CardContent>
        </Card>
      </Section>

      <Section title="Kanban board" id="kanban" description="Move cards within and between columns.">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            {(Object.keys(columns) as ColumnId[]).map((column) => (
              <DroppableColumn key={column} id={column} count={columns[column].length}>
                <SortableContext items={columns[column]} strategy={verticalListSortingStrategy}>
                  <ul className="min-h-[80px] space-y-2">
                    {columns[column].map((cardId) => (
                      <SortableItem
                        key={cardId}
                        id={cardId}
                        label={CARD_LABELS[cardId] ?? cardId}
                        testId={`card-${cardId}`}
                      />
                    ))}
                  </ul>
                </SortableContext>
              </DroppableColumn>
            ))}
          </div>
          <DragOverlay>
            {activeCard ? (
              <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2.5 text-sm shadow-apple-lg">
                <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <span className="font-medium">{CARD_LABELS[activeCard] ?? activeCard}</span>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
        <ResultPanel label="Board state" value={kanbanState} testId="kanban-state" className="mt-4" />
      </Section>
    </PageContainer>
  );
}
