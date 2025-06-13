import { test, expect } from '@playwright/test';

test.describe('Login page', () => {
  test('Login page is accessible', async ({ page }) => {
    await page.goto('http://localhost:3205/login');

    await expect(page.getByRole('heading', { name: 'Se connecter à votre compte' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mot de passe' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Mot de passe oublié ?' })).toBeVisible();
  });

  test('Login page can login', async ({ page }) => {
    await page.goto('http://localhost:3205/login');

    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Mot de passe' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continuer' })).toBeVisible();

    await page.getByRole('textbox', { name: 'Email' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill('admin@doctoplan.com');

    await page.getByRole('textbox', { name: 'Mot de passe' }).click();
    await page.getByRole('textbox', { name: 'Mot de passe' }).fill('admin123');

    await page.getByRole('button', { name: 'Continuer' }).click();
    await expect(
      page.getByRole('heading', { name: 'Tableau de bord administrateur' }),
    ).toBeVisible();

    await expect(page.getByRole('button', { name: 'Se déconnecter' })).toBeVisible();
  });
});
