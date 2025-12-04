import { render } from "@testing-library/vue";
import { expect, it } from "vitest";

import ChatView from "./ChatView.vue";

it.skip("renders HeartHandshake at 32px and red", () => {
  const { container } = render(ChatView);
  const svg = container.querySelector("svg");
  expect(svg).toBeTruthy();

  expect(svg?.getAttribute("width")).toBe("32");
  expect(svg?.getAttribute("height")).toBe("32");

  const colorAttr = svg?.getAttribute("stroke");
  expect(colorAttr).toBe("red");
});
