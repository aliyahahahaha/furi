const warehouseSection = document.querySelector('.warehouse-section');
const warehouseCards = document.querySelectorAll('.warehouse-card[data-location]');
const mapHotspots = document.querySelectorAll('.map-hotspot[data-location]');

function activateWarehouseLocation(location) {
  warehouseSection.dataset.activeLocation = location;
  warehouseCards.forEach((card) => card.classList.toggle('active', card.dataset.location === location));
  mapHotspots.forEach((hotspot) => hotspot.classList.toggle('active', hotspot.dataset.location === location));
}

function clearWarehouseLocation() {
  warehouseSection.dataset.activeLocation = '';
  warehouseCards.forEach((card) => card.classList.remove('active'));
  mapHotspots.forEach((hotspot) => hotspot.classList.remove('active'));
}

warehouseCards.forEach((card) => {
  card.addEventListener('pointerenter', () => activateWarehouseLocation(card.dataset.location));
  card.addEventListener('mouseenter', () => activateWarehouseLocation(card.dataset.location));
});

mapHotspots.forEach((hotspot) => {
  hotspot.addEventListener('focus', () => activateWarehouseLocation(hotspot.dataset.location));
});

document.querySelector('.warehouse-explorer')?.addEventListener('pointerleave', clearWarehouseLocation);

mapHotspots.forEach((hotspot) => hotspot.addEventListener('click', () => {
  activateWarehouseLocation(hotspot.dataset.location);
}));
