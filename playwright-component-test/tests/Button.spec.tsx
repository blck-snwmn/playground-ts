import { expect, test } from "@playwright/experimental-ct-react";
import { Button } from "../src/components/Button";

test.describe("Button Component", () => {
  test("should render button with text", async ({ mount }) => {
    const component = await mount(<Button>Click me</Button>);

    await expect(component).toContainText("Click me");
  });

  test("should handle click events", async ({ mount }) => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    const component = await mount(<Button onClick={handleClick}>Click me</Button>);

    await component.click();
    expect(clicked).toBe(true);
  });

  test("should be disabled when disabled prop is true", async ({ mount }) => {
    const component = await mount(<Button disabled>Disabled Button</Button>);

    await expect(component).toBeDisabled();
  });

  test("should apply primary variant class", async ({ mount }) => {
    const component = await mount(<Button variant="primary">Primary</Button>);

    await expect(component).toHaveClass(/btn-primary/);
  });

  test("should apply secondary variant class", async ({ mount }) => {
    const component = await mount(<Button variant="secondary">Secondary</Button>);

    await expect(component).toHaveClass(/btn-secondary/);
  });

  test("should apply danger variant class", async ({ mount }) => {
    const component = await mount(<Button variant="danger">Danger</Button>);

    await expect(component).toHaveClass(/btn-danger/);
  });

  test("should apply small size class", async ({ mount }) => {
    const component = await mount(<Button size="small">Small</Button>);

    await expect(component).toHaveClass(/btn-small/);
  });

  test("should apply medium size class", async ({ mount }) => {
    const component = await mount(<Button size="medium">Medium</Button>);

    await expect(component).toHaveClass(/btn-medium/);
  });

  test("should apply large size class", async ({ mount }) => {
    const component = await mount(<Button size="large">Large</Button>);

    await expect(component).toHaveClass(/btn-large/);
  });

  test("should not trigger click when disabled", async ({ mount }) => {
    let clicked = false;
    const handleClick = () => {
      clicked = true;
    };

    const component = await mount(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );

    // Try to click the disabled button
    await component.click({ force: true });
    expect(clicked).toBe(false);
  });

  test("should use default props", async ({ mount }) => {
    const component = await mount(<Button>Default Button</Button>);

    await expect(component).toHaveClass(/btn-primary/);
    await expect(component).toHaveClass(/btn-medium/);
    await expect(component).not.toBeDisabled();
  });
});
