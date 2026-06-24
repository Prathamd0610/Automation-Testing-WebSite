import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ResultPanel } from './ResultPanel';

describe('ResultPanel', () => {
  it('renders the label and value into a stable testid target', () => {
    render(<ResultPanel label="Last action" value="clicked" testId="last-action" />);

    expect(screen.getByText('Last action')).toBeInTheDocument();
    expect(screen.getByTestId('last-action')).toHaveTextContent('clicked');
  });

  it('exposes a polite live region for status announcements', () => {
    render(<ResultPanel label="Status" value="ready" testId="status" />);

    const region = screen.getByRole('status');
    expect(region).toHaveAttribute('aria-live', 'polite');
  });

  it('shows an em dash for empty values', () => {
    render(<ResultPanel label="Empty" value={null} testId="empty" />);
    expect(screen.getByTestId('empty')).toHaveTextContent('—');
  });

  it('stringifies numeric values', () => {
    render(<ResultPanel label="Count" value={42} testId="count" />);
    expect(screen.getByTestId('count')).toHaveTextContent('42');
  });
});
