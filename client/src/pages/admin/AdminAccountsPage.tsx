import { useCallback, useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';
import { Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
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
import { adminApi } from '@/services/adminApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import type { Account, AccountKey, UserRef } from '@/types/admin';

function money(value: number): string {
  return value.toLocaleString(undefined, { style: 'currency', currency: 'USD' });
}

function accountUser(account: Account): UserRef | null {
  return typeof account.user === 'object' ? account.user : null;
}

interface AdjustForm {
  account: AccountKey;
  type: 'credit' | 'debit';
  amount: string;
  description: string;
}

const EMPTY_ADJUST: AdjustForm = { account: 'savings', type: 'credit', amount: '', description: '' };

export default function AdminAccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  const [target, setTarget] = useState<Account | null>(null);
  const [form, setForm] = useState<AdjustForm>(EMPTY_ADJUST);
  const [saving, setSaving] = useState(false);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await adminApi.listAccounts({ limit: 50 });
        if (!cancelled) setAccounts(res.data);
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
  }, [version]);

  const openAdjust = (account: Account) => {
    setForm(EMPTY_ADJUST);
    setTarget(account);
  };

  const handleAdjust = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!target) return;
    const user = accountUser(target);
    if (!user) return;
    const amount = Number(form.amount);
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid positive amount');
      return;
    }
    setSaving(true);
    try {
      await adminApi.adjustAccount(user.id, {
        account: form.account,
        type: form.type,
        amount,
        description: form.description || undefined,
      });
      toast.success(`${form.type === 'credit' ? 'Credited' : 'Debited'} ${money(amount)}`);
      setTarget(null);
      reload();
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Section
      title="Accounts & savings"
      description="View every user's balances and credit or debit their checking/savings accounts."
    >
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="flex justify-center py-8" data-testid="admin-accounts-loading">
              <Spinner label="Loading accounts" />
            </div>
          ) : accounts.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No accounts found.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="text-right">Checking</TableHead>
                  <TableHead className="text-right">Savings</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {accounts.map((account) => {
                  const user = accountUser(account);
                  return (
                    <TableRow key={account.id} data-testid={`admin-account-row-${account.id}`}>
                      <TableCell className="font-medium text-foreground">
                        {user?.name ?? '—'}
                      </TableCell>
                      <TableCell>{user?.email ?? '—'}</TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(account.checking)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {money(account.savings)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openAdjust(account)}
                          disabled={!user}
                          data-testid={`admin-account-adjust-${account.id}`}
                        >
                          <Wallet className="h-4 w-4" aria-hidden="true" />
                          Adjust
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={target !== null} onOpenChange={(open) => !open && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust account</DialogTitle>
            <DialogDescription>
              Credit or debit{' '}
              <span className="font-medium text-foreground">
                {accountUser(target ?? ({} as Account))?.name ?? 'user'}
              </span>
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAdjust} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="adjust-account">Account</Label>
                <Select
                  value={form.account}
                  onValueChange={(value) => setForm((p) => ({ ...p, account: value as AccountKey }))}
                >
                  <SelectTrigger id="adjust-account" data-testid="admin-adjust-account">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="checking">Checking</SelectItem>
                    <SelectItem value="savings">Savings</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="adjust-type">Type</Label>
                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm((p) => ({ ...p, type: value as 'credit' | 'debit' }))
                  }
                >
                  <SelectTrigger id="adjust-type" data-testid="admin-adjust-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit (add)</SelectItem>
                    <SelectItem value="debit">Debit (remove)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjust-amount">Amount</Label>
              <Input
                id="adjust-amount"
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
                required
                data-testid="admin-adjust-amount"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adjust-description">Description (optional)</Label>
              <Input
                id="adjust-description"
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="e.g. Quarterly bonus"
                data-testid="admin-adjust-description"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setTarget(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} data-testid="admin-adjust-submit">
                {saving ? <Spinner label="Saving" /> : 'Apply adjustment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
