import React from 'react';
import { render } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/client/testing';
import { MemoryRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/auth.context';
import { User } from '@/types/graphql-generated';

type RenderWithProvidersOptions = {
  mocks?: MockedResponse[];
  user?: User;
  isAuthenticated?: boolean;
  isLoading?: boolean;
  route?: string;
};

export function renderWithProviders(
  component: React.ReactElement,
  {
    mocks = [],
    user,
    isAuthenticated = true,
    isLoading = false,
    route = '/',
  }: RenderWithProvidersOptions = {},
) {
  return render(
    <MockedProvider mocks={mocks} addTypename={false}>
      <AuthContext.Provider
        value={{
          user: user || null,
          isAuthenticated,
          isLoading,
          error: null,
          login: async () => {},
        }}
      >
        <MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>
      </AuthContext.Provider>
    </MockedProvider>,
  );
}
