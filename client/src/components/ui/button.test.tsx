import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies destructive variant classes', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveClass('bg-destructive');
  });

  it('calls the click handler', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);

    await userEvent.click(screen.getByRole('button', { name: 'Go' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Go
      </Button>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Go' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('renders as a child element when asChild is set', () => {
    render(
      <Button asChild>
        <a href="/somewhere">Link button</a>
      </Button>,
    );

    const link = screen.getByRole('link', { name: 'Link button' });
    expect(link).toHaveAttribute('href', '/somewhere');
    // Inherits the button styling.
    expect(link).toHaveClass('bg-primary');
  });
});
