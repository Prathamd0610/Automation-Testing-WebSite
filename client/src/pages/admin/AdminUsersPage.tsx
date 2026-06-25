import { useCallback, useEffect, useMemo, useState } from 'react';
import { KeyRound, LogOut, Plus, Search, Trash2 } from 'lucide-react';
import { Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
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
import { adminApi, type CreateUserPayload } from '@/services/adminApi';
import { getErrorMessage } from '@/services/apiClient';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/components/ui/sonner';
import type { User, UserRole } from '@/types/api';

const EMPTY_CREATE: CreateUserPayload = {
  name: '',
  email: '',
  password: '',
  role: 'user',
};

const SELF_HINT = "You can't change your own admin account here";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 300);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<CreateUserPayload>(EMPTY_CREATE);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [pwTarget, setPwTarget] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resetting, setResetting] = useState(false);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.listUsers({ search: debouncedSearch, limit: 50 });
        if (!cancelled) setUsers(res.data);
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
  }, [debouncedSearch, version]);

  const isSelf = (u: User) => currentUser?.id === u.id;

  const handleRoleChange = async (u: User, role: UserRole) => {
    setBusyId(u.id);
    try {
      await adminApi.changeRole(u.id, role);
      toast.success(`${u.name} is now ${role}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleActiveToggle = async (u: User, isActive: boolean) => {
    setBusyId(u.id);
    try {
      await adminApi.setActive(u.id, isActive);
      toast.success(`${u.name} ${isActive ? 'activated' : 'deactivated'}`);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleRevoke = async (u: User) => {
    setBusyId(u.id);
    try {
      await adminApi.revokeSessions(u.id);
      toast.success(`Signed ${u.name} out everywhere`);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setBusyId(null);
    }
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    try {
      await adminApi.createUser(createForm);
      toast.success('User created');
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE);
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
      await adminApi.deleteUser(deleteTarget.id);
      toast.success('User deleted');
      setDeleteTarget(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setDeleting(false);
    }
  };

  const confirmReset = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!pwTarget) return;
    setResetting(true);
    try {
      await adminApi.resetPassword(pwTarget.id, newPassword);
      toast.success(`Password reset for ${pwTarget.name}`);
      setPwTarget(null);
      setNewPassword('');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setResetting(false);
    }
  };

  const headerActions = useMemo(
    () => (
      <Button
        onClick={() => {
          setCreateForm(EMPTY_CREATE);
          setCreateOpen(true);
        }}
        data-testid="admin-users-add"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add user
      </Button>
    ),
    [],
  );

  return (
    <Section
      title="Users & roles"
      description="Promote or demote users, activate accounts, reset passwords, and revoke sessions."
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="pl-9"
            data-testid="admin-users-search"
            aria-label="Search users"
          />
        </div>
        {headerActions}
      </div>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8" data-testid="admin-users-loading">
              <Spinner label="Loading users" />
            </div>
          ) : users.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No users found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => {
                  const self = isSelf(u);
                  const busy = busyId === u.id;
                  return (
                    <TableRow key={u.id} data-testid={`admin-user-row-${u.id}`}>
                      <TableCell className="font-medium text-foreground">
                        {u.name}
                        {self ? (
                          <Badge variant="secondary" className="ml-2">
                            You
                          </Badge>
                        ) : null}
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          disabled={self || busy}
                          onValueChange={(value) => handleRoleChange(u, value as UserRole)}
                        >
                          <SelectTrigger
                            className="w-28"
                            title={self ? SELF_HINT : undefined}
                            data-testid={`admin-user-role-${u.id}`}
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Switch
                          checked={u.isActive}
                          disabled={self || busy}
                          onCheckedChange={(checked) => handleActiveToggle(u, checked)}
                          title={self ? SELF_HINT : undefined}
                          data-testid={`admin-user-active-${u.id}`}
                          aria-label={`Toggle active for ${u.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Reset password for ${u.name}`}
                            title="Reset password"
                            onClick={() => {
                              setNewPassword('');
                              setPwTarget(u);
                            }}
                            data-testid={`admin-user-reset-${u.id}`}
                          >
                            <KeyRound className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Revoke sessions for ${u.name}`}
                            title="Revoke sessions"
                            disabled={busy}
                            onClick={() => handleRevoke(u)}
                            data-testid={`admin-user-revoke-${u.id}`}
                          >
                            <LogOut className="h-4 w-4" aria-hidden="true" />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            aria-label={`Delete ${u.name}`}
                            title={self ? SELF_HINT : 'Delete user'}
                            disabled={self || busy}
                            onClick={() => setDeleteTarget(u)}
                            data-testid={`admin-user-delete-${u.id}`}
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create user */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add user</DialogTitle>
            <DialogDescription>Create a new account with an initial role.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="new-user-name">Name</Label>
              <Input
                id="new-user-name"
                value={createForm.name}
                onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
                required
                data-testid="admin-create-name"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="new-user-email">Email</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  data-testid="admin-create-email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-user-role">Role</Label>
                <Select
                  value={createForm.role}
                  onValueChange={(value) => setCreateForm((p) => ({ ...p, role: value as UserRole }))}
                >
                  <SelectTrigger id="new-user-role" data-testid="admin-create-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">user</SelectItem>
                    <SelectItem value="admin">admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-user-password">Password</Label>
              <Input
                id="new-user-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm((p) => ({ ...p, password: e.target.value }))}
                required
                minLength={8}
                data-testid="admin-create-password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} data-testid="admin-create-submit">
                {saving ? <Spinner label="Saving" /> : 'Create user'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset password */}
      <Dialog open={pwTarget !== null} onOpenChange={(open) => !open && setPwTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset password</DialogTitle>
            <DialogDescription>
              Set a new password for{' '}
              <span className="font-medium text-foreground">{pwTarget?.name}</span>.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={confirmReset} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="reset-password">New password</Label>
              <Input
                id="reset-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                data-testid="admin-reset-password"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setPwTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={resetting} data-testid="admin-reset-submit">
                {resetting ? <Spinner label="Resetting" /> : 'Reset password'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete user</DialogTitle>
            <DialogDescription>This permanently removes the account and its bank account.</DialogDescription>
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
              data-testid="admin-confirm-delete"
            >
              {deleting ? <Spinner label="Deleting" /> : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
