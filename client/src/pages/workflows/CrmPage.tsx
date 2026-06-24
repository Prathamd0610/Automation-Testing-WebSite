import { useEffect, useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2, Users } from 'lucide-react';
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
import { toast } from '@/components/ui/sonner';
import type { Customer, CustomerStatus } from '@/types/api';

interface CustomerForm {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: CustomerStatus;
}

const EMPTY_FORM: CustomerForm = {
  name: '',
  email: '',
  phone: '',
  company: '',
  status: 'lead',
};

const STATUS_VARIANT: Record<CustomerStatus, BadgeProps['variant']> = {
  active: 'success',
  inactive: 'secondary',
  lead: 'warning',
};

const STATUS_OPTIONS: { value: CustomerStatus; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'lead', label: 'Lead' },
];

export default function CrmPage() {
  const api = useMemo(() => createResourceApi<Customer>('/customers'), []);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await api.list({ search: debouncedSearch, limit: 10 });
        if (!cancelled) setCustomers(res.data);
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

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company ?? '',
      status: customer.status,
    });
    setFormOpen(true);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.update(editing.id, form);
        toast.success('Customer updated');
      } else {
        await api.create(form);
        toast.success('Customer created');
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
      toast.success('Customer deleted');
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
        icon={<Users className="h-5 w-5" />}
        title="CRM Customers"
        description="Search, create, edit and delete customer records backed by the practice API."
        actions={
          <Button onClick={openAdd} data-testid="crm-add">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add customer
          </Button>
        }
      />

      <Section title="Customers" id="customers">
        <div className="relative max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search customers"
            className="pl-9"
            data-testid="crm-search"
            aria-label="Search customers"
          />
        </div>

        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex justify-center py-8" data-testid="crm-loading">
                <Spinner label="Loading customers" />
              </div>
            ) : customers.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground" data-testid="crm-empty">
                No customers found.
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} data-testid={`crm-row-${customer.id}`}>
                      <TableCell className="font-medium text-foreground">{customer.name}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone}</TableCell>
                      <TableCell>{customer.company ?? '—'}</TableCell>
                      <TableCell>
                        <Badge variant={STATUS_VARIANT[customer.status]}>{customer.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Edit ${customer.name}`}
                            onClick={() => openEdit(customer)}
                            data-testid={`crm-edit-${customer.id}`}
                          >
                            <Pencil className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Delete ${customer.name}`}
                            onClick={() => setDeleteTarget(customer)}
                            data-testid={`crm-delete-${customer.id}`}
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
            <DialogTitle>{editing ? 'Edit customer' : 'Add customer'}</DialogTitle>
            <DialogDescription>
              {editing ? 'Update the customer details below.' : 'Create a new customer record.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="crm-form-name">Name</Label>
              <Input
                id="crm-form-name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                required
                data-testid="crm-form-name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="crm-form-email">Email</Label>
                <Input
                  id="crm-form-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  required
                  data-testid="crm-form-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm-form-phone">Phone</Label>
                <Input
                  id="crm-form-phone"
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  data-testid="crm-form-phone"
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="crm-form-company">Company</Label>
                <Input
                  id="crm-form-company"
                  value={form.company}
                  onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
                  data-testid="crm-form-company"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="crm-form-status">Status</Label>
                <Select
                  value={form.status}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, status: value as CustomerStatus }))}
                >
                  <SelectTrigger id="crm-form-status" data-testid="crm-form-status">
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
              <Button type="submit" disabled={saving} data-testid="crm-form-submit">
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
            <DialogTitle>Delete customer</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <span className="font-medium text-foreground">{deleteTarget?.name}</span>?
          </p>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
              data-testid="crm-confirm-delete"
            >
              {deleting ? <Spinner label="Deleting" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
