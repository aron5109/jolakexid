import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import { FORTUNES } from './data/fortunes';
import { advance } from './test/timers';

const TEXTS = new Set(FORTUNES.map((f) => f.text));

function revealedText(): string {
  return document.getElementById('fortune-text')?.textContent ?? '';
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve();
  });
}

describe('App', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the Icelandic landing composition', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Jólakexið' })).toBeInTheDocument();
    expect(screen.getByText('Lítil spá fyrir stóra daga')).toBeInTheDocument();
    expect(screen.getByText('Hvaða jólaboðskap geymir kexið þitt?')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Hljóð' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('breaks the cookie from the button, reveals a fortune and opens another', () => {
    render(<App />);
    const [cookie, cta] = screen.getAllByRole('button', { name: 'Brjóttu jólakexið' });
    expect(cookie).toHaveClass('cookie__button');
    fireEvent.click(cta);
    fireEvent.click(cookie);

    advance(1500);
    expect(screen.getByRole('heading', { name: 'Jólaboðskapurinn þinn' })).toBeInTheDocument();
    const first = revealedText();
    expect(TEXTS.has(first)).toBe(true);
    expect(screen.getAllByRole('status')[0]).toHaveTextContent(first);

    fireEvent.click(screen.getByRole('button', { name: /Fá annað kex/ }));
    advance(600);
    expect(screen.queryByText('Jólaboðskapurinn þinn')).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[0]);
    advance(1500);
    const second = revealedText();
    expect(TEXTS.has(second)).toBe(true);
    expect(second).not.toBe(first);
  });

  it('is fully operable with the keyboard via native buttons', () => {
    render(<App />);
    const cookie = screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[0];
    cookie.focus();
    expect(cookie).toHaveFocus();
    // Native <button> turns Enter/Space into click; simulate the resulting click.
    fireEvent.click(cookie);
    advance(1500);
    expect(screen.getByRole('button', { name: /Fá annað kex/ })).toHaveFocus();
  });

  it('copies the fortune and confirms with Afritað!', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });

    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[1]);
    advance(1500);

    fireEvent.click(screen.getByRole('button', { name: /Afrita boðskap/ }));
    await flushPromises();
    expect(writeText).toHaveBeenCalledWith(`„${revealedText()}“\n— Jólakexið`);
    expect(screen.getByRole('button', { name: /Afritað!/ })).toBeInTheDocument();

    advance(2500);
    expect(screen.getByRole('button', { name: /Afrita boðskap/ })).toBeInTheDocument();
  });

  it('ignores a clipboard result that arrives after the cookie was reset', async () => {
    let resolveWrite: () => void = () => {};
    const writeText = vi.fn(() => new Promise<void>((resolve) => (resolveWrite = resolve)));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });

    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[1]);
    advance(1500);
    fireEvent.click(screen.getByRole('button', { name: /Afrita boðskap/ }));
    fireEvent.click(screen.getByRole('button', { name: /Fá annað kex/ }));
    advance(600);
    fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[1]);
    advance(1500);

    resolveWrite();
    await flushPromises();
    expect(screen.getByRole('button', { name: /Afrita boðskap/ })).toBeInTheDocument();
    expect(screen.queryByText('Afritað!')).not.toBeInTheDocument();
  });

  it('shows a helpful message when copying fails', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('denied'));
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
    Object.defineProperty(window, 'isSecureContext', { value: true, configurable: true });
    document.execCommand = vi.fn(() => false);

    render(<App />);
    fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[1]);
    advance(1500);
    fireEvent.click(screen.getByRole('button', { name: /Afrita boðskap/ }));
    await flushPromises();
    expect(screen.getByRole('alert')).toHaveTextContent('Ekki tókst að afrita');
  });

  it('toggles sound on and off without autoplay', () => {
    render(<App />);
    const toggle = screen.getByRole('button', { name: 'Hljóð' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
  });

  it('reveals almost immediately when reduced motion is preferred', () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      ...original(query),
      matches: query.includes('reduce'),
    })) as typeof window.matchMedia;
    try {
      render(<App />);
      fireEvent.click(screen.getAllByRole('button', { name: 'Brjóttu jólakexið' })[1]);
      advance(300);
      expect(screen.getByRole('heading', { name: 'Jólaboðskapurinn þinn' })).toBeInTheDocument();
      expect(screen.getByRole('main')).toHaveAttribute('data-reduced-motion', 'true');
    } finally {
      window.matchMedia = original;
    }
  });
});
