import { useState } from 'react';
import { ListTree, ChevronRight, Folder, FileText } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { ResultPanel } from '@/components/common/ResultPanel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface Node {
  id: string;
  label: string;
  children?: Node[];
}

const TREE: Node[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'Button.tsx' },
          { id: 'modal', label: 'Modal.tsx' },
        ],
      },
      {
        id: 'pages',
        label: 'pages',
        children: [{ id: 'home', label: 'Home.tsx' }],
      },
      { id: 'app', label: 'App.tsx' },
    ],
  },
  {
    id: 'tests',
    label: 'tests',
    children: [{ id: 'spec', label: 'login.spec.ts' }],
  },
];

function TreeNode({
  node,
  depth,
  expanded,
  selected,
  onToggle,
  onSelect,
}: {
  node: Node;
  depth: number;
  expanded: Set<string>;
  selected: string;
  onToggle: (id: string) => void;
  onSelect: (label: string) => void;
}) {
  const isFolder = Boolean(node.children?.length);
  const isOpen = expanded.has(node.id);
  return (
    <li>
      <div
        data-testid={`tree-node-${node.id}`}
        role="treeitem"
        aria-expanded={isFolder ? isOpen : undefined}
        aria-selected={selected === node.label}
        style={{ paddingLeft: depth * 18 + 8 }}
        onClick={() => (isFolder ? onToggle(node.id) : onSelect(node.label))}
        className={cn(
          'flex cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-2 text-sm hover:bg-accent',
          selected === node.label && 'bg-primary/10 text-primary',
        )}
      >
        {isFolder ? (
          <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform', isOpen && 'rotate-90')} aria-hidden="true" />
        ) : (
          <span className="w-4" />
        )}
        {isFolder ? <Folder className="h-4 w-4 shrink-0 text-amber-500" aria-hidden="true" /> : <FileText className="h-4 w-4 shrink-0 text-sky-500" aria-hidden="true" />}
        <span>{node.label}</span>
      </div>
      {isFolder && isOpen ? (
        <ul role="group">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              expanded={expanded}
              selected={selected}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * Tree view — an expandable file explorer. Folders toggle open/closed and
 * files select. Tests must expand ancestors before a deep node is visible,
 * a common real-world pattern.
 */
export default function TreeViewPage() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['src']));
  const [selected, setSelected] = useState('');

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <PageContainer>
      <PageHeader
        icon={<ListTree className="h-5 w-5" />}
        title="Tree View"
        description="Expand folders to reveal nested files, then select a file. Deep nodes only exist in the DOM once their parent folder is expanded."
      />

      <Section title="Project explorer" id="tree">
        <Card>
          <CardContent className="pt-4">
            <ul role="tree" aria-label="Project files" data-testid="tree-root">
              {TREE.map((node) => (
                <TreeNode
                  key={node.id}
                  node={node}
                  depth={0}
                  expanded={expanded}
                  selected={selected}
                  onToggle={toggle}
                  onSelect={setSelected}
                />
              ))}
            </ul>
          </CardContent>
        </Card>
      </Section>

      <Section title="Result" id="result">
        <ResultPanel label="Selected file" value={selected} testId="tree-selected" tone={selected ? 'success' : 'default'} />
      </Section>
    </PageContainer>
  );
}
