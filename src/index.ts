import { DesStorageCard } from './des-storage-card';

const CARD_TYPE = 'des-storage-card';
const VERSION = '0.1.0';

if (!customElements.get(CARD_TYPE)) {
  customElements.define(CARD_TYPE, DesStorageCard);
}

// Makes the card show up in the "Add card" picker.
window.customCards = window.customCards ?? [];
if (!window.customCards.some((card) => card.type === CARD_TYPE)) {
  window.customCards.push({
    type: CARD_TYPE,
    name: 'Daniels Speicherkarte',
    description:
      'Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group).',
    preview: false,
  });
}

// eslint-disable-next-line no-console
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${VERSION} `,
  'background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px',
  'background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px',
);

export { DesStorageCard };
