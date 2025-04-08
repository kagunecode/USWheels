import { boltPatternMap } from "../data/data";

const PROXY_BASE = "https://uswheels-proxy.vercel.app/api";
const searchButton = document.getElementById("search-button");

function fetchYears() {
  const yearDropdown = document.getElementById("year-dropdown");

  fetch(`${PROXY_BASE}/years`)
    .then((response) => response.json())
    .then((responseData) => {
      responseData.data.forEach((year) => {
        const option = document.createElement("option");
        option.value = year.slug;
        option.textContent = year.name;
        yearDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching years:", error);
    });

  yearDropdown.addEventListener("change", () => {
    fetchMakes(yearDropdown.value);
  });
}

function fetchMakes(year) {
  const makeDropdown = document.getElementById("make-dropdown");
  makeDropdown.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  makeDropdown.disabled = true;

  fetch(`${PROXY_BASE}/makes?year=${year}`)
    .then((response) => response.json())
    .then((responseData) => {
      makeDropdown.innerHTML = `<option value="" disabled selected>Select a model</option>`;
      makeDropdown.disabled = false;

      responseData.data.forEach((make) => {
        const option = document.createElement("option");
        option.value = make.slug;
        option.textContent = make.name;
        makeDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      modelDropdown.innerHTML = `<option value="" disabled selected>Error fetching models</option>`;
      console.error("Error fetching makes:", error);
    });

  makeDropdown.addEventListener("change", () => {
    fetchModels(makeDropdown.value, year);
  });
}

function fetchModels(make, year) {
  const modelDropdown = document.getElementById("model-dropdown");
  modelDropdown.innerHTML = `<option value="" disabled selected>Loading...</option>`;
  modelDropdown.disabled = true;

  fetch(`${PROXY_BASE}/models?year=${year}&make=${make}`)
    .then((response) => response.json())
    .then((responseData) => {
      modelDropdown.innerHTML = `<option value="" disabled selected>Select a model</option>`;
      modelDropdown.disabled = false;

      responseData.data.forEach((model) => {
        const option = document.createElement("option");
        option.value = model.slug;
        option.textContent = model.name;
        modelDropdown.appendChild(option);
      });
    })
    .catch((error) => {
      console.error("Error fetching models:", error);
      modelDropdown.innerHTML = `<option value="" disabled selected>Error fetching models</option>`;
    });

  modelDropdown.addEventListener("change", () => {
    fetchYears(make, modelDropdown.value);
  });
}

function validateSelections() {
  const make = document.getElementById("make-dropdown").value;
  const model = document.getElementById("model-dropdown").value;
  const year = document.getElementById("year-dropdown").value;

  if (make && model && year) {
    searchButton.disabled = false;
    searchButton.style.cursor = "pointer";
    searchButton.style.opacity = "1";
  } else {
    searchButton.disabled = true;
    searchButton.style.cursor = "not-allowed";
    searchButton.style.opacity = "0.7";
  }
}

document
  .getElementById("make-dropdown")
  .addEventListener("change", validateSelections);
document
  .getElementById("model-dropdown")
  .addEventListener("change", validateSelections);
document
  .getElementById("year-dropdown")
  .addEventListener("change", validateSelections);

searchButton.addEventListener("click", function () {
  const make = document.getElementById("make-dropdown").value;
  const model = document.getElementById("model-dropdown").value;
  const year = document.getElementById("year-dropdown").value;

  if (make && model && year) {
    const API_URL = `${PROXY_BASE}/searchByModel?make=${make}&model=${model}&year=${year}`;

    fetch(API_URL)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.data && data.data[0]) {
          const vehicle = data.data[0];

          let boltPattern =
            vehicle.technical?.bolt_pattern?.replace("x", "X") || "";
          let boltPatterns = [boltPattern];

          if (boltPatternMap[boltPattern]) {
            boltPatterns = [...boltPatterns, ...boltPatternMap[boltPattern]];
          }

          const params = [];
          if (boltPattern)
            params.push(`bolt=${encodeURIComponent(boltPatterns.join(","))}`);

          const queryString = params.join("&");
          const redirectURL = `https://uswheelandtire.com/all-products?${queryString}`;
          console.log("Redirecting to:", redirectURL);
          window.location.href = redirectURL;
        } else {
          console.error("No vehicle data found.");
        }
      })
      .catch((error) => {
        console.error("Error fetching fitment details:", error);
      });
  }
});

document.addEventListener("DOMContentLoaded", fetchYears);
