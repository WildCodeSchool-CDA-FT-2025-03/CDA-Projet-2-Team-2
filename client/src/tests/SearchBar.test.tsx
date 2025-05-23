import { screen, fireEvent, waitFor } from '@testing-library/react'; // Testing library/react pour simuler les interactions utilisateur dans les tests.
import SearchBar from '../components/form/SearchBar';
import { SearchPatientsDocument } from '@/types/graphql-generated';
import { describe, expect, it } from 'vitest';
import { createMockUser } from './utils/createMockUser';
import { renderWithProviders } from './utils/renderWithProviders';

describe('SearchBar', () => {
  const mockUser = createMockUser({
    role: 'SECRETARY',
    status: 'ACTIVE',
  });

  const successMocks = [
    {
      request: {
        query: SearchPatientsDocument,
        variables: { query: 'Marie' },
      },
      result: {
        data: {
          searchPatients: [
            {
              id: '1',
              firstname: 'Marie',
              lastname: 'Pepper',
              social_number: '4934567890',
            },
          ],
        },
      },
    },
  ];

  const errorMocks = [
    {
      request: {
        query: SearchPatientsDocument,
        variables: { query: 'jo' },
      },
      error: new Error('Erreur serveur médecin'),
    },
  ];
  // const doctorsSuccessMocks + const doctorErrorMocks , idem patient -> si la requete 1 echoue ou fonctionne, si la requete 2 echoue ou fonctionne

  // const successBothMocks = [...patientSuccessMocks, ...doctorSuccessMocks]; -> si les 2 requetes son ok
  // const errorBothMocks = [...patientErrorMocks, ...doctorErrorMocks]; -> si les deux request echoue

  //***************TESTS**************************************************************** */

  it("affiche les patients lorsqu'on tape une recherche valide", async () => {
    renderWithProviders(<SearchBar />, {
      mocks: successMocks,
      user: mockUser,
    });
    screen.debug();
    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'Marie' } });

    await waitFor(() => {
      expect(screen.getByText(/Marie Pepper/i)).toBeInTheDocument();
    });
  });

  it("affiche un message d'erreur si la requête patient échoue", async () => {
    renderWithProviders(<SearchBar />, {
      mocks: errorMocks,
      user: mockUser,
    });

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'jo' } });

    await waitFor(() => {
      expect(screen.getByText(/erreur lors de la recherche/i)).toBeInTheDocument();
    });
  });

  it('affiche un message de chargement si la requête réussit', async () => {
    renderWithProviders(<SearchBar />, {
      mocks: successMocks,
      user: mockUser,
    });

    const input = await screen.findByRole('textbox');
    fireEvent.change(input, { target: { value: 'Marie' } });

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Marie Pepper/i)).toBeInTheDocument();
    });
  });
});

//***** TO ADD : test doctors + both requests combined
