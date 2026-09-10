import { DesStorageCard } from './des-storage-card';
import { DesInverterCard } from './des-inverter-card';
import { DesHouseCard } from './des-house-card';
import { DesStatsCard } from './des-stats-card';
import { DesChartCard } from './des-chart-card';
import { DesDehumidifierCard } from './des-dehumidifier-card';
import { DesCoverCard } from './des-cover-card';
import { DesLightCard } from './des-light-card';
import { DesBedLightCard } from './des-bed-light-card';
import { DesGarageCard } from './des-garage-card';

const VERSION = '0.17.4';

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
  {
    type: 'des-stats-card',
    element: DesStatsCard,
    name: 'Daniels Statistikkarte',
    description:
      'Energiestatistik je Zeitraum (Tag/Woche/Monat/Jahr): Verbrauch, Produktion, Import, Export, Laden, Entladen.',
  },
  {
    type: 'des-chart-card',
    element: DesChartCard,
    name: 'Daniels Chartkarte',
    description:
      'Kopfzeile mit Zeitraum-Umschalter und eingebettetem ApexCharts-Chart je Zeitraum.',
  },
  {
    type: 'des-dehumidifier-card',
    element: DesDehumidifierCard,
    name: 'Daniels Entfeuchterkarte',
    description:
      'Luftentfeuchter: Ist-Feuchte gegen Ziel, 24-h-Verlauf, Störungspillen und Bedienung (Entities oder Demo-Werte).',
  },
  {
    type: 'des-cover-card',
    element: DesCoverCard,
    name: 'Daniels Rollladenkarte',
    description:
      'Rollläden: Gruppensteuerung, Szenen-Kacheln und Einzelrollläden nach Etage (Entities oder Demo-Werte).',
  },
  {
    type: 'des-light-card',
    element: DesLightCard,
    name: 'Daniels Lichtkarte',
    description:
      'Lichter je Raum: An/Aus, Helligkeit und Szenen je Zeile (Entities oder Demo-Werte).',
  },
  {
    type: 'des-bed-light-card',
    element: DesBedLightCard,
    name: 'Daniels Bettlichtkarte',
    description:
      'Bettlicht (Seiten/Kopfenden): Modi und Szenen-Editor. Vorerst nur Oberfläche mit Demo-Werten.',
  },
  {
    type: 'des-garage-card',
    element: DesGarageCard,
    name: 'Daniels Garagenkarte',
    description:
      'Garage: Status-Kacheln je Gerät, aufgeklappt Tabelle mit Leistung, Verbrauch je Zeitraum und An/Aus.',
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
  `%c DANIELS-HOME-ASSISTANT-CARDS %c v${VERSION} `,
  'background:#03a9f4;color:#fff;font-weight:700;border-radius:3px 0 0 3px;padding:2px 4px',
  'background:#555;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px',
);

export {
  DesStorageCard,
  DesInverterCard,
  DesHouseCard,
  DesStatsCard,
  DesChartCard,
  DesDehumidifierCard,
  DesCoverCard,
  DesLightCard,
  DesBedLightCard,
  DesGarageCard,
};
