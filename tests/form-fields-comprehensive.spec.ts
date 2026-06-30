import { test, expect, Page } from '@playwright/test';

test.describe('Dynamic Form Builder - fields and sections', () => {
  test.beforeEach(async ({ page }) => {
    let nextSectionId = 1;
    let nextFieldId = 1;
    const sections: Array<any> = [];
    const fields: Array<any> = [];

    await page.route('**/sections*', async (route) => {
      const request = route.request();
      if (request.method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(sections),
        });
      } else if (request.method() === 'POST') {
        const payload = JSON.parse(request.postData() || '{}');
        const section = {
          id: `section-${nextSectionId++}`,
          title: payload.title || 'Untitled Section',
          description: payload.description || '',
          order: sections.length,
        };
        sections.push(section);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(section),
        });
      } else {
        await route.continue();
      }
    });

    await page.route('**/fields*', async (route) => {
      const request = route.request();
      const url = new URL(request.url());

      if (request.method() === 'GET' && url.pathname.endsWith('/fields')) {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(fields),
        });
        return;
      }

      if (request.method() === 'GET' && url.pathname.includes('/fields/getFields/')) {
        const sectionId = url.pathname.split('/').pop();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(fields.filter((f) => f.sectionId === sectionId)),
        });
        return;
      }

      if (request.method() === 'POST' && url.pathname.endsWith('/fields')) {
        const payload = JSON.parse(request.postData() || '{}');
        const field = {
          id: `field-${nextFieldId++}`,
          label: payload.label,
          type: payload.type,
          placeholder: payload.placeholder,
          required: payload.required,
          options: payload.options,
          sectionId: payload.sectionId,
          order: fields.filter((f) => f.sectionId === payload.sectionId).length,
        };
        fields.push(field);
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(field),
        });
        return;
      }

      await route.continue();
    });

    await page.goto('http://localhost:5173/form');
  });

  const selectFieldType = async (page: Page, typeLabel: string) => {
    await page.getByRole('combobox').first().click();
    await page.getByRole('option', { name: typeLabel }).click();
  };

  const selectTargetSection = async (page: Page, sectionName: string) => {
    await page.getByRole('combobox').nth(1).click();
    await page.getByRole('option', { name: sectionName }).click();
  };

  const createSection = async (page: Page, title: string, description = '') => {
    await page.getByPlaceholder('e.g. Contact Address').fill(title);
    if (description) {
      await page.getByPlaceholder('Description (optional)').fill(description);
    }
    await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/sections') && response.request().method() === 'POST'),
      page.getByRole('button', { name: /Create Section/i }).click(),
    ]);
    await expect(page.getByText(title)).toBeVisible();
  };

  const createField = async (page: Page, field: { label: string; typeLabel: string; type: string; required: boolean; sectionName: string; }) => {
    await page.getByRole('button', { name: /Create & Palette/i }).click();
    await expect(page.getByText(/Quick Create Field/i)).toBeVisible();

    await page.getByPlaceholder(/Field Label \(e\.g\. Phone Number\)/i).fill(field.label);
    await selectFieldType(page, field.typeLabel);
    await selectTargetSection(page, field.sectionName);

    if (field.required) {
      await page.getByLabel('Mark as required field').check();
    }

    const [response] = await Promise.all([
      page.waitForResponse((response) => response.url().endsWith('/fields') && response.request().method() === 'POST'),
      page.getByRole('button', { name: /Add to Section/i }).click(),
    ]);

    const created = await response.json();
    await expect(page.getByText(field.label, {exact : true})).toBeVisible();
    return created.id as string;
  };

  test('should create dynamic section and fields and render preview correctly', async ({ page }) => {
    const sectionTitle = 'Personal Info';
    await createSection(page, sectionTitle, 'Section for user profile');

    await createField(page, {
      label: 'Age',
      typeLabel: 'Number',
      type: 'number',
      required: true,
      sectionName: sectionTitle,
    });

    await createField(page, {
      label: 'Work Email',
      typeLabel: 'Email',
      type: 'email',
      required: true,
      sectionName: sectionTitle,
    });

    await page.getByRole('button', { name: /Live Preview/i }).click();
    await expect(page.getByText('Preview Questionnaire')).toBeVisible();

    await expect(page.getByText('Personal Info')).toBeVisible();
    await expect(page.getByText('Age')).toBeVisible();
    await expect(page.getByText('Work Email')).toBeVisible();
  });

  test('should validate dynamic field input formats in preview mode', async ({ page }) => {
    const sectionTitle = 'Verification';
    await createSection(page, sectionTitle);

    const ageFieldId = await createField(page, {
      label: 'Age',
      typeLabel: 'Number',
      type: 'number',
      required: true,
      sectionName: sectionTitle,
    });

    const emailFieldId = await createField(page, {
      label: 'Work Email',
      typeLabel: 'Email',
      type: 'email',
      required: true,
      sectionName: sectionTitle,
    });

    const acceptFieldId = await createField(page, {
      label: 'Accept Terms',
      typeLabel: 'Checkbox',
      type: 'checkbox',
      required: true,
      sectionName: sectionTitle,
    });

    await page.getByRole('button', { name: /Live Preview/i }).click();
    await expect(page.getByText('Preview Questionnaire')).toBeVisible();

    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(page.getByText('Age is required.')).toBeVisible();

    await expect(page.getByText('Age is required.')).toBeVisible();
    await expect(page.getByText('Work Email is required.')).toBeVisible();
    await expect(page.getByText('Accept Terms is required.')).toBeVisible();

    await page.locator(`#input_${emailFieldId}`).fill('not-an@-email');
    await page.locator(`#input_${ageFieldId}`).fill('25');
    await page.locator(`#check_${acceptFieldId}`).click();

    await page.getByRole('button', { name: /Submit Application/i }).click();

    await page.locator(`#input_${emailFieldId}`).fill('user@example.com');
    await page.getByRole('button', { name: /Submit Application/i }).click();

    await expect(page.getByText('Submission Successful!')).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Age' })).toBeVisible();
    await expect(page.getByRole('cell', { name: '25' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'Work Email' })).toBeVisible();
    await expect(page.getByRole('cell', { name: 'user@example.com' })).toBeVisible();
  });
});

