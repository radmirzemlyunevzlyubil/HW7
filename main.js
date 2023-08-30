const countryContainer = document.querySelector("#countryContainer");
const filterInput = document.querySelector("#filterInput");
const regionSelect = document.querySelector("#regionSelect");
const paginationContainer = document.querySelector(".paginationBody");
const rightButton = document.querySelector(".right");
const leftButton = document.querySelector(".left");
const searchInput = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");

let limit = 24;
let offset = 0;

async function getCountries() {
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json();
    return countries;
  } catch (error) {
    console.log("Error fetching data:", error);
  }
}

async function toPaginate(page) {
  const data = await getCountries();
  offset = page * limit;
  const newDATA = data.slice(offset, offset + limit);
}

function createCountryCard(country) {
  const card = document.createElement("div");
  card.classList.add("country-card");

  const flag = document.createElement("img");
  flag.classList.add("flag");
  flag.src = country.flags.svg;
  flag.alt = `${country.name.common} Flag`;

  const name = document.createElement("h2");
  name.textContent = country.name.common;

  const capital = document.createElement("p");
  capital.textContent = `Capital: ${country?.capital[0]}`;

  const region = document.createElement("p");
  region.textContent = `Region: ${country.region}`;

  card.appendChild(flag);
  card.appendChild(name);
  card.appendChild(capital);
  card.appendChild(region);

  countryContainer.appendChild(card);
}

function renderPagination() {
  const paginationData = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
  paginationData.forEach((item) => {
    const paginate = document.createElement("a");
    paginate.textContent = item;
    paginate.style.cursor = "pointer";
    paginationContainer.appendChild(paginate);
    paginate.addEventListener("click", (e) => {
      e.preventDefault();
      offset = offset + 20;
      limit = limit + 20;
      renderCountries("all");
    });
  });
  rightButton.addEventListener("click", (e) => {
    e.preventDefault();
    offset = offset > 80 ? offset : offset + 20;
    limit = limit > 100 ? limit : limit + 20;
    renderCountries("all");
    console.log(offset, limit);
  });
  leftButton.addEventListener("click", (e) => {
    e.preventDefault();
    offset = offset === 0 ? offset : offset - 20;
    limit = limit === 20 ? limit : limit - 20;
    renderCountries("all");
    console.log(offset, limit);
  });
}

async function renderCountries(regionFilter) {
  const countries = await getCountries();
  countryContainer.innerHTML = "";

  countries.slice(offset, limit).forEach((country) => {
    if (regionFilter === "all" || country.region === regionFilter) {
      createCountryCard(country);
    }
  });
}

filterInput.addEventListener("input", () => {
  const filterValue = filterInput.value.toLowerCase();
  const selectedRegion = regionSelect.value.toLowerCase();
  updateCountryCards(filterValue, selectedRegion);
});

regionSelect.addEventListener("change", () => {
  const selectedRegion = regionSelect.value.toLowerCase();
  const filterValue = filterInput.value.toLowerCase();
  updateCountryCards(filterValue, selectedRegion);
});

async function updateCountryCards(filterValue, selectedRegion) {
  const countries = await getCountries();
  countryContainer.innerHTML = "";

  countries.slice(offset, limit).forEach((country) => {
    const countryName = country.name.common.toLowerCase();
    const countryRegion = country.region.toLowerCase();

    if (
      (countryName.includes(filterValue) || filterValue === "") &&
      (selectedRegion === "all" || countryRegion === selectedRegion)
    ) {
      createCountryCard(country);
    }
  });
}

async function initializeApp() {
  renderPagination();
  renderCountries("all");
}

searchButton.addEventListener("click", () => {
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm !== "") {
    countryContainer.innerHTML = "";
    searchCountries(searchTerm);
  }
});

async function searchCountries(searchTerm) {
  const countries = await getCountries();

  countries.forEach((country) => {
    const countryName = country.name.common.toLowerCase();
    if (countryName.includes(searchTerm)) {
      createCountryCard(country);
    }
  });
}

initializeApp();
