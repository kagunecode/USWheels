import { wheelColors, wheelModels } from "../data/data";

export function wheelFilters() {
  function createCheckbox(value, fieldName) {
    const label = document.createElement("label");
    label.className = "w-checkbox filter-checkbox-field";
    label.setAttribute("fs-cmsfilter-field", fieldName);
    label.setAttribute("fs-cmsfilter-value", value);

    const input = document.createElement("input");
    input.type = "checkbox";
    input.className = "w-checkbox-input filter-checkbox";
    input.value = value;

    const span = document.createElement("span");
    span.className = "filter-option-text w-form-label";
    span.textContent = value;

    label.appendChild(input);
    label.appendChild(span);

    return label;
  }

  function renderFilter(containerId, values, fieldName) {
    const container = document.getElementById(containerId);
    if (!container) return;

    values.forEach((value) => {
      const checkbox = createCheckbox(value, fieldName);
      container.appendChild(checkbox);
    });
  }

  window.addEventListener("DOMContentLoaded", () => {
    renderFilter("wheelFinish", wheelColors, "WheelFinish");
    renderFilter("wheelModel", wheelModels, "WheelModel");
  });
}
