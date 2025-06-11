import ForgotPassword from '@/pages/ForgotPassword';
import { screen, fireEvent, render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// verification format email

describe('Test saisie adresse email de reinitialisation', () => {
  it('Controle du format email', async () => {
    render(<ForgotPassword />);
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'celio.rocha@free.fr' } });
    expect(screen.getByText).toBe('celio.rocha@free.fr');
  });
});
