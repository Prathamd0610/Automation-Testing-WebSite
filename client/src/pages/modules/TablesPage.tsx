import { useMemo, useState } from 'react';
import { Table2, ArrowUpDown, ArrowUp, ArrowDown, Search } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/useDebounce';

interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'invited' | 'suspended';
  score: number;
}

type SortKey = 'name' | 'email' | 'role' | 'score';
type SortDir = 'asc' | 'desc';

const FIRST = ['Ada', 'Alan', 'Grace', 'Linus', 'Margaret', 'Dennis', 'Barbara', 'Ken', 'Katherine', 'Tim'];
const LAST = ['Lovelace', 'Turing', 'Hopper', 'Torvalds', 'Hamilton', 'Ritchie', 'Liskov', 'Thompson', 'Johnson', 'Berners-Lee'];
const ROLES = ['Engineer', 'Designer', 'Manager', 'Analyst', 'QA Lead'];
const STATUSES: Person['status'][] = ['active', 'invited', 'suspended'];

// Deterministic dataset so automated assertions are stable across reloads.
const DATA: Person[] = Array.from({ length: 47 }, (_, index) => {
  const first = FIRST[index % FIRST.length] as string;
  const last = LAST[index % LAST.length] as string;
  return {
    id: index + 1,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
    role: ROLES[index % ROLES.length] as string,
    status: STATUSES[index % STATUSES.length] as Person['status'],
    score: ((index * 37) % 100) + 1,
  };
});

const STATUS_TONE: Record<Person['status'], 'success' | 'warning' | 'destructive'> = {
  active: 'success',
  invited: 'warning',
  suspended: 'destructive',
};

export default function TablesPage() {
  const [search, setSearch] = useState('');
  const debounced = useDebounce(search, 250);
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selected, setSelected] = useState<Set<number>>(new Set());

  const filtered = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    const rows = q
      ? DATA.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.email.toLowerCase().includes(q) ||
            p.role.toLowerCase().includes(q),
        )
      : DATA;
    const sorted = [...rows].sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      const cmp = typeof av === 'number' && typeof bv === 'number' ? av - bv : String(av).localeCompare(String(bv));
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [debounced, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const toggleRow = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const allOnPageSelected = pageRows.length > 0 && pageRows.every((row) => selected.has(row.id));
  const someOnPageSelected = pageRows.some((row) => selected.has(row.id));

  const toggleSelectAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) {
        pageRows.forEach((row) => next.delete(row.id));
      } else {
        pageRows.forEach((row) => next.add(row.id));
      }
      return next;
    });
  };

  const sortIcon = (key: SortKey) => {
    if (sortKey !== key) return <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />;
    return sortDir === 'asc' ? <ArrowUp className="h-3.5 w-3.5" /> : <ArrowDown className="h-3.5 w-3.5" />;
  };

  const SortableHeader = ({ label, column }: { label: string; column: SortKey }) => (
    <TableHead>
      <button
        type="button"
        onClick={() => toggleSort(column)}
        data-testid={`sort-${column}`}
        className="inline-flex items-center gap-1 font-semibold hover:text-foreground"
        aria-label={`Sort by ${label}`}
      >
        {label} {sortIcon(column)}
      </button>
    </TableHead>
  );

  return (
    <PageContainer>
      <PageHeader
        icon={<Table2 className="h-5 w-5" />}
        title="Data Tables"
        description="Search, sort, paginate and multi-select rows over a stable dataset."
      />

      <Section
        title="People directory"
        id="directory"
        description={`${filtered.length} of ${DATA.length} records match your filter.`}
      >
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  type="search"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, email or role…"
                  aria-label="Search table"
                  data-testid="table-search"
                  className="pl-9"
                />
              </div>
              <p className="text-sm text-muted-foreground" data-testid="selected-count">
                {selected.size} selected
              </p>
            </div>

            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={allOnPageSelected ? true : someOnPageSelected ? 'indeterminate' : false}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all rows on this page"
                        data-testid="select-all"
                      />
                    </TableHead>
                    <SortableHeader label="Name" column="name" />
                    <SortableHeader label="Email" column="email" />
                    <SortableHeader label="Role" column="role" />
                    <TableHead>Status</TableHead>
                    <SortableHeader label="Score" column="score" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                        No records found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageRows.map((person) => (
                      <TableRow
                        key={person.id}
                        data-testid={`table-row-${person.id}`}
                        data-state={selected.has(person.id) ? 'selected' : undefined}
                      >
                        <TableCell>
                          <Checkbox
                            checked={selected.has(person.id)}
                            onCheckedChange={() => toggleRow(person.id)}
                            aria-label={`Select ${person.name}`}
                            data-testid={`row-select-${person.id}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium text-foreground">{person.name}</TableCell>
                        <TableCell className="text-muted-foreground">{person.email}</TableCell>
                        <TableCell>{person.role}</TableCell>
                        <TableCell>
                          <Badge variant={STATUS_TONE[person.status]} className="capitalize">
                            {person.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums">{person.score}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Rows per page</span>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-20" data-testid="page-size">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 20].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground" data-testid="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  data-testid="page-prev"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  data-testid="page-next"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
