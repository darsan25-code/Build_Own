import { test, expect } from '@playwright/test';

test.describe('ACM Platform Complete End-to-End User Journey Audit', () => {
  // 1. Public Discovery Flow
  test('1. Public User: Discover Home, Chapters, Events, and Contests Directory', async ({ page }) => {
    await page.goto('http://localhost:3000/');
    await expect(page.locator('h1')).toContainText('Advancing Computing');

    // Explore Chapters
    await page.click('text=Explore Chapters');
    await expect(page).toHaveURL(/.*\/chapters/);
    await expect(page.locator('h1')).toContainText('ACM Student Chapters');

    // Navigate to Events Directory
    await page.click('text=Events');
    await expect(page).toHaveURL(/.*\/events/);
    await expect(page.locator('h1')).toContainText('ACM Events');

    // Navigate to Contests Directory
    await page.click('text=Contests');
    await expect(page).toHaveURL(/.*\/contests/);
    await expect(page.locator('h1')).toContainText('Battle in Real-Time');
  });

  // 2. Student Authentication Journey
  test('2. Student Authentication: Login and Dashboard Access', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await expect(page.locator('h2')).toContainText('Sign In');

    await page.fill('input[type="email"]', 'alex@xyz.edu');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for redirect to student dashboard
    await page.waitForURL(/.*\/student/);
    await expect(page.locator('h1')).toContainText('Student Dashboard');
  });

  // 3. Unstop Coding Arena Flow
  test('3. Unstop Coding Arena: Problem exploration, Code Execution & Submission', async ({ page }) => {
    // Navigate directly to Live Coding Arena
    await page.goto('http://localhost:3000/contests/acm-national-algorithmic-challenge-2026/arena');
    
    // Check Problem Description loaded
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Sample Test Cases')).toBeVisible();

    // Check Run Code button & Submit button exist
    await expect(page.locator('button:has-text("Run Code")')).toBeVisible();
    await expect(page.locator('button:has-text("Submit Solution")')).toBeVisible();

    // Click Run Code
    await page.click('button:has-text("Run Code")');
    await expect(page.locator('text=Output / Execution Result')).toBeVisible();
  });

  // 4. Live Leaderboard Verification
  test('4. Leaderboard: Live tournament rankings and podium rendering', async ({ page }) => {
    await page.goto('http://localhost:3000/contests/acm-national-algorithmic-challenge-2026/leaderboard');
    await expect(page.locator('h1')).toContainText('Live Standings');
    await expect(page.locator('text=Tournament Leader')).toBeVisible();
    await expect(page.locator('table')).toBeVisible();
  });

  // 5. Certificate Verification Flow
  test('5. Certificate Verification: Validate authentic credential code', async ({ page }) => {
    await page.goto('http://localhost:3000/certificates/ACM-CERT-2026-88910');
    await expect(page.locator('text=ACM-CERT-2026-88910')).toBeVisible();
    await expect(page.locator('text=Verified')).toBeVisible();
  });
});
