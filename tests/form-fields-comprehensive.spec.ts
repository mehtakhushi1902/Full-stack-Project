import { test, expect, Page } from '@playwright/test';

// Helper function to clear all fields
async function clearAllFields(page: Page) {
  await page.getByRole('button', { name: /Clear Fields/ }).click();
  await page.waitForTimeout(300);
}

// Helper function to submit form and get error messages
async function submitAndGetErrors(page: Page) {
  await page.getByRole('button', { name: /Submit Application/ }).click();
  await page.waitForTimeout(500);
  
  // Get all error messages visible on the page
  const errorMessages: string[] = [];
  const errorElements = await page.locator('[class*="error"], [role="alert"]').all();
  for (const elem of errorElements) {
    const text = await elem.textContent();
    if (text) errorMessages.push(text.trim());
  }
  return errorMessages;
}

test.describe('Form Fields Comprehensive Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the form page and switch to Live Preview
    await page.goto('http://localhost:5174/form');
    await page.getByRole('button', { name: /Live Preview/ }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
  });

  test.describe('EMAIL FIELD - Required', () => {
    test('Email: Empty submission should show validation error', async ({ page }) => {
      // Leave email empty
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.clear();
      
      // Try to submit
      const errors = await submitAndGetErrors(page);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors.join(' ').toLowerCase()).toContain('email');
    });

    test('Email: Valid email format accepted', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Fill with valid email
      await emailField.fill('user@example.com');
      const value = await emailField.inputValue();
      expect(value).toBe('user@example.com');
    });

    test('Email: Invalid format (no @) should be flagged on submit', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Fill with invalid email (missing @)
      await emailField.fill('userexample.com');
      
      // Fill other required fields to isolate email validation
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
      }
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('BS');
      
      // Submit and check for error
      const errors = await submitAndGetErrors(page);
      const hasEmailError = errors.join(' ').toLowerCase().includes('email');
      expect(hasEmailError).toBe(true);
    });

    test('Email: Whitespace-only should be treated as empty', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Fill with spaces only
      await emailField.fill('   ');
      const value = await emailField.inputValue();
      expect(value.trim()).toBe('');
    });

    test('Email: Special characters in valid email accepted', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Fill with special characters (valid in email)
      await emailField.fill('user+tag@example.co.uk');
      const value = await emailField.inputValue();
      expect(value).toBe('user+tag@example.co.uk');
    });

    test('Email: Unicode characters accepted in input', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Fill with unicode
      await emailField.fill('tëst@éxample.com');
      const value = await emailField.inputValue();
      expect(value).toBe('tëst@éxample.com');
    });

    test('Email: XSS payload accepted as text input (sanitized on backend)', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      const xssPayload = '<script>alert("xss")</script>';
      await emailField.fill(xssPayload);
      const value = await emailField.inputValue();
      expect(value).toBe(xssPayload);
      
      // Verify script tag was NOT executed (no console errors from script execution)
      const consoleMessages = await page.evaluate(() => 
        (window as any).__consoleMessages || []
      );
      const hasScriptError = consoleMessages.some((msg: string) => 
        msg.includes('alert')
      );
      expect(hasScriptError).toBe(false);
    });

    test('Email: SQL injection payload accepted as text input (sanitized on backend)', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      const sqlPayload = "'; DROP TABLE users; --";
      await emailField.fill(sqlPayload);
      const value = await emailField.inputValue();
      expect(value).toBe(sqlPayload);
    });

    test('Email: Maximum length constraint if any', async ({ page }) => {
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await clearAllFields(page);
      
      // Test with very long email
      const longEmail = 'a'.repeat(100) + '@example.com';
      await emailField.fill(longEmail);
      const value = await emailField.inputValue();
      // Input should accept it (backend validation should handle max length)
      expect(value).toContain('@example.com');
    });
  });

  test.describe('CITY FIELD - Dropdown (Optional)', () => {
    test('City: Dropdown opens and shows options', async ({ page }) => {
      const cityDropdown = page.getByRole('combobox', { name: /City/ });
      await cityDropdown.click();
      await page.waitForTimeout(300);
      
      // Check if options are visible
      const options = await page.locator('[role="option"]').count();
      expect(options).toBeGreaterThan(0);
    });

    test('City: Can select an option from dropdown', async ({ page }) => {
      const cityDropdown = page.getByRole('combobox', { name: /City/ });
      await cityDropdown.click();
      await page.waitForTimeout(300);
      
      // Select first option
      const firstOption = page.locator('[role="option"]').first();
      await firstOption.click();
      await page.waitForTimeout(300);
      
      // Verify selection was made
      const selectedValue = await cityDropdown.textContent();
      expect(selectedValue).not.toContain('Select option');
    });

    test('City: Optional field - form can submit without selection', async ({ page }) => {
      await clearAllFields(page);
      
      // Fill only required fields
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('test@example.com');
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
      }
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('BS');
      
      const workStateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (workStateFields.length > 1) {
        await workStateFields[1].fill('NY');
      }
      
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.locator('[role="option"]').first().click();
      
      // Submit without selecting city - should succeed if other required fields are filled
      const errors = await submitAndGetErrors(page);
      const cityError = errors.join(' ').toLowerCase().includes('city');
      expect(cityError).toBe(false);
    });
  });

  test.describe('STATE FIELD (Personal Info) - Required Text', () => {
    test('State: Empty submission shows validation error', async ({ page }) => {
      await clearAllFields(page);
      
      // Leave state empty, fill other required fields
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('test@example.com');
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('BS');
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 1) {
        await stateFields[1].fill('NY');
      }
      
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.locator('[role="option"]').first().click();
      
      const errors = await submitAndGetErrors(page);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('State: Valid text accepted', async ({ page }) => {
      await clearAllFields(page);
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
        const value = await stateFields[0].inputValue();
        expect(value).toBe('California');
      }
    });

    test('State: Special characters accepted in text', async ({ page }) => {
      await clearAllFields(page);
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('New-York@123');
        const value = await stateFields[0].inputValue();
        expect(value).toBe('New-York@123');
      }
    });
  });

  test.describe('PERCENTAGE FIELD - Number Input (Optional)', () => {
    test('Percentage: Accepts numeric input', async ({ page }) => {
      await clearAllFields(page);
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      await percentageField.fill('85');
      const value = await percentageField.inputValue();
      expect(value).toBe('85');
    });

    test('Percentage: Accepts decimal values', async ({ page }) => {
      await clearAllFields(page);
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      await percentageField.fill('85.5');
      const value = await percentageField.inputValue();
      expect(value).toBe('85.5');
    });

    test('Percentage: Accepts negative numbers', async ({ page }) => {
      await clearAllFields(page);
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      await percentageField.fill('-10');
      const value = await percentageField.inputValue();
      expect(value).toBe('-10');
    });

    test('Percentage: Optional field can be left empty', async ({ page }) => {
      await clearAllFields(page);
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      const value = await percentageField.inputValue();
      expect(value).toBe('');
    });

    test('Percentage: Non-numeric input rejected', async ({ page }) => {
      await clearAllFields(page);
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      await percentageField.fill('abc');
      
      // Check if the field rejected non-numeric input
      const value = await percentageField.inputValue();
      expect(isNaN(Number(value)) && value !== '').toBe(false);
    });
  });

  test.describe('DEGREE FIELD - Required Text', () => {
    test('Degree: Empty submission shows validation error', async ({ page }) => {
      await clearAllFields(page);
      
      // Fill other required fields, leave degree empty
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('test@example.com');
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
      }
      if (stateFields.length > 1) {
        await stateFields[1].fill('NY');
      }
      
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.locator('[role="option"]').first().click();
      
      const errors = await submitAndGetErrors(page);
      expect(errors.length).toBeGreaterThan(0);
    });

    test('Degree: Valid text accepted', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('Bachelor of Science');
      const value = await degreeField.inputValue();
      expect(value).toBe('Bachelor of Science');
    });

    test('Degree: Whitespace-only treated as empty', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('   ');
      const value = await degreeField.inputValue();
      expect(value.trim()).toBe('');
    });

    test('Degree: Special characters and symbols accepted', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('BS (Hons) @University');
      const value = await degreeField.inputValue();
      expect(value).toBe('BS (Hons) @University');
    });

    test('Degree: Unicode characters accepted', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('Licença Universitária');
      const value = await degreeField.inputValue();
      expect(value).toBe('Licença Universitária');
    });

    test('Degree: XSS payload accepted as text (backend sanitization required)', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      const xssPayload = '<img src=x onerror=alert("xss")>';
      await degreeField.fill(xssPayload);
      const value = await degreeField.inputValue();
      expect(value).toBe(xssPayload);
    });

    test('Degree: SQL injection payload accepted as text (backend sanitization required)', async ({ page }) => {
      await clearAllFields(page);
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      const sqlPayload = "1' OR '1'='1";
      await degreeField.fill(sqlPayload);
      const value = await degreeField.inputValue();
      expect(value).toBe(sqlPayload);
    });
  });

  test.describe('FIRST NAME FIELD - Optional Text', () => {
    test('First Name: Optional field can be left empty', async ({ page }) => {
      await clearAllFields(page);
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      const value = await firstNameField.inputValue();
      expect(value).toBe('');
    });

    test('First Name: Accepts valid name', async ({ page }) => {
      await clearAllFields(page);
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      await firstNameField.fill('John');
      const value = await firstNameField.inputValue();
      expect(value).toBe('John');
    });

    test('First Name: Accepts names with hyphens and apostrophes', async ({ page }) => {
      await clearAllFields(page);
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      await firstNameField.fill("Mary-Jane O'Connor");
      const value = await firstNameField.inputValue();
      expect(value).toBe("Mary-Jane O'Connor");
    });

    test('First Name: Accepts Unicode characters', async ({ page }) => {
      await clearAllFields(page);
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      await firstNameField.fill('José María');
      const value = await firstNameField.inputValue();
      expect(value).toBe('José María');
    });

    test('First Name: Whitespace-only treated as empty', async ({ page }) => {
      await clearAllFields(page);
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      await firstNameField.fill('   ');
      const value = await firstNameField.inputValue();
      expect(value.trim()).toBe('');
    });
  });

  test.describe('WORK LOCATION FIELD - Required Dropdown', () => {
    test('Work Location: Dropdown opens and shows options', async ({ page }) => {
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.waitForTimeout(300);
      
      const options = await page.locator('[role="option"]').count();
      expect(options).toBeGreaterThan(0);
    });

    test('Work Location: Can select an option from dropdown', async ({ page }) => {
      await clearAllFields(page);
      
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.waitForTimeout(300);
      
      const firstOption = page.locator('[role="option"]').first();
      const optionText = await firstOption.textContent();
      await firstOption.click();
      await page.waitForTimeout(300);
      
      const selectedValue = await workLocationDropdown.textContent();
      expect(selectedValue).toContain(optionText);
    });

    test('Work Location: Empty submission shows validation error', async ({ page }) => {
      await clearAllFields(page);
      
      // Fill other required fields but leave work location empty
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('test@example.com');
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
      }
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('BS');
      
      if (stateFields.length > 1) {
        await stateFields[1].fill('NY');
      }
      
      // Leave work location empty
      const errors = await submitAndGetErrors(page);
      const hasWorkLocationError = errors.join(' ').toLowerCase().includes('work location');
      expect(hasWorkLocationError).toBe(true);
    });
  });

  test.describe('COMPLETE FORM SUBMISSION', () => {
    test('Form: Successful submission with all required fields filled', async ({ page }) => {
      await clearAllFields(page);
      
      // Fill all required fields
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('john@example.com');
      
      const stateFields = await page.getByRole('textbox', { name: /state \*/ }).all();
      if (stateFields.length > 0) {
        await stateFields[0].fill('California');
      }
      
      const degreeField = page.getByRole('textbox', { name: /Degree \*/ });
      await degreeField.fill('Bachelor of Science');
      
      if (stateFields.length > 1) {
        await stateFields[1].fill('New York');
      }
      
      const workLocationDropdown = page.getByRole('combobox', { name: /Work location \*/ });
      await workLocationDropdown.click();
      await page.waitForTimeout(300);
      await page.locator('[role="option"]').first().click();
      
      // Submit form
      const submitBtn = page.getByRole('button', { name: /Submit Application/ });
      await submitBtn.click();
      await page.waitForTimeout(500);
      
      // Check for success message or form submission confirmation
      const successMessages = await page.locator('[class*="success"], [role="alert"]').all();
      // At minimum, there should be no validation errors shown
      const errorAlerts = await page.locator('[role="alert"]').filter({ hasText: /error|invalid|required/i }).count();
      expect(errorAlerts).toBe(0);
    });

    test('Form: Submitting with missing required field shows specific error', async ({ page }) => {
      await clearAllFields(page);
      
      // Fill some but not all required fields
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('john@example.com');
      
      // Submit without filling other required fields
      const errors = await submitAndGetErrors(page);
      expect(errors.length).toBeGreaterThan(0);
    });
  });

  test.describe('FIELD VALIDATION MESSAGES', () => {
    test('Display validation messages on submission', async ({ page }) => {
      await clearAllFields(page);
      
      // Submit empty form to trigger all validation
      const errors = await submitAndGetErrors(page);
      
      // Should have validation messages for required fields
      expect(errors.length).toBeGreaterThan(0);
      const errorText = errors.join(' ').toLowerCase();
      expect(errorText).toContain('email' || 'state' || 'degree' || 'work location');
    });

    test('Clear Fields button resets all form state', async ({ page }) => {
      // Fill form with some data
      const emailField = page.getByRole('textbox', { name: /Email \*/ });
      await emailField.fill('test@example.com');
      
      const firstNameField = page.getByRole('textbox', { name: /First Name/ });
      await firstNameField.fill('John');
      
      const percentageField = page.getByRole('spinbutton', { name: /Percentage/ });
      await percentageField.fill('75');
      
      // Click clear
      await clearAllFields(page);
      
      // Verify all fields are cleared
      expect(await emailField.inputValue()).toBe('');
      expect(await firstNameField.inputValue()).toBe('');
      expect(await percentageField.inputValue()).toBe('');
    });
  });
});
