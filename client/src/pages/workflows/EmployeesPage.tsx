import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createResourceApi } from '@/services/resourceApi';
import { getErrorMessage } from '@/services/apiClient';
import { useDebounce } from '@/hooks/useDebounce';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import type { Employee, EmployeeStatus } from '@/types/api';

interface EmployeeForm {
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: string;
  status: EmployeeStatus;
}

const EMPTY_FORM: EmployeeForm = {
  firstName: '',
  lastName: '',
  email: '',
  department: '',
  position: '',
  salary: '',
  status: 'active',
};

const STATUS_VARIANT: Record<EmployeeStatus, BadgeProps['variant']> = {
  active: 'success',
  on_leave: 'warning',
  terminated: 'destructive',
};

const STATUS_LABELS: Record<EmployeeStatus, string> = {
  active: 'Active',
  on_leave: 'On leave',
  terminated: 'Terminated',
};

const STATUS_OPTIONS: { value: EmployeeStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'on_leave', label: 'On leave' },
  { value: 'terminated', label: 'Terminated' },
];

export default function EmployeesPage() {
  const api = useMemo(() => createResourceApi<Employee>('/employees'), []);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState<EmployeeForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.list({ search: debouncedSearch, limit: 10 });
        if (!cancelled) setEmployees(res.data);
      } catch (err) {
        if (!cancelled) toast.error(getErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [api, debouncedSearch, version]);

  const reload = () => setVersion((value) => value + 1);

  const openAdd = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setFormOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      department: employee.department,
      position: employee.position,
      salary: String(employee.salary),
      status: employee.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    const payload: Partial<Employee> = {
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      department: form.department,
      position: form.position,
      salary: Number(form.salary),
      status: form.status,
    };
    try {
      if (editing) {
        await api.update(editing.id, payload);
        toast.success('Employee updated');
      } else {
        await api.create(payload);
        toast.success('Employee created');
      }
      setFormOpen(false);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.remove(deleteTarget.id);
      toast.success('Employee deleted');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<BriefcaseBusiness className="h-5 w-5" />}
        title="Employee Management"
        description="Search, create, edit and delete employee records backed by the practice API."
        actions={
          <Button onClick={openAdd} data-testid="emp-add">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add employee
          </Button>
        }
      />

      <Section title="Employees" id="employees">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search employees"
            className="pl-9"
            data-testid="emp-search"
            aria-label="Search employees"
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-8" data-testid="emp-loading">
                <Spinner label="Loading employees" />
              </div>
            ) : employees.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground" data-testid="emp-empty">
                No employees found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Salary</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id} data-testid={`emp-row-${employee.id}`}>
                      <TableCell className="font-mono text-xs">{employee.employeeId}</TableCell>
                      <TableCell className="font-medium text-foreground">
                        {employee.firstName} {employee.lastName}
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="text-right">{formatCurrency(employee.salary)}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[employee.status]}>
                          {STATUS_LABELS[employee.status]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Edit ${employee.firstName} ${employee.lastName}`}
                            onClick={() => openEdit(employee)}
                            data-testid={`emp-edit-${employee.id}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Delete ${employee.firstName} ${employee.lastName}`}
                            onClick={() => setDeleteTarget(employee)}
                            data-testid={`emp-delete-${employee.id}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Section>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit employee' : 'Add employee'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the employee details below.' : 'Create a new employee record.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emp-form-firstname">First name</Label>
                <Input
                  id="emp-form-firstname"
                  value={form.firstName}
                  onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
                  required
                  data-testid="emp-form-firstname"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-form-lastname">Last name</Label>
                <Input
                  id="emp-form-lastname"
                  value={form.lastName}
                  onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
                  required
                  data-testid="emp-form-lastname"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emp-form-email">Email</Label>
              <Input
                id="emp-form-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                data-testid="emp-form-email"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emp-form-department">Department</Label>
                <Input
                  id="emp-form-department"
                  value={form.department}
                  onChange={(event) => setForm((prev) => ({ ...prev, department: event.target.value }))}
                  data-testid="emp-form-department"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-form-position">Position</Label>
                <Input
                  id="emp-form-position"
                  value={form.position}
                  onChange={(event) => setForm((prev) => ({ ...prev, position: event.target.value }))}
                  data-testid="emp-form-position"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emp-form-salary">Salary</Label>
                <Input
                  id="emp-form-salary"
                  type="number"
                  min="0"
                  step="1"
                  value={form.salary}
                  onChange={(event) => setForm((prev) => ({ ...prev, salary: event.target.value }))}
                  data-testid="emp-form-salary"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emp-form-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as EmployeeStatus }))}
                >
                  <SelectTrigger id="emp-form-status" data-testid="emp-form-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} data-testid="emp-form-submit">
                {saving ? <Spinner label="Saving" /> : 'Save'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete employee</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove{' '}
            <span className="font-medium text-foreground">
              {deleteTarget ? `${deleteTarget.firstName} ${deleteTarget.lastName}` : ''}
            </span>
            ?
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              data-testid="emp-confirm-delete"
            >
              {deleting ? <Spinner label="Deleting" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
