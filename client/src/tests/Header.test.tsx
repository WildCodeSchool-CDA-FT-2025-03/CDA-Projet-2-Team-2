import { render, screen } from '@testing-library/react';
import Header from '../components/layout/Header';
import { expect, it } from 'vitest';

it('le header affiche le logo DoctoPlan', () => {
  render(<Header />);

  // Vérifie que l'image du logo est bien présente
  expect(screen.getByAltText('logo de DoctoPlan')).toBeInTheDocument();

  // Vérifie aussi que le texte DoctoPlan est affiché
  expect(screen.getByText('DoctoPlan')).toBeInTheDocument();
});
