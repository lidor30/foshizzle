import {expect, test as it} from '@playwright/test';

it('handles i18n routing', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL('/en');

  // A cookie remembers the last locale
  await page.goto('/he');
  await page.goto('/');
  await expect(page).toHaveURL('/he');
  await page
    .getByRole('combobox', {name: 'Sprache ändern'})
    .selectOption({value: 'en'});

  await expect(page).toHaveURL('/en');
  page.getByRole('heading', {name: 'next-intl example'});
});

it('handles not found pages', async ({page}) => {
  await page.goto('/unknown');
  page.getByRole('heading', {name: 'Page not found'});

  await page.goto('/he/unknown');
  page.getByRole('heading', {name: 'Seite nicht gefunden'});
});

it("handles not found pages for routes that don't match the middleware", async ({
  page
}) => {
  await page.goto('/test.png');
  page.getByRole('heading', {name: 'This page could not be found.'});

  await page.goto('/api/hello');
  page.getByRole('heading', {name: 'This page could not be found.'});
});

it('sets caching headers', async ({request}) => {
  for (const pathname of ['/en', '/en/session', '/he', '/he/session']) {
    expect((await request.get(pathname)).headers()['cache-control']).toContain(
      's-maxage=31536000'
    );
  }
});

it('can be used to configure metadata', async ({page}) => {
  await page.goto('/en');
  await expect(page).toHaveTitle('next-intl example');

  await page.goto('/he');
  await expect(page).toHaveTitle('next-intl Beispiel');
});

it('can be used to localize the page', async ({page}) => {
  await page.goto('/en');
  page.getByRole('heading', {name: 'next-intl example'});

  await page.goto('/he');
  page.getByRole('heading', {name: 'next-intl Beispiel'});
});

it('sets a cookie when necessary', async ({page}) => {
  function getCookieValue() {
    return page.evaluate(() => document.cookie);
  }

  const response = await page.goto('/en');
  expect(await response?.headerValue('set-cookie')).toBe(null);

  await page
    .getByRole('combobox', {name: 'Change language'})
    .selectOption({value: 'he'});
  await expect(page).toHaveURL('/he');
  expect(await getCookieValue()).toBe('NEXT_LOCALE=he');

  await page
    .getByRole('combobox', {name: 'Sprache ändern'})
    .selectOption({value: 'en'});
  await expect(page).toHaveURL('/en');
  expect(await getCookieValue()).toBe('NEXT_LOCALE=en');

  // The Next.js Router cache kicks in here
  // https://nextjs.org/docs/app/building-your-application/caching#router-cache
  await page
    .getByRole('combobox', {name: 'Change language'})
    .selectOption({value: 'he'});
  await expect(page).toHaveURL('/he');
  expect(await getCookieValue()).toBe('NEXT_LOCALE=he');
});

it("sets a cookie when requesting a locale that doesn't match the `accept-language` header", async ({
  page
}) => {
  const response = await page.goto('/he');
  const value = await response?.headerValue('set-cookie');
  expect(value).toContain('NEXT_LOCALE=he;');
  expect(value).toContain('Path=/;');
  expect(value).toContain('SameSite=lax');
});

it('serves a robots.txt', async ({page}) => {
  const response = await page.goto('/robots.txt');
  const body = await response?.body();
  expect(body?.toString()).toEqual('User-Agent: *\nAllow: *\n');
});

it('serves a sitemap.xml', async ({page}) => {
  const response = await page.goto('/sitemap.xml');
  const body = await response!.body();
  expect(body.toString()).toBe(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
<url>
<loc>http://localhost:3000/en</loc>
<xhtml:link rel="alternate" hreflang="en" href="http://localhost:3000/en" />
<xhtml:link rel="alternate" hreflang="he" href="http://localhost:3000/he" />
</url>
<url>
<loc>http://localhost:3000/he</loc>
<xhtml:link rel="alternate" hreflang="en" href="http://localhost:3000/en" />
<xhtml:link rel="alternate" hreflang="he" href="http://localhost:3000/he" />
</url>
<url>
<loc>http://localhost:3000/en/pathnames</loc>
<xhtml:link rel="alternate" hreflang="en" href="http://localhost:3000/en/pathnames" />
<xhtml:link rel="alternate" hreflang="he" href="http://localhost:3000/he/pfadnamen" />
</url>
<url>
<loc>http://localhost:3000/he/pfadnamen</loc>
<xhtml:link rel="alternate" hreflang="en" href="http://localhost:3000/en/pathnames" />
<xhtml:link rel="alternate" hreflang="he" href="http://localhost:3000/he/pfadnamen" />
</url>
</urlset>
`
  );
});

it('provides a manifest', async ({page}) => {
  const response = await page.goto('/manifest.webmanifest');
  const body = await response!.json();
  expect(body).toEqual({
    name: 'next-intl example',
    start_url: '/',
    theme_color: '#101E33'
  });
});
