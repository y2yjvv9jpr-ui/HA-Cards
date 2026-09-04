import { DesStorageCard } from './des-storage-card';
import { DesInverterCard } from './des-inverter-card';
import { DesHouseCard } from './des-house-card';

const VERSION = '0.2.0';

interface CardRegistration {
  type: string;
  element: CustomElementConstructor;
  name: string;
  description: string;
}

const CARDS: ReadonlyArray<CardRegistration> = [
  {
    type: 'des-storage-card',
    element: DesStorageCard,
    name: 'Daniels Speicherkarte',
    description:
      'Speicherkarte für Hausakkus (battery) und Wärmespeicher-Gruppen (thermal_group).',
  },
  {
    type: 'des-inverter-card',
    element: DesInverterCard,
    name: 'Daniels Wechselrichterkarte',
    description:
      'Wechselrichter-Übersicht: PV-Leistung, Strings und Phasen (Entities oder Demo-Werte).',
  },
  {
    type: 'des-house-card',
    element: DesHouseCard,
    name: 'Daniels Hauskarte',
    description:
      'Hausverbrauch und Stromherkunft: Solar, Speicher, Netz plus Tageswerte (Entities oder Demo-Werte).',
  },
];

window.customCards = window.customCards ?? [];

for (const card of CARDS) {
  if (!customElements.get(card.type)) {
    customElements.define(card.type, card.element);
  }
  // Makes the card show up in the "Add card" picker.
  if (!window.customCards.some((entry) => entry.type === card.type)) {
    window.customCards.push({
      type: card.type,
      name: card.name,
      description: card.description,
      preview: false,
    });
  }
}

// eslint-disable-next-line no-console
console.info(
  `%c DANIELS-ENERGY-CARDS %c v${VERSION} `,
  'background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px',
  'background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px',
);

export { DesStorageCard, DesInverterCard, DesHouseCard };
