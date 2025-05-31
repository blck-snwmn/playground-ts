import { test, expect } from '@playwright/experimental-ct-react';
import { Input } from '../src/components/Input';

test.describe('Input Component', () => {
  test('should render basic input', async ({ mount }) => {
    const component = await mount(<Input />);
    const input = component.getByTestId('input-element');
    
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'text');
  });

  test('should render with label', async ({ mount }) => {
    const component = await mount(
      <Input label="Username" name="username" />
    );
    
    const label = component.getByText('Username');
    await expect(label).toBeVisible();
    await expect(label).toHaveAttribute('for', 'username');
  });

  test('should show required indicator', async ({ mount }) => {
    const component = await mount(
      <Input label="Email" required />
    );
    
    const requiredIndicator = component.locator('.input-required');
    await expect(requiredIndicator).toContainText('*');
  });

  test('should handle controlled value', async ({ mount }) => {
    let currentValue = 'initial';
    const handleChange = (value: string) => {
      currentValue = value;
    };
    
    const component = await mount(
      <Input value={currentValue} onChange={handleChange} />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveValue('initial');
  });

  test('should handle uncontrolled value with defaultValue', async ({ mount }) => {
    const component = await mount(
      <Input defaultValue="default text" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveValue('default text');
    
    await input.fill('new text');
    await expect(input).toHaveValue('new text');
  });

  test('should call onChange when typing', async ({ mount }) => {
    let capturedValue = '';
    const handleChange = (value: string) => {
      capturedValue = value;
    };
    
    const component = await mount(
      <Input onChange={handleChange} />
    );
    
    const input = component.getByTestId('input-element');
    await input.fill('test input');
    
    expect(capturedValue).toBe('test input');
  });

  test('should handle email input type', async ({ mount }) => {
    const component = await mount(<Input type="email" />);
    await expect(component.getByTestId('input-element')).toHaveAttribute('type', 'email');
  });

  test('should handle password input type', async ({ mount }) => {
    const component = await mount(<Input type="password" />);
    await expect(component.getByTestId('input-element')).toHaveAttribute('type', 'password');
  });

  test('should handle number input type', async ({ mount }) => {
    const component = await mount(<Input type="number" />);
    await expect(component.getByTestId('input-element')).toHaveAttribute('type', 'number');
  });

  test('should be disabled when disabled prop is true', async ({ mount }) => {
    const component = await mount(
      <Input disabled />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toBeDisabled();
  });

  test('should be readonly when readOnly prop is true', async ({ mount }) => {
    const component = await mount(
      <Input readOnly defaultValue="readonly text" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('readonly');
    await expect(input).toHaveValue('readonly text');
  });

  test('should show error message', async ({ mount }) => {
    const component = await mount(
      <Input name="email" error="Invalid email address" />
    );
    
    const errorText = component.getByRole('alert');
    await expect(errorText).toContainText('Invalid email address');
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAttribute('aria-describedby', 'email-error');
  });

  test('should show helper text when no error', async ({ mount }) => {
    const component = await mount(
      <Input name="username" helperText="Enter your username" />
    );
    
    const helperText = component.locator('.input-helper-text');
    await expect(helperText).toContainText('Enter your username');
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('aria-describedby', 'username-helper');
  });

  test('should not show helper text when error exists', async ({ mount }) => {
    const component = await mount(
      <Input 
        name="field"
        error="Error message" 
        helperText="Helper text" 
      />
    );
    
    await expect(component.getByRole('alert')).toContainText('Error message');
    await expect(component.locator('.input-helper-text')).not.toBeVisible();
  });

  test('should handle placeholder', async ({ mount }) => {
    const component = await mount(
      <Input placeholder="Enter text here" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('placeholder', 'Enter text here');
  });

  test('should handle maxLength attribute', async ({ mount }) => {
    const component = await mount(
      <Input maxLength={10} />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('maxlength', '10');
  });

  test('should handle keyboard events', async ({ mount }) => {
    const events: string[] = [];
    
    const component = await mount(
      <Input
        onKeyDown={() => events.push('keydown')}
        onKeyPress={() => events.push('keypress')}
        onKeyUp={() => events.push('keyup')}
      />
    );
    
    const input = component.getByTestId('input-element');
    await input.press('a');
    
    expect(events).toContain('keydown');
    expect(events).toContain('keyup');
  });

  test('should handle focus and blur events', async ({ mount }) => {
    const events: string[] = [];
    
    const component = await mount(
      <Input
        onFocus={() => events.push('focus')}
        onBlur={() => events.push('blur')}
      />
    );
    
    const input = component.getByTestId('input-element');
    await input.focus();
    expect(events).toContain('focus');
    
    await input.blur();
    expect(events).toContain('blur');
  });

  test('should apply outlined variant class', async ({ mount }) => {
    const component = await mount(<Input variant="outlined" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-outlined/);
  });

  test('should apply filled variant class', async ({ mount }) => {
    const component = await mount(<Input variant="filled" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-filled/);
  });

  test('should apply standard variant class', async ({ mount }) => {
    const component = await mount(<Input variant="standard" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-standard/);
  });

  test('should apply small size class', async ({ mount }) => {
    const component = await mount(<Input size="small" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-small/);
  });

  test('should apply medium size class', async ({ mount }) => {
    const component = await mount(<Input size="medium" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-medium/);
  });

  test('should apply large size class', async ({ mount }) => {
    const component = await mount(<Input size="large" />);
    await expect(component.getByTestId('input-element')).toHaveClass(/input-large/);
  });

  test('should handle autoFocus', async ({ mount }) => {
    const component = await mount(<Input autoFocus />);
    const input = component.getByTestId('input-element');
    
    await expect(input).toBeFocused();
  });

  test('should apply error class when error exists', async ({ mount }) => {
    const component = await mount(
      <Input error="Error message" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveClass(/input-error/);
  });

  test('should handle pattern attribute', async ({ mount }) => {
    const component = await mount(
      <Input pattern="[0-9]*" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveAttribute('pattern', '[0-9]*');
  });

  test('should clear input value', async ({ mount }) => {
    const component = await mount(
      <Input defaultValue="initial text" />
    );
    
    const input = component.getByTestId('input-element');
    await expect(input).toHaveValue('initial text');
    
    await input.clear();
    await expect(input).toHaveValue('');
  });
});