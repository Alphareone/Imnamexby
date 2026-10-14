const DEFAULT_NAMES = [
  { nombre: "Aaron", genero: "Niño" }, { nombre: "Aery", genero: "Niña" },
  { nombre: "Alex", genero: "Unisex" }, { nombre: "Alía", genero: "Niña" },
  { nombre: "Alicia", genero: "Niña" }, { nombre: "Alya", genero: "Niña" },
  { nombre: "Ariel", genero: "Unisex" }, { nombre: "Aurora", genero: "Niña" },
  { nombre: "Celeste", genero: "Niña" }, { nombre: "Corei", genero: "Unisex" },
  { nombre: "Daniela", genero: "Niña" }, { nombre: "David", genero: "Niño" },
  { nombre: "Francisco", genero: "Niño" }, { nombre: "Fredd", genero: "Niño" },
  { nombre: "Gabriella", genero: "Niña" }, { nombre: "Jack", genero: "Niño" },
  { nombre: "Jake", genero: "Niño" }, { nombre: "James", genero: "Niño" },
  { nombre: "Joshep", genero: "Niño" }, { nombre: "Julius", genero: "Niño" },
  { nombre: "June", genero: "Niña" }, { nombre: "Kai", genero: "Unisex" },
  { nombre: "León", genero: "Niño" }, { nombre: "Luna", genero: "Niña" },
  { nombre: "Lya", genero: "Niña" }, { nombre: "Lyra", genero: "Niña" },
  { nombre: "Mar", genero: "Unisex" }, { nombre: "Mary", genero: "Niña" },
  { nombre: "Mia", genero: "Niña" }, { nombre: "Milo", genero: "Niño" },
  { nombre: "Noah", genero: "Unisex" }, { nombre: "Nova", genero: "Unisex" },
  { nombre: "Odette", genero: "Niña" }, { nombre: "Oliver", genero: "Niño" },
  { nombre: "Omar", genero: "Niño" }, { nombre: "Orión", genero: "Niño" },
  { nombre: "Rubén", genero: "Niño" }, { nombre: "Saia", genero: "Niña" },
  { nombre: "Sam", genero: "Unisex" }, { nombre: "Samuel", genero: "Niño" },
  { nombre: "Saria", genero: "Niña" }, { nombre: "Selene", genero: "Niña" },
  { nombre: "Sol", genero: "Unisex" }, { nombre: "Solem", genero: "Niño" },
  { nombre: "Tabi", genero: "Unisex" }, { nombre: "Zafira", genero: "Niña" },
  { nombre: "Zoe", genero: "Niña" }, { nombre: "Talia", genero: "Niña" }
];

const STORAGE_NAMES = "NombresBebesApp";
const STORAGE_FAVORITES = "NombresBebesFavoritos";
let names = readStorage(STORAGE_NAMES, DEFAULT_NAMES);
let favorites = readStorage(STORAGE_FAVORITES, []);

const $ = (id) => document.getElementById(id);
const nameOne = $("nombre1");
const nameTwo = $("nombre2");
const result = $("resultadoFinal");
const saveButton = $("save-favorite");

function readStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback.map(item => ({ ...item }));
  } catch {
    return fallback.map(item => ({ ...item }));
  }
}

function persist(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    toast("El navegador no permitió guardar los cambios en este dispositivo.", "error");
  }
}

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toLocaleLowerCase("es");
}

function capitalizeName(value) {
  return value.trim().replace(/\s+/g, " ").split(" ").map(part =>
    part ? part.charAt(0).toLocaleUpperCase("es") + part.slice(1).toLocaleLowerCase("es") : ""
  ).join(" ");
}

function currentGender() {
  return document.querySelector('input[name="gender"]:checked')?.value || "Niña";
}

function availableNames() {
  const gender = currentGender();
  return names.filter(item => gender === "Unisex"
    ? item.genero === "Unisex"
    : item.genero === gender || item.genero === "Unisex"
  ).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
}

function fillSelect(select, placeholder, options, previousValue = "") {
  select.replaceChildren(new Option(placeholder, ""));
  options.forEach(item => select.add(new Option(item.nombre, item.nombre)));
  if (options.some(item => item.nombre === previousValue)) select.value = previousValue;
}

function updateNameOptions() {
  const previousOne = nameOne.value;
  const previousTwo = nameTwo.value;
  const options = availableNames();
  fillSelect(nameOne, "Elijan un nombre…", options, previousOne);
  fillSelect(nameTwo, "Elijan otro nombre…", options, previousTwo);
  updatePreview();
}

function fullName() {
  return [nameOne.value, nameTwo.value, $("apellido1").value.trim(), $("apellido2").value.trim()]
    .filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

function updatePreview() {
  const one = nameOne.value;
  const two = nameTwo.value;
  const complete = fullName();
  const valid = Boolean(one || two);
  result.textContent = valid ? complete : "Su bebé podría llamarse…";
  $("preview-hint").textContent = valid ? "Imaginen llamarle por este nombre…" : "Cada gran historia comienza con un nombre…";
  $("preview-note").textContent = valid
    ? (one && two && normalizeName(one) === normalizeName(two)
      ? "¡Ups! Prueben combinar dos nombres diferentes para evitar repetirlo."
      : "Díganlo en voz alta y descubran cómo se siente.")
    : "Elijan uno o dos nombres para ver cómo suenan juntos.";
  saveButton.disabled = !valid || (one && two && normalizeName(one) === normalizeName(two));
  $("copy-name").disabled = !valid;
  saveButton.textContent = isFavorite(complete) ? "♥ Guardado en favoritos" : "♡ Guardar favorito";
}

function isFavorite(value) {
  const key = normalizeName(value);
  return favorites.some(item => normalizeName(item.nombre) === key);
}

function toast(message, type = "success") {
  const container = $("toast-container");
  const item = document.createElement("div");
  item.className = `toast ${type}`;
  item.setAttribute("role", "status");
  item.textContent = message;
  container.appendChild(item);
  window.setTimeout(() => item.remove(), 3300);
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-button").forEach(button => {
    const active = button.dataset.tab === tabId;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll(".panel").forEach(panel => {
    const active = panel.id === tabId;
    panel.classList.toggle("active", active);
    panel.hidden = !active;
  });
  if (tabId === "favoritos") renderFavorites();
  if (tabId === "coleccion") renderCollection();
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function surpriseMe() {
  const options = availableNames();
  if (!options.length) {
    toast("No hay nombres en esta categoría todavía. Prueben otra.", "error");
    return;
  }
  const first = randomItem(options);
  let second = "";
  if (options.length > 1 && Math.random() > 0.2) {
    const candidates = options.filter(item => item.nombre !== first.nombre);
    second = randomItem(candidates).nombre;
  }
  nameOne.value = first.nombre;
  nameTwo.value = second;
  updatePreview();
  $("cajaResultado")?.classList.remove("pop");
  result.animate([{ opacity: .4, transform: "translateY(5px) scale(.98)" }, { opacity: 1, transform: "translateY(0) scale(1)" }], { duration: 300, easing: "ease-out" });
  toast("¡Una nueva combinación para imaginar! ✨");
}

function resetBuilder() {
  nameOne.value = "";
  nameTwo.value = "";
  updatePreview();
}

function saveFavorite() {
  const value = fullName();
  if (!value || saveButton.disabled) return;
  if (isFavorite(value)) {
    toast("Este nombre ya está en sus favoritos.", "error");
    return;
  }
  favorites.unshift({ nombre: value, genero: currentGender(), fecha: Date.now() });
  persist(STORAGE_FAVORITES, favorites);
  renderFavoriteCount();
  updatePreview();
  toast("¡Guardado en su lista especial! ♡");
}

function renderFavoriteCount() {
  $("favorite-count").textContent = String(favorites.length);
}

function renderFavorites() {
  const container = $("favorites-list");
  container.replaceChildren();
  $("favorites-empty").hidden = favorites.length > 0;
  favorites.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "favorite-card";
    const title = document.createElement("h3");
    title.textContent = item.nombre;
    const meta = document.createElement("p");
    meta.textContent = `${item.genero || "Nombre favorito"} · Guardado para recordar`;
    const actions = document.createElement("div");
    actions.className = "card-actions";
    const copy = document.createElement("button");
    copy.className = "small-button";
    copy.type = "button";
    copy.textContent = "Copiar";
    copy.addEventListener("click", () => copyText(item.nombre));
    const remove = document.createElement("button");
    remove.className = "small-button danger";
    remove.type = "button";
    remove.textContent = "Quitar";
    remove.addEventListener("click", () => {
      favorites.splice(index, 1);
      persist(STORAGE_FAVORITES, favorites);
      renderFavorites();
      renderFavoriteCount();
      updatePreview();
      toast("Nombre quitado de favoritos.");
    });
    actions.append(copy, remove);
    card.append(title, meta, actions);
    container.append(card);
  });
}

function renderCollection() {
  const search = normalizeName($("search-name").value);
  const filter = $("filter-gender").value;
  const filtered = names.filter(item =>
    (!search || normalizeName(item.nombre).includes(search)) &&
    (filter === "Todos" || item.genero === filter)
  ).sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
  const grid = $("names-grid");
  grid.replaceChildren();
  $("collection-count").textContent = `${filtered.length} ${filtered.length === 1 ? "nombre" : "nombres"}`;
  $("collection-empty").hidden = filtered.length > 0;
  filtered.forEach(item => {
    const card = document.createElement("article");
    card.className = "name-card";
    const textWrap = document.createElement("div");
    const title = document.createElement("strong");
    title.textContent = item.nombre;
    const meta = document.createElement("span");
    meta.className = "name-meta";
    meta.textContent = item.genero;
    textWrap.append(title, meta);
    const choose = document.createElement("button");
    choose.className = "small-button";
    choose.type = "button";
    choose.textContent = "Elegir +";
    choose.addEventListener("click", () => {
      const genderInput = document.querySelector(`input[name="gender"][value="${item.genero === "Unisex" ? currentGender() : item.genero}"]`);
      if (genderInput) genderInput.checked = true;
      updateNameOptions();
      if (!nameOne.value) nameOne.value = item.nombre;
      else if (nameOne.value !== item.nombre) nameTwo.value = item.nombre;
      else nameTwo.value = "";
      updatePreview();
      switchTab("mezclador");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
    card.append(textWrap, choose);
    grid.append(card);
  });
}

function addName(event) {
  event.preventDefault();
  const input = $("new-name");
  const value = capitalizeName(input.value);
  const gender = $("new-gender").value;
  if (!value) return;
  if (names.some(item => normalizeName(item.nombre) === normalizeName(value))) {
    toast(`“${value}” ya forma parte de la colección.`, "error");
    return;
  }
  names.push({ nombre: value, genero: gender });
  persist(STORAGE_NAMES, names);
  input.value = "";
  updateNameOptions();
  renderCollection();
  toast(`¡${value} se añadió a la colección!`);
}

async function copyText(value) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(value);
    } else {
      const temp = document.createElement("textarea");
      temp.value = value;
      temp.style.position = "fixed";
      temp.style.opacity = "0";
      document.body.append(temp);
      temp.select();
      const copied = document.execCommand("copy");
      temp.remove();
      if (!copied) throw new Error("copy failed");
    }
    toast("¡Nombre copiado!");
  } catch {
    toast("No se pudo copiar automáticamente. Pueden seleccionar el nombre y copiarlo.", "error");
  }
}

document.querySelectorAll(".tab-button").forEach(button =>
  button.addEventListener("click", () => switchTab(button.dataset.tab))
);
document.querySelectorAll('input[name="gender"]').forEach(input =>
  input.addEventListener("change", updateNameOptions)
);
[nameOne, nameTwo].forEach(select => select.addEventListener("change", updatePreview));
["apellido1", "apellido2"].forEach(id => $(id).addEventListener("input", updatePreview));
$("swap-surnames").addEventListener("click", () => {
  const first = $("apellido1");
  const second = $("apellido2");
  [first.value, second.value] = [second.value, first.value];
  updatePreview();
});
$("surprise-button").addEventListener("click", surpriseMe);
$("clear-button").addEventListener("click", resetBuilder);
$("save-favorite").addEventListener("click", saveFavorite);
$("copy-name").addEventListener("click", () => copyText(fullName()));
$("add-name-form").addEventListener("submit", addName);
$("search-name").addEventListener("input", renderCollection);
$("filter-gender").addEventListener("change", renderCollection);
document.querySelectorAll("[data-go]").forEach(button =>
  button.addEventListener("click", () => switchTab(button.dataset.go))
);

updateNameOptions();
renderFavoriteCount();
renderFavorites();
renderCollection();
