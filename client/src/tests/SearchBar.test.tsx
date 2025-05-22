import { screen, fireEvent, waitFor } from '@testing-library/react'; // Testing library/react pour simuler les interactions utilisateur dans les tests.
import SearchBar from '../components/form/SearchBar';
import { SearchPatientsDocument } from '@/types/graphql-generated';
import { describe, expect, it } from 'vitest';
import { createMockUser } from './utils/createMockUser';
import { renderWithProviders } from './utils/renderWithProviders';

describe('SearchBar', () => {
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
  ];

  const mockUser = createMockUser({
    role: 'SECRETARY',
    status: 'ACTIVE',
  });

  it("affiche les patients lorsqu'on tape une recherche valide", async () => {
    renderWithProviders(<SearchBar />, {
      mocks,
      user: mockUser,
    });
    screen.debug();
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'jo' } });
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    });
  });
});

//*** TO ADD : test error if the request is not valid **/
