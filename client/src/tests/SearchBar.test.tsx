import { screen, fireEvent, waitFor } from '@testing-library/react';
import SearchBar from '../components/form/SearchBar';
import { SearchPatientsDocument, SearchDoctorsDocument } from '@/types/graphql-generated';
import { describe, expect, it } from 'vitest';
import { createMockUser } from './utils/createMockUser';
import { renderWithProviders } from './utils/renderWithProviders';

describe('SearchBar', () => {
  const mockUser = createMockUser({
    role: 'SECRETARY',
    status: 'ACTIVE',
  });

  it("affiche les patients lorsqu'on tape une recherche valide", async () => {
    const mocks = [
      {
        request: {
          query: SearchPatientsDocument,
          variables: { query: 'jo' },
        },
        result: {
          data: {
            searchPatients: [
              {
                id: '1',
                firstname: 'John',
                lastname: 'Doe',
                social_number: '1234567890',
              },
            ],
          },
        },
      },
      {
        request: {
          query: SearchDoctorsDocument,
          variables: { query: 'jo' },
        },
        result: {
          data: {
            searchDoctors: [],
          },
        },
      },
    ];

    renderWithProviders(<SearchBar />, {
      mocks,
      user: mockUser,
    });

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'jo' } });

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    });
  });

  it('affiche les médecins si la recherche les retourne', async () => {
    const mocks = [
      {
        request: {
          query: SearchPatientsDocument,
          variables: { query: 'jo' },
        },
        result: {
          data: {
            searchPatients: [],
          },
        },
      },
      {
        request: {
          query: SearchDoctorsDocument,
          variables: { query: 'jo' },
        },
        result: {
          data: {
            searchDoctors: [
              {
                id: '2',
                firstname: 'Joe',
                lastname: 'Smith',
                profession: 'Généraliste',
                departement: {
                  label: 'Paris',
                },
              },
            ],
          },
        },
      },
    ];

    renderWithProviders(<SearchBar />, {
      mocks,
      user: mockUser,
    });

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'jo' } });

    await waitFor(() => {
      expect(screen.getByText(/Joe Smith/)).toBeInTheDocument();
      expect(screen.getByText(/Généraliste Paris/)).toBeInTheDocument();
    });
  });

  it("affiche un message d'erreur en cas d'échec de la requête", async () => {
    const mocks = [
      {
        request: {
          query: SearchPatientsDocument,
          variables: { query: 'jo' },
        },
        error: new Error('Erreur réseau'),
      },
      {
        request: {
          query: SearchDoctorsDocument,
          variables: { query: 'jo' },
        },
        error: new Error('Erreur réseau'),
      },
    ];

    renderWithProviders(<SearchBar />, {
      mocks,
      user: mockUser,
    });

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'jo' } });

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la recherche/i)).toBeInTheDocument();
    });
  });
});
