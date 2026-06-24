import { useState } from 'react';
import { ArrowRight, Landmark } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
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
import { formatCurrency, formatDate } from '@/lib/utils';

type AccountKey = 'checking' | 'savings';

interface Transaction {
  id: string;
  date: string;
  from: string;
  to: string;
  amount: number;
  fromBalance: number;
}

const ACCOUNT_LABELS: Record<AccountKey, string> = {
  checking: 'Checking',
  savings: 'Savings',
};

export default function BankingPage() {
  const [balances, setBalances] = useState<Record<AccountKey, number>>({
    checking: 5200.75,
    savings: 18230.4,
  });
  const [from, setFrom] = useState<AccountKey>('checking');
  const [to, setTo] = useState<AccountKey>('savings');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleSubmit = (event: React.FormEvent) => {
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

    const nextFromBalance = balances[from] - value;
    setBalances((prev) => {
      const next = { ...prev };
      next[from] -= value;
      next[to] += value;
      return next;
    });
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: formatDate(new Date().toISOString()),
        from: ACCOUNT_LABELS[from],
        to: ACCOUNT_LABELS[to],
        amount: value,
        fromBalance: nextFromBalance,
      },
      ...prev,
    ]);
    setAmount('');
    setError(null);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<Landmark className="h-5 w-5" />}
        title="Banking Portal"
        description="Transfer funds between accounts and review a running transaction history — fully client-side."
      />

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
                <Button type="submit" data-testid="transfer-submit">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  Transfer funds
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
                    <TableHead>From</TableHead>
                    <TableHead>To</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">From balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx, index) => (
                    <TableRow key={tx.id} data-testid={`transaction-row-${index}`}>
                      <TableCell>{tx.date}</TableCell>
                      <TableCell>{tx.from}</TableCell>
                      <TableCell>{tx.to}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                      <TableCell className="text-right">{formatCurrency(tx.fromBalance)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </Section>
    </PageContainer>
  );
}
