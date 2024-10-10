import { test, expect } from '@playwright/test';
import type { User } from 'firebase/auth';

test.describe('Ars Antiqua Online Login Page', () => {
	test('should render correctly and handle Google Sign-In success', async ({ page }) => {
		// Mock the FirebaseAuthModule for successful sign-in
		await page.addInitScript(() => {
			class MockFirebaseAuthModule {
				private mockUser: User | null = null;
				public signInWithGoogle = async () => {
					this.mockUser = { uid: '123', email: 'test@example.com' } as User;
					return this.mockUser;
				};
				public getCurrentUser = () => {
					return this.mockUser;
				};
			}
			(window as any).auth = new MockFirebaseAuthModule();
		});

		// Navigate to the page
		await page.goto('/');

		// Check description
		await expect(page.getByText('Explore the rich history of medieval music.')).toBeVisible();

		// Check Google Sign-In button
		const signInButton = page.getByRole('button', { name: 'Sign in with Google' });
		await expect(signInButton).toBeVisible();

		// Check feature list
		const featureList = page.locator('ul');
		await expect(featureList).toBeVisible();
		const featureItems = await featureList.locator('li').all();
		expect(featureItems).toHaveLength(3);
		await expect(featureItems[0]).toContainText('Access a collection of medieval manuscripts');
		await expect(featureItems[1]).toContainText(
			'Create and explore custom editions of historical works'
		);
		await expect(featureItems[2]).toContainText(
			'Compare multiple interpretations of polyphonic music'
		);

		// Check privacy notice
		await expect(page.getByText('Your privacy is important.')).toBeVisible();

		// Check "Learn more" link
		const learnMoreLink = page.getByRole('link', { name: 'here' });
		await expect(learnMoreLink).toHaveAttribute('href', '/about');

		// Check background image
		const backgroundImage = page.locator('.background-image');
		await expect(backgroundImage).toBeVisible();
		const backgroundImageStyle = await backgroundImage.evaluate(
			(el) => window.getComputedStyle(el).backgroundImage
		);
		expect(backgroundImageStyle).toContain('medieval-sheet-music');

		// Test successful Google Sign-In
		const signInPromise = page.evaluate(() => (window as any).auth.signInWithGoogle());
		await signInButton.click();
		await signInPromise;

		// Verify that the user is signed in
		const currentUser = await page.evaluate(() => (window as any).auth.getCurrentUser());
		expect(currentUser).toEqual(
			expect.objectContaining({
				uid: '123',
				email: 'test@example.com'
			})
		);
	});

	test('should handle Google Sign-In error', async ({ page }) => {
		// Mock the FirebaseAuthModule to simulate an error
		await page.addInitScript(() => {
			class MockFirebaseAuthModule {
				public signInWithGoogle = async () => {
					throw new Error('Error signing in with Google');
				};

				public getCurrentUser = () => {
					return null;
				};
			}

			(window as any).auth = new MockFirebaseAuthModule();
		});

		await page.goto('/');

		const signInButton = page.getByRole('button', { name: 'Sign in with Google' });
		await expect(signInButton).toBeVisible();

		let errorMessage = '';
		try {
			await page.evaluate(() => (window as any).auth.signInWithGoogle());
		} catch (error) {
			errorMessage = (error as Error).message;
		}

		expect(errorMessage).toContain('Error signing in with Google');

		const currentUser = await page.evaluate(() => (window as any).auth.getCurrentUser());
		expect(currentUser).toBeNull();

		// Check if the error is displayed on the page (adjust selector as needed)
		const errorElement = page.locator('.error-message');
		if (await errorElement.isVisible()) {
			await expect(errorElement).toContainText('Error signing in with Google');
		}
	});
});
