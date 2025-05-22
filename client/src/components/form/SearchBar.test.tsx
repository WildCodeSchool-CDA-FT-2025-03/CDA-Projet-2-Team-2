import { render, screen, fireEvent, waitFor } from '@testing-library/react'; // Testing library/react pour simuler les interactions utilisateur dans les tests.
import { MockedProvider } from '@apollo/client/testing';
import SearchBar from './SearchBar';
import { SearchPatientsDocument } from '@/types/graphql-generated';
import { describe, expect, it } from 'vitest';
import { AuthContext } from '@/contexts/auth.context';
import { MemoryRouter } from 'react-router-dom';

describe('SearchBar', () => {
  // ****** MOCK APOLLO******/
  //  ce que la requête GraphQL doit "renvoyer". Simulation de la requete.
  // Apollo Client a besoin de connaître quelle requête GraphQL (query + variables) on veut simuler, et quelle réponse il doit renvoyer.
  // Le tableau mock doit donc respecter ce format
  const mocks = [
    {
      request: {
        // request : C’est l’objet représentant la requête Apollo simulée. Le mot request indique à Apollo Client "quand tu vois une requête qui correspond à ça, utilise le résultat ci-dessous".
        query: SearchPatientsDocument, // query → le document GraphQL généré (SearchPatientsDocument), donc  de la même requête du hook genere dans graphql-generated
        variables: { query: 'jo' }, // ce que ton hook envoie comme paramètres ({ query: 'jo' } dans ce cas)
      },
      result: {
        //  ce que le serveur devrait "répondre". Simulation de la reponse
        data: {
          searchPatients: [
            // La cle doit correspondre du coup au nom de la requete graphQl, idem pour ses champs
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

  const mockUser = {
    id: '1',
    email: 'test@example.com',
    firstname: 'Test',
    lastname: 'User',
    role: 'SECRETARY',
    // __typename: 'User',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    status: 'ACTIVE',
    departement: {
      id: 'dep-1',
      name: 'Département Test',
      label: 'Test Département',
      level: '1',
      building: 'Bâtiment A',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-06-01T00:00:00.000Z',
      status: 'ACTIVE', //  enum ?
      // __typename: 'Departement',
      user: [],
      wing: 'wing-123',
    },
  };

  it("affiche les patients lorsqu'on tape une recherche valide", async () => {
    // ****** MOCKEDPROVIDER******/
    // On affiche le composant dans un environnement Apollo simulé (MockedProvider) => C’est une version spéciale d’ApolloProvider utilisée seulement dans les tests.
    // sert à : simuler le comportement du serveur GraphQL, intercepter les requêtes faites par ton composant, et retourner les données que tu as préparées dans mocks.
    render(
      // afficher le composant dans un environnement de test
      <MockedProvider mocks={mocks} addTypename={false}>
        {/* Apollo utilise __typename pour savoir à quel type d’objet il a affaire, on en a pas donc mettre a false */}
        <AuthContext.Provider
          value={{
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null,
            login: async () => {},
          }}
        >
          <MemoryRouter>
            <SearchBar />
          </MemoryRouter>
        </AuthContext.Provider>
      </MockedProvider>,
    );
    screen.debug();
    // On récupère l’élément input
    // Sélectionne l’input
    const input = await screen.findByRole('textbox');

    // Simule que l'utilisateur tape "jo" avec fireEvent de la testing library/react pour déclencher des événements DOM
    fireEvent.change(input, { target: { value: 'jo' } });
    screen.debug();
    // Attend que "Chargement..." s'affiche
    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    // Attend que les données s'affichent
    await waitFor(() => {
      expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      expect(screen.getByText(/1234567890/)).toBeInTheDocument();
    });
  });
});

//*** TO ADD : test error if the request is not valid **/
