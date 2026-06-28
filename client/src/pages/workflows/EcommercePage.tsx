import { useEffect, useMemo, useState } from 'react';
import { Minus, PackageCheck, Plus, ShoppingBag, ShoppingCart, Star, Tag, Truck } from 'lucide-react';
import { PageHeader } from '@/components/common/PageHeader';
import { PageContainer, Section } from '@/components/common/PageContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { createResourceApi } from '@/services/resourceApi';
import { getErrorMessage } from '@/services/apiClient';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from '@/components/ui/sonner';
import type { Product } from '@/types/api';

interface CartItem {
  product: Product;
  qty: number;
}

interface ConfirmedOrder {
  orderNumber: string;
  total: number;
}

const TAX_RATE = 0.08;
const COUPONS: Record<string, number> = { SAVE10: 0.1, WELCOME15: 0.15 };
const SHIPPING: Record<'standard' | 'express', number> = { standard: 0, express: 9.99 };

export default function EcommercePage() {
  const api = useMemo(() => createResourceApi<Product>('/products'), []);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<ConfirmedOrder | null>(null);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; rate: number } | null>(null);
  const [shipping, setShipping] = useState<'standard' | 'express'>('standard');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await api.list({ limit: 12 });
        if (!cancelled) setProducts(res.data);
      } catch (err) {
        if (!cancelled) {
          const message = getErrorMessage(err);
          setError(message);
          toast.error(message);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [api]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    toast.message(`Added ${product.name} to cart`);
  };

  const changeQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => (item.product.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0),
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.qty, 0),
    [cart],
  );
  const discount = appliedCoupon ? subtotal * appliedCoupon.rate : 0;
  const discountedSubtotal = subtotal - discount;
  const tax = discountedSubtotal * TAX_RATE;
  const shippingCost = cart.length > 0 ? SHIPPING[shipping] : 0;
  const total = discountedSubtotal + tax + shippingCost;
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const rate = COUPONS[code];
    if (rate) {
      setAppliedCoupon({ code, rate });
      toast.success(`Coupon ${code} applied`);
    } else {
      setAppliedCoupon(null);
      toast.error('Invalid coupon code');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const orderNumber = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setConfirmedOrder({ orderNumber, total });
    setCart([]);
    setAppliedCoupon(null);
    setCouponInput('');
    setShipping('standard');
    setCartOpen(false);
    toast.success(`Order ${orderNumber} placed`);
  };

  return (
    <PageContainer>
      <PageHeader
        icon={<ShoppingBag className="h-5 w-5" />}
        title="E-commerce Flow"
        description="Browse a product catalog, build a cart and complete a simulated checkout."
        actions={
          <Button variant="outline" onClick={() => setCartOpen(true)} data-testid="open-cart">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Open cart
            <Badge variant="secondary" data-testid="cart-count">
              {cartCount}
            </Badge>
          </Button>
        }
      />

      {confirmedOrder ? (
        <Card data-testid="order-confirmation" className="border-success/30 bg-success/5">
          <CardContent className="flex items-center gap-3 pt-6">
            <PackageCheck className="h-6 w-6 text-success" aria-hidden="true" />
            <div>
              <p className="font-semibold text-foreground">Order confirmed</p>
              <p className="text-sm text-muted-foreground">
                <span data-testid="order-number" className="font-mono font-medium text-foreground">
                  {confirmedOrder.orderNumber}
                </span>{' '}
                · {formatCurrency(confirmedOrder.total)}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Section title="Products" id="products">
        {error ? (
          <Card>
            <CardContent
              className="pt-6 text-sm text-destructive"
              role="alert"
              data-testid="ecommerce-error"
            >
              {error}
            </CardContent>
          </Card>
        ) : loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index}>
                <CardContent className="space-y-3 pt-6">
                  <Skeleton className="h-40 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="ecommerce-empty">
            No products available.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const image = product.images[0];
              return (
                <Card
                  key={product.id}
                  data-testid={`product-card-${product.id}`}
                  className="flex flex-col overflow-hidden"
                >
                  <div className="aspect-[4/3] w-full overflow-hidden bg-muted">
                    {image ? (
                      <img
                        src={image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div
                        className="h-full w-full bg-gradient-to-br from-primary/30 via-primary/10 to-secondary"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                  <CardContent className="flex flex-1 flex-col gap-3 pt-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold leading-tight text-foreground">{product.name}</h3>
                      <Badge variant="secondary">{product.category}</Badge>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-lg font-semibold text-foreground">
                        {formatCurrency(product.price, product.currency)}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-4 w-4 text-warning" aria-hidden="true" />
                        {product.rating.toFixed(1)}
                      </span>
                    </div>
                    <Button
                      className="w-full"
                      onClick={() => addToCart(product)}
                      data-testid={`add-to-cart-${product.id}`}
                    >
                      <Plus className="h-4 w-4" aria-hidden="true" />
                      Add to cart
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </Section>

      <Dialog open={cartOpen} onOpenChange={setCartOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your cart</DialogTitle>
            <DialogDescription>Review your items and complete a simulated checkout.</DialogDescription>
          </DialogHeader>

          {cart.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground" data-testid="cart-empty">
              Your cart is empty.
            </p>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3">
                {cart.map((item) => (
                  <li
                    key={item.product.id}
                    data-testid={`cart-item-${item.product.id}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{item.product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatCurrency(item.product.price, item.product.currency)} each
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label={`Decrease ${item.product.name}`}
                        onClick={() => changeQty(item.product.id, -1)}
                        data-testid={`cart-qty-dec-${item.product.id}`}
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <span className="w-6 text-center text-sm" data-testid={`cart-qty-${item.product.id}`}>
                        {item.qty}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label={`Increase ${item.product.name}`}
                        onClick={() => changeQty(item.product.id, 1)}
                        data-testid={`cart-qty-inc-${item.product.id}`}
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <span
                        className="w-20 text-right text-sm font-medium"
                        data-testid={`cart-line-total-${item.product.id}`}
                      >
                        {formatCurrency(item.product.price * item.qty, item.product.currency)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="space-y-3 border-t pt-3">
                <div className="flex items-end gap-2">
                  <div className="flex-1 space-y-1">
                    <label htmlFor="coupon" className="text-xs font-medium text-muted-foreground">
                      Coupon code
                    </label>
                    <Input
                      id="coupon"
                      value={couponInput}
                      placeholder="Try SAVE10 or WELCOME15"
                      data-testid="coupon-input"
                      onChange={(event) => setCouponInput(event.target.value)}
                    />
                  </div>
                  <Button variant="outline" data-testid="coupon-apply" onClick={applyCoupon}>
                    <Tag className="h-4 w-4" aria-hidden="true" /> Apply
                  </Button>
                </div>
                {appliedCoupon ? (
                  <p className="text-xs font-medium text-success" data-testid="coupon-applied">
                    {appliedCoupon.code} applied — {Math.round(appliedCoupon.rate * 100)}% off
                  </p>
                ) : null}

                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Shipping method</p>
                  <div className="grid grid-cols-2 gap-2" data-testid="shipping-options">
                    {(['standard', 'express'] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        data-testid={`shipping-${opt}`}
                        aria-pressed={shipping === opt}
                        onClick={() => setShipping(opt)}
                        className={cn(
                          'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
                          shipping === opt ? 'border-primary bg-primary/5' : 'border-border hover:bg-accent',
                        )}
                      >
                        <span className="flex items-center gap-1.5 font-medium capitalize text-foreground">
                          <Truck className="h-3.5 w-3.5" aria-hidden="true" /> {opt}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {SHIPPING[opt] === 0 ? 'Free · 5–7 days' : `${formatCurrency(SHIPPING[opt])} · 1–2 days`}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <dl className="space-y-1 border-t pt-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd data-testid="cart-subtotal">{formatCurrency(subtotal)}</dd>
                </div>
                {discount > 0 ? (
                  <div className="flex justify-between text-success">
                    <dt>Discount</dt>
                    <dd data-testid="cart-discount">−{formatCurrency(discount)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax (8%)</dt>
                  <dd data-testid="cart-tax">{formatCurrency(tax)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd data-testid="cart-shipping">
                    {shippingCost === 0 ? 'Free' : formatCurrency(shippingCost)}
                  </dd>
                </div>
                <div className="flex justify-between text-base font-semibold text-foreground">
                  <dt>Total</dt>
                  <dd data-testid="cart-total">{formatCurrency(total)}</dd>
                </div>
              </dl>
            </div>
          )}

          <DialogFooter>
            <Button onClick={handleCheckout} disabled={cart.length === 0} data-testid="cart-checkout">
              Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}
