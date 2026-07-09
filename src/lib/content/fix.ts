// Fixed marketing copy + company details, ported verbatim from the prototype's
// `FIX` object and page footer. This seeds Setting.fixedCopy / Setting.company and
// is the default the renderer falls back to. Editable later via /instellingen.

export const COMPANY = {
  name: "SamSam",
  tagline: "geeft energie",
  web: "samsam.nu/energieopslag",
  address1: "Oudegracht 259 · 3511 NM Utrecht",
  address2: "3771 ND Barneveld",
  iban: "NL17 INGB 0008 3925 42",
  btwNr: "NL861192333B01",
  kvk: "77904893",
  contact: "Jimmy Lindeman",
  email: "jimmy@samsam.nu",
  phone: "",
  partner: "Zonneklaar",
} as const;

export const FIX = {
  letter: `Hartelijk dank voor uw interesse in duurzame energieoplossingen. Met genoegen presenteren wij u hierbij onze offerte voor een geïntegreerde batterij-opslagoplossing, volledig afgestemd op uw wensen en energiebehoefte.

Als totaalleverancier bieden wij u een zorgeloze totaaloplossing. Van het eerste advies tot en met de installatie en nazorg nemen wij het volledige traject uit handen. Wij werken uitsluitend met zorgvuldig geselecteerde A-merken, zodat wij u de hoogste kwaliteit en langdurige garantie kunnen garanderen.

Onze installaties worden uitgevoerd volgens de meest recente normeringen en veiligheidsrichtlijnen (PGS-37-1), zodat u niet alleen profiteert van duurzaamheid en rendement, maar ook van zekerheid en compliance.

In de bijgevoegde offerte vindt u een helder overzicht van de voorgestelde oplossing, inclusief technische specificaties, kostenraming en tijdsplanning. Wij staan uiteraard klaar om uw vragen te beantwoorden.`,

  partner: [
    [
      "Heldere samenwerking",
      "Wij adviseren u persoonlijk en nemen u alle zorgen uit handen — inclusief de aanvraag van subsidies en de inkoop van energie.",
    ],
    [
      "Langdurige betrokkenheid",
      "Wij streven naar een relatie van minimaal tien jaar, gebaseerd op wederzijds begrip, vertrouwen en uitstekende service.",
    ],
    [
      "Alles onder één dak",
      "Of het nu gaat om zonnepanelen, batterijen of slimme EMS-systemen, wij installeren én onderhouden alles met eigen specialisten.",
    ],
  ] as [string, string][],

  partnerBox:
    "In samenwerking met Zonneklaar hebben wij meer dan 15 jaar ervaring in de energiemarkt, en de expertise en middelen om onze klanten te helpen bij het duurzaam opwekken, efficiënt opslaan en slim beheren van hun energie.",

  kwaliteit: `Bij SamSam geloven we dat echte duurzaamheid begint met kwaliteit. Daarom leveren we niet zomaar batterijsystemen – we onderzoeken vooraf altijd welk type batterij het beste past bij uw situatie, verbruik en toekomstplannen.

Onze experts analyseren uw energieprofiel, gecombineerd met technische en economische inzichten. Op basis van de resultaten selecteren wij betrouwbare en hoogwaardige producten. Daarbij letten we scherp op veiligheid, garantievoorwaarden en service.

Kiezen voor SamSam betekent kiezen voor zekerheid, slimme keuzes en langdurige kwaliteit.`,

  kwaliteitBox:
    "SamSam is een totaalleverancier. Alle kennis over de energiemarkt, duurzame oplossingen en technische expertise in 1 bedrijf maakt ons uniek.",

  duizend: `SamSam combineert diepgaande kennis van de energiemarkt met directe contacten bij energiemaatschappijen, waardoor u verzekerd bent van maximaal rendement. Ons totaalpakket omvat energieadvies, subsidieaanvragen, zonnepanelen, energieopslag, laadinfrastructuur en eigen service en onderhoud. Met meer dan 1.000 zakelijke installaties staan wij garant voor kwaliteit, betrouwbaarheid en naleving van de nieuwste regelgeving.`,

  fundatie:
    "De fundatie en het grondwerk worden uitgevoerd volgens de technische specificaties en veiligheidseisen van de fabrikant en conform de PGS 37-1 richtlijn. Dit omvat een stabiele, draagkrachtige ondergrond, correcte afwatering en eventuele aanpassingen in de bodemstructuur. Ook kabeldoorvoeren, aarding en kabelsleuven naar de verdeelinrichting worden meegenomen.",

  hekwerk:
    "Het hekwerk en de brandmuur worden gerealiseerd volgens de eisen uit de PGS 37-1 richtlijn: de opstelling wordt afgeschermd tegen onbevoegde toegang en de brandmuur biedt voldoende brandwerendheid. Dit betreft een dubbelstaafmat hekwerk (zwart, 1.8 m hoog met twee loopdeuren) en indien nodig brandwering.",

  pgs:
    "Een batterijopslagsysteem moet voldoen aan de PGS 37-1 richtlijn. De benodigde documenten worden vooraf aangeleverd t.b.v. verzekeraar en omgevingsvergunning: veiligheidsdocumenten (risicoanalyse, brandveiligheidsplan), 3D-bouwtekening en het beantwoorden van vragen voor de omgevingsvergunning.",

  keuring:
    "Bij de keuring wordt gecontroleerd of alle onderdelen veilig en correct zijn aangesloten en functioneren: beveiligingen, ventilatie en temperatuurbeheersing. Na goedkeuring ontvangt u een keuringsrapport dat kan worden overlegd aan de verzekeraar.",

  ac:
    "Het aansluiten van het energieopslagsysteem wordt uitgevoerd door Zonneklaar, conform de laatste regelgeving. Wij zorgen dat de accu’s worden aangesloten en uw huidige installatie zo wordt aangepast dat de accu juist wordt opgenomen. Op basis van een stelpost worden de benodigde AC-werkzaamheden uitgevoerd.",

  ems:
    "Met het EMS van SmartBox haalt u maximaal rendement uit uw energieopslag. Het systeem regelt slim laden en ontladen, verlaagt piekbelastingen en optimaliseert uw verbruik achter de meter. Het speelt in op dynamische energietarieven, zodat u kunt profiteren van goedkope stroom én kunt handelen op de energiemarkt. Via een dashboard houdt u real-time inzicht in prestaties en besparingen.",

  onderhoud:
    "Het batterijopslagsysteem wordt onderhouden volgens PGS 37-1 voor veiligheid, betrouwbaarheid en optimale prestaties: periodieke inspecties, controle en testen van beveiligings-, brand- en noodsystemen, en noodzakelijke updates. Daarnaast wordt het systeem 24/7 gemonitord.",

  betaling: [
    [
      "30% van het totaalbedrag",
      "Bij gunning van de opdracht vragen wij een aanbetaling van 30%; dit is ook de aanbetaling die wij bij de leverancier doen. Na ontvangst wordt de bestelling geplaatst.",
    ],
    [
      "60% van het totaalbedrag",
      "5 dagen voor de definitieve leveringsdatum vragen wij een betaling van 60%. De materialen worden geleverd nadat deze betaling is ontvangen.",
    ],
    ["10% van het totaalbedrag", "Bij oplevering van het project is de laatste termijn 10%."],
  ] as [string, string][],

  voorwaarden: [
    "Wij werken conform PGS 37-1, NEN en ADR.",
    "Wij werken veilig of we werken niet. De stroom wordt in overleg uitgeschakeld wanneer nodig.",
    "Onderbrekingen van werkzaamheden kunnen zorgen voor aanvullende kosten.",
    "Wijzigingen en extra kosten bespreken we vooraf en bevestigen we naar elkaar.",
    "Wettelijke verwijderingsbijdrage is niet opgenomen in deze offerte.",
  ],
} as const;

export type FixedCopy = typeof FIX;
export type CompanyInfo = typeof COMPANY;
