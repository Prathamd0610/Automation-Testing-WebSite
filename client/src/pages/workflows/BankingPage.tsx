import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Landmark } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
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
import { accountApi } from '@/services/accountApi';
import { getErrorMessage } from '@/services/apiClient';
import { toast } from '@/components/ui/sonner';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { AccountKey, Transaction } from '@/types/admin';

const ACCOUNT_LABELS: Record<AccountKey, string> = {
  checking: 'Checking',
  savings: 'Savings',
};

const TYPE_VARIANT: Record<string, 'success' | 'destructive' | 'secondary'> = {
  credit: 'success',
  debit: 'destructive',
  adjustment: 'secondary',
};

export default function BankingPage() {
  const [balances, setBalances] = useState<Record<AccountKey, number>>({ checking: 0, savings: 0 });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState<AccountKey>('checking');
  const [to, setTo] = useState<AccountKey>('savings');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const refresh = useCallback(async () => {
    const [account, txns] = await Promise.all([
      accountApi.getMyAccount(),
      accountApi.getMyTransactions(),
    ]);
    setBalances({ checking: account.checking, savings: account.savings });
    setTransactions(txns);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        await refresh();
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
  }, [refresh]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = Number(amount);

    if (!Number.isFinite(value) || value <= 0) {
      setError('Enter an amount greater than zero');
      return;
    }
    if (from === to) {
      setError('Choose different accounts');
      return;
    }
    if (value > balances[from]) {
      setError('Insufficient funds');
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const account = await accountApi.transfer({ from, to, amount: value });
      setBalances({ checking: account.checking, savings: account.savings });
      setTransactions(await accountApi.getMyTransactions());
      setAmount('');
      toast.success('Transfer complete');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Banking Portal"
        description="Transfer funds between your accounts and review your transaction history — backed by the API."
      />

      {loading ? (
        <div className="flex justify-center py-12" data-testid="banking-loading">
          <Spinner label="Loading accounts" />
        </div>
      ) : (
        <>
          <Section title="Accounts" id="accounts">
            <div className="grid gap-4 sm:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardDescription>Checking</CardDescription>
                  <CardTitle data-testid="account-checking-balance">
                    {formatCurrency(balances.checking)}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <CardDescription>Savings</CardDescription>
                  <CardTitle data-testid="account-savings-balance">
                    {formatCurrency(balances.savings)}
                  </CardTitle>
                </CardHeader>
              </Card>
            </div>
          </Section>

          <Section title="Transfer" id="transfer">
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2" noValidate>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-from">From account</Label>
                    <Select value={from} onValueChange={(value) => setFrom(value as AccountKey)}>
                      <SelectTrigger id="transfer-from" data-testid="transfer-from">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="transfer-to">To account</Label>
                    <Select value={to} onValueChange={(value) => setTo(value as AccountKey)}>
                      <SelectTrigger id="transfer-to" data-testid="transfer-to">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="transfer-amount">Amount</Label>
                    <Input
                      id="transfer-amount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amount}
                      onChange={(event) => setAmount(event.target.value)}
                      placeholder="0.00"
                      data-testid="transfer-amount"
                    />
                  </div>
                  {error ? (
                    <p
                      role="alert"
                      className="text-sm font-medium text-destructive sm:col-span-2"
                      data-testid="transfer-error"
                    >
                      {error}
                    </p>
                  ) : null}
                  <div className="sm:col-span-2">
                    <Button type="submit" disabled={submitting} data-testid="transfer-submit">
                      {submitting ? (
                        <Spinner label="Transferring" />
                      ) : (
                        <>
                          <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          Transfer funds
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </Section>

          <Section title="Transaction history" id="history">
            <Card>
              <CardContent className="pt-6">
                {transactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground" data-testid="transaction-empty">
                    No transactions yet.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead className="text-right">Balance after</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx, index) => (
                        <TableRow key={tx.id} data-testid={`transaction-row-${index}`}>
                          <TableCell className="whitespace-nowrap">{formatDate(tx.createdAt)}</TableCell>
                          <TableCell>{ACCOUNT_LABELS[tx.account]}</TableCell>
                          <TableCell>
                            <Badge variant={TYPE_VARIANT[tx.type] ?? 'secondary'}>{tx.type}</Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{tx.description}</TableCell>
                          <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(tx.balanceAfter)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </Section>
        </>
      )}
    </PageContainer>
  );
}
