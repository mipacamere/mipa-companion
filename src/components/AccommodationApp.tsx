import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Bike,
  Waves,
  Sailboat,
  Wifi,
} from "lucide-react";

// Type Declarations
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface WindowEventMap {
  beforeinstallprompt: BeforeInstallPromptEvent;
}

const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered successfully:", registration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
};

// Language type
type Language = "en" | "it" | "fr" | "es" | "de" | "zh" | "ru";

// Breakfast Item Type
type BreakfastItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

// Fix: Properly define the Functional Component with return type
const AccommodationApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [documentsSentViaWhatsApp, setDocumentsSentViaWhatsApp] =
    useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

  // Language and Breakfast State
  const [language, setLanguage] = useState<Language>("en");
  const [activeTab, setActiveTab] = useState("info");

  // Translations
  const translations = {
    en: {
      tabs: {
        info: "For You",
        directions: "Directions",
        breakfast: "Breakfast",
        map: "Discover",
        checkout: "Check Out",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "I Have to Check In",
        checkInExisting: "I Have Already Checked In",
      },
      uploadDocuments: {
        title: "Upload Your ID Documents",
        removeButton: "Remove",
        sendDocuments: "Send Documents via WhatsApp",
        continueButton: "Continue to Property Info",
      },
      info: {
        generalInfo: "General Info",
        contactUs: "Contact Us",
        additionalServices: "Additional Services",
        checkin: "Check-in: 3:00 PM - 10:00 PM",
        checkout: "Check-out: By 10:30 AM",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Contact via WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Connect to WiFi",
        },
        services: {
          bikeRental: {
            title: "Bike Rental",
            description: "From €10 per day - Ask us for more information",
          },
          scubaDiving: {
            title: "Scuba Diving",
            description:
              "From €60 per person, book 24h in advance - Ask us for more information",
          },
          miniCruise: {
            title: "Minicruises Tour (2/3 Islands) at the Aeolian Islands",
            description: "From €40 per person - Book with: Navisal or Tarnav",
          },
          privateTour: {
            title: "Private Tour at the Aeolian Islands",
            description: "From €100 per person - Ask us for more information",
          },
        },
      },

      directions: {
        title: "How to Reach Milazzo",
        arriving: {
          title: "How to reach the property",
          byCar: {
            title: "By Car",
            description:
              "If you arrive by car, exit the motorway at the Milazzo toll booth and continue following Viale Sicilia (main road) until the last available exit. Once you arrive, you can easily park in Piazza XXV Aprile, which is located near the property, or in other nearby areas. If you choose a paid parking space (blue lines), you can manage payment through the EasyPark app, which allows you to pay for parking directly from your smartphone.",
          },
          byTrain: {
            title: "By Train",
            description:
              "If you arrive by train, get off at Milazzo station and take one of the buses that connect the station with the city center. The closest stop to our property is the port stop, which can be easily reached with lines 4 and 5. You can check bus schedules directly here.",
          },
          byBus: {
            title: "By Bus (from the Airport or other locations)",
            description:
              "If you arrive by bus, for example from Catania or other locations, get off at the port stop, which is the closest to our property. For more information on direct connections from Catania airport, check the bus schedules here.",
          },
        },
        leaving: {
          title: "Leaving Milazzo",
          byCar: {
            title: "By Car",
            description:
              "If you're leaving by car, you'll need to follow the signs for Viale Sicilia (main road), drive to the end, and then take the Milazzo junction to enter the A20 motorway towards Messina (Catania) or Palermo.",
          },
          byBusToMessina: {
            title: "By Bus (to Messina)",
            description:
              "If you prefer to travel by bus to Messina, you can check the schedules of the following companies: GiuntaBus and AST (Azienda Siciliana Trasporti), which offer several daily connections.",
          },
          byTrain: {
            title: "By Train",
            description:
              "If you need to take the train, take one of the buses departing from the Port stop (lines 4 and 5), which will take you to the train station. You can check bus schedules here.",
          },
          toAirport: {
            title: "To Catania Airport",
            description:
              "If you need to catch a flight from Catania airport, you can use the direct connections from Milazzo. Bus schedules to the airport are available here.",
          },
        },
      },

      map: {
        title: "Discover",
        openInMaps: "Open in Google Maps",
        dayItinerary: "Day Itinerary",
        itineraryDescription:
          "Discover the best of the city in one day with this carefully planned itinerary. Explore must-see attractions, enjoy local experiences, and make the most of your time.",
        exploreButton: "Explore Milazzo",
        mapDescription:
          "Explore Milazzo through this interactive map, highlighting the top attractions, landmarks, and hidden gems to visit throughout the city.",
      },

      checkout: {
        title: "Check-Out Instructions",
        instructions: [
          "Leave all room keys inside the room.",
          "Gather all of your personal belongings, including chargers and electronics.",
          "Double-check the room for any items you may have left behind.",
          "Settle any outstanding payments, including the city tax.",
        ],
        description1:
          "Thank you for choosing to stay with us! We hope you had a wonderful experience. Before you check out, please take a moment to:",
        description2:
          "If you happen to forget any items, don't worry—we offer a mail-back service (additional charges apply) to return any lost belongings.",
        description3:
          "Once you're ready to check out, simply click the button below to notify us. If you need any assistance before you leave, please don't hesitate to reach out. We're here to help!",
        buttonText: "Complete Check Out",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Espresso Coffee",
            description: "Espresso coffee, for a moment of energy and taste",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Decaffeinated Coffee",
            description: "All the taste of espresso, without the caffeine",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "American Coffee",
            description: "Espresso with hot water, smooth and mild",
            price: 2.0,
          },
          {
            id: "coffe-macchiato",
            name: "Macchiato Coffee",
            description:
              "Espresso with a touch of milk, for a soft and bold balance",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description:
              "Espresso, hot milk and soft foam: the quintessential Italian breakfast",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Decaffeinated Cappuccino",
            description:
              "The creaminess of cappuccino, with the lightness of decaffeinated",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Lactose-free Cappuccino",
            description:
              "Full flavor and delicate foam, designed for those who avoid lactose",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Soy Milk Cappuccino",
            description:
              "A plant-based variant with a delicate and natural taste",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Plain Milk",
            description: "Hot or cold, simple and genuine like a cuddle",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Latte Macchiato",
            description:
              "Hot milk with a touch of espresso: delicate, but with character",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Lactose-free Latte Macchiato",
            description:
              "The sweetness of hot milk, without lactose, with a light touch of espresso",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Soy Latte Macchiato",
            description:
              "A creamy embrace of soy milk, with a delicate touch of espresso",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Hot Tea",
            description: "A relaxing infusion, perfect for any break moment",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Ginseng Coffee",
            description:
              "An energizing mix of coffee and ginseng, for a natural and enveloping boost",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Barley Coffee",
            description:
              "A delicate caffeine-free alternative, with the rich and toasted taste of barley",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Iced Coffee",
            description:
              "Refreshing and bold, available with or without cream for an extra touch of sweetness",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Fresh Orange Juice",
            description:
              "Fresh squeezed orange juice, rich in vitamin C with a sweet and fizzy flavor, for an energy boost in every sip",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Pineapple Juice",
            description:
              "A fresh and sweet pineapple juice, perfect for refreshing your palate with an explosion of tropical flavor",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "ACE Juice",
            description:
              "ACE juice, a vitamin mix of orange, carrot and lemon, for a natural energy boost and freshness in every sip",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Pear Juice",
            description:
              "Pear juice, delicate and enveloping, for a sweet and natural taste experience that refreshes body and mind",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Peach Juice",
            description:
              "Peach juice, fresh and juicy, with the sweet flavor of freshly picked fruit, for a moment of pure freshness",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Lemon Granita with Brioche",
            description:
              "A fresh and intense lemon flavor, accompanied by the softness of a warm brioche. The perfect combination for summer",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Strawberry Granita with Brioche",
            description:
              "Sweet and fruity, the strawberry granita combines with the soft brioche for a fresh and irresistible experience",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Coffee Granita with Brioche",
            description:
              "An infusion of intense and refreshing taste, accompanied by the softness of brioche for a unique pleasure",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Plain Croissant",
            description:
              "Simple and soft, perfect for starting the day with lightness",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Chocolate Croissant",
            description:
              "A chocolate heart wrapped in a fragrant pastry, for a sweet awakening",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Jam Croissant",
            description:
              "The sweetness of jam enclosed in a soft and fragrant pastry, for a delicious breakfast",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Custard Croissant",
            description:
              "A soft pastry that contains a rich custard cream, for an irresistible pleasure",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Mixed Berry Croissant",
            description:
              "The sweetness of mixed berries enclosed in a soft pastry, for a fresh and delicious breakfast",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Whole Grain Plain Croissant",
            description:
              "Soft and light, with whole grain flour for a genuine and healthy taste",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Vegan Apple Croissant",
            description:
              "A delicate vegan croissant, filled with sweet apple jam, perfect for a light and natural breakfast",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Slice of Jam Tart",
            description:
              "Slice of jam tart, a delicious dessert with a fragrant base and a heart rich with jam, perfect for a pleasurable break",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Chocolate Sandwich Cookie",
            description:
              "Two soft cookies joined by a delicious chocolate cream, for a sweet moment of pure pleasure",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Jam Sandwich Cookie",
            description:
              "Two fragrant cookies that contain a sweet jam, for a simple and genuine pleasure",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Whole Grain Sandwich Cookie",
            description:
              "Whole grain cookies with a rustic taste, filled with jam, for a healthy and genuine delight",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Gluten-free Cookies",
            description:
              "Gluten-free cookies, fragrant and delicious, prepared with selected ingredients for a genuine taste suitable for those following a gluten-free diet",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Savory Brioche option 1",
            description:
              "Savory brioche with ham and cheese, a soft bun filled with cooked ham and cheese",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Savory Brioche option 2",
            description:
              "Savory brioche with salami and cheese, a soft bun filled with salami and cheese",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Hard-boiled Egg",
            description:
              "Hard-boiled egg, with firm white and soft yolk, simple and nutritious",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Sicilian Breakfast",
            description:
              "Menu for one person: 1 granita with brioche, 1 espresso or fruit juices",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Classic Italian Breakfast",
            description:
              "Menu for one person: 1 croissant, 1 cappuccino, 1 fresh orange juices or 1 fruit juices",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Savory Menu",
            description:
              "Savory menu for one person: 1 savory brioche, 1 hard-boiled eggs, 1 fresh orange juices and 1 coffee",
            price: 6.0,
          },
        ],
        orderTitle: "Order Your Breakfast",
        timeNote:
          "Please note: Orders must be placed at least 30 minutes in advance.",
        yourName: "Your Name",
        namePlaceholder: "Enter your name",
        selectRoom: "Select Room",
        roomPlaceholder: "-- Select Room --",
        menunote: "Choose between menus or single items to order",
      },
    },

    it: {
      tabs: {
        info: "Per Te",
        directions: "Indicazioni",
        breakfast: "Colazione",
        map: "Esplorare",
        checkout: "Check-Out",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "Devo Fare il Check-In",
        checkInExisting: "Ho Già Fatto il Check-In",
      },
      uploadDocuments: {
        title: "Carica i tuoi documenti d'identità",
        removeButton: "Rimuovi",
        sendDocuments: "Invia documenti via WhatsApp",
        continueButton: "Continua alle informazioni della struttura",
      },
      info: {
        generalInfo: "Informazioni Generali",
        contactUs: "Contattaci",
        additionalServices: "Servizi Aggiuntivi",
        checkin: "Check-in: 15:00 - 22:00",
        checkout: "Check-out: Entro le 10:30",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Contatta via WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Connetti al WiFi",
        },
        services: {
          bikeRental: {
            title: "Noleggio Biciclette",
            description: "Da €10 al giorno - Chiedici ulteriori informazioni",
          },
          scubaDiving: {
            title: "Immersioni Subacquee",
            description:
              "Da €60 a persona, prenota 24h in anticipo - Chiedici ulteriori informazioni",
          },
          miniCruise: {
            title: "Tour Minicrociere (2/3 Isole) alle Isole Eolie",
            description: "Da €40 a persona - Prenota con: Navisal o Tarnav",
          },
          privateTour: {
            title: "Tour Privato alle Isole Eolie",
            description: "Da €100 a persona - Chiedici ulteriori informazioni",
          },
        },
      },

      directions: {
        title: "Come Arrivare a Milazzo",
        arriving: {
          title: "Come arrivare alla struttura",
          byCar: {
            title: "In Auto",
            description:
              "Se arrivi in auto, esci dall'autostrada al casello di Milazzo e prosegui seguendo il Viale Sicilia (asse viario) fino all'ultima uscita disponibile. Una volta arrivato, potrai parcheggiare facilmente in Piazza XXV Aprile, che si trova nelle vicinanze della struttura, oppure in altre zone limitrofe. Se scegli una piazzola a pagamento,(strisce blu) puoi gestire il pagamento tramite l'app EasyPark, che ti permette di pagare la sosta direttamente dal tuo smartphone.",
          },
          byTrain: {
            title: "In Treno",
            description:
              "Se arrivi in treno, scendi alla stazione di Milazzo e prendi uno degli autobus che collegano la stazione con il centro città. La fermata più vicina alla nostra struttura è quella del porto, facilmente raggiungibile con le linee 4 e 5. Puoi verificare gli orari degli autobus direttamente qui.",
          },
          byBus: {
            title: "In Autobus (dall'Aeroporto o altre località)",
            description:
              "Se arrivi in autobus, ad esempio da Catania o altre località, scendi alla fermata del porto, che è la più vicina alla nostra struttura. Per maggiori informazioni sui collegamenti diretti dall'aeroporto di Catania, consulta gli orari degli autobus qui.",
          },
        },
        leaving: {
          title: "Lasciando Milazzo",
          byCar: {
            title: "In Auto",
            description:
              "Se parti in auto, dovrai seguire le indicazioni per il Viale Sicilia (asse viario), percorrerlo fino alla fine, e poi prendere lo svincolo di Milazzo per immetterti sull'autostrada A20 direzione Messina(Catania) o Palermo.",
          },
          byBusToMessina: {
            title: "In Autobus (verso Messina)",
            description:
              "Se preferisci viaggiare in autobus verso Messina, puoi consultare gli orari delle seguenti compagnie: GiuntaBus e AST (Azienda Siciliana Trasporti), che offrono diverse corse giornaliere.",
          },
          byTrain: {
            title: "In Treno",
            description:
              "Se devi prendere il treno, prendi uno degli autobus che partono dalla fermata Porto (linee 4 e 5), che ti porteranno alla stazione ferroviaria. Puoi consultare gli orari degli autobus qui.",
          },
          toAirport: {
            title: "Per l'Aeroporto di Catania",
            description:
              "Se devi prendere un volo dall'aeroporto di Catania, puoi utilizzare i collegamenti diretti da Milazzo. Gli orari degli autobus per l'aeroporto sono disponibili qui.",
          },
        },
      },

      map: {
        title: "Scopri la città",
        openInMaps: "Apri in Google Maps",
        dayItinerary: "Itinerario del giorno",
        itineraryDescription:
          "Scopri il meglio della città con questo itinerario giornaliero ben pianificato. Esplora le attrazioni imperdibili, vivi esperienze locali e sfrutta al massimo il tuo tempo.",
        exploreButton: "Esplora Milazzo",
        mapDescription:
          "Esplora Milazzo tramite questa mappa interattiva, evidenziando le principali attrazioni, punti di riferimento e gemme nascoste da visitare in tutta la città.",
      },

      checkout: {
        title: "Istruzioni per il Check-Out",
        instructions: [
          "Lascia tutte le chiavi della stanza all'interno della stanza.",
          "Raccogli tutti i tuoi oggetti personali, compresi caricabatterie ed elettroniche.",
          "Controlla accuratamente la stanza per eventuali oggetti dimenticati.",
          "Regola tutti i pagamenti in sospeso, inclusa la tassa di soggiorno.",
        ],
        description1:
          "Grazie per aver scelto di soggiornare con noi! Speriamo che la tua esperienza sia stata meravigliosa. Prima di effettuare il check-out, ti preghiamo di:",
        description2:
          "Se dimentichi alcuni oggetti, non preoccuparti: offriamo un servizio di rispedizione (con costi aggiuntivi) per restituire gli oggetti smarriti.",
        description3:
          "Una volta pronto per il check-out, clicca semplicemente il pulsante qui sotto per avvisarci. Se hai bisogno di assistenza prima di partire, non esitare a contattarci. Siamo qui per aiutarti!",
        buttonText: "Completa Check-Out",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Caffè Espresso",
            description:
              "Espresso di qualità, per un momento di energia e gusto",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Caffè Decaffeinato",
            description: "Tutto il gusto dell'espresso, senza la caffeina",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "Caffè Americano",
            description: "Espresso allungato, dal gusto delicato",
            price: 2.0,
          },
          {
            id: "coffe-macchiato",
            name: "Caffè Macchiato",
            description:
              "Espresso con un tocco di latte, per un equilibrio morbido e deciso",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description:
              "Espresso, latte caldo e soffice schiuma: la colazione italiana per eccellenza",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Cappuccino decaffeinato",
            description:
              "La cremosità del cappuccino, con la leggerezza del decaffeinato",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Cappuccino senza lattosio",
            description:
              "Gusto pieno e schiuma delicata, pensato per chi evita il lattosio",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Cappuccino latte di soia",
            description: "Una variante vegetale dal gusto delicato e naturale",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Latte bianco",
            description: "Caldo o freddo, semplice e genuino come una coccola",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Latte Macchiato",
            description:
              "Latte caldo con un tocco di espresso: delicato, ma con carattere",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Latte Macchiato senza lattosio",
            description:
              "La dolcezza del latte caldo, senza lattosio, con un leggero tocco di espresso",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Latte di Soia Macchiato",
            description:
              "Un abbraccio cremoso di latte di soia, con un delicato tocco di espresso",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Tè Caldo",
            description:
              "Un'infusione rilassante, perfetta per ogni momento di pausa",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Caffè Ginseng",
            description:
              "Un mix energizzante di caffè e ginseng, per una carica naturale e avvolgente",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Caffè di orzo",
            description:
              "Un'alternativa delicata e senza caffeina, con il gusto ricco e tostato dell'orzo",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Caffè freddo",
            description:
              "Rinfrescante e deciso, disponibile con o senza panna per un tocco extra di dolcezza",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Spremuta di Arance",
            description:
              "Spremuta di arance fresche, ricca di vitamina C e dal sapore dolce e frizzante, per una sferzata di energia in ogni sorso",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Succo di Ananas",
            description:
              "Un succo di ananas fresco e dolce, perfetto per rinfrescare il palato con un'esplosione di gusto tropicale",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "Succo ACE",
            description:
              "Succo ACE, un mix vitaminico di arancia, carota e limone, per una carica di energia naturale e freschezza in ogni sorso",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Succo di Pera",
            description:
              "Succo di pera, delicato e avvolgente, per un'esperienza di gusto dolce e naturale che rinfresca il corpo e la mente",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Succo di Pesca",
            description:
              "Succo di pesca, fresco e succoso, con il dolce sapore della frutta appena raccolta, per un momento di pura freschezza",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Granita al limone con brioches",
            description:
              "Un fresco e intenso sapore di limone, accompagnato dalla morbidezza di una brioche calda. Il connubio perfetto per l'estate",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Granita alla fragola con brioches",
            description:
              "Dolce e fruttata, la granita alla fragola si unisce alla soffice brioche per un'esperienza fresca e irresistibile",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Granita al caffè con brioches",
            description:
              "Un'infusione di gusto intenso e rinfrescante, accompagnata dalla morbidezza della brioche per un piacere unico",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Cornetto Vuoto",
            description:
              "Semplice e soffice, perfetto per iniziare la giornata con leggerezza",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Cornetto al Cioccolato",
            description:
              "Un cuore di cioccolato avvolto in una sfoglia fragrante, per un dolce risveglio",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Cornetto con Marmellata",
            description:
              "La dolcezza della marmellata racchiusa in una sfoglia morbida e fragrante, per una colazione golosa",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Cornetto con Crema",
            description:
              "Una soffice sfoglia che racchiude una ricca crema pasticcera, per un piacere irresistibile",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Cornetto Frutti di Bosco",
            description:
              "La dolcezza dei frutti di bosco racchiusa in una soffice sfoglia, per una colazione fresca e golosa",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Cornetto Vuoto integrale",
            description:
              "Soffice e leggero, con farina integrale per un gusto genuino e salutare",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Cornetto Vegano alla Mela",
            description:
              "Un delicato cornetto vegano, farcito con dolce marmellata di mela, perfetto per una colazione leggera e naturale",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Fetta di crostata",
            description:
              "Fetta di crostata alla marmellata, un dolce goloso con una base fragrante e un cuore ricco di marmellata, perfetta per una pausa di piacere",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Occhio di bue Cioccolato",
            description:
              "Due morbidi biscotti uniti da una golosa crema al cioccolato, per un dolce momento di puro piacere",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Occhio di bue Marmellata",
            description:
              "Due fragranti biscotti che racchiudono una dolce marmellata, per un piacere semplice e genuino",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Occhio di bue Integrale",
            description:
              "Biscotti integrali dal gusto rustico, farciti con marmellata, per una delizia sana e genuina",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Biscotti senza glutine",
            description:
              "Biscotti senza glutine, fragranti e deliziosi, preparati con ingredienti scelti per un gusto genuino e adatto a chi segue una dieta senza glutine",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Brioche salata opz1",
            description:
              "Brioche salata con prosciutto e formaggio, un soffice panino farcito con prosciutto cotto e formaggio",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Brioche salata opz2",
            description:
              "Brioche salata con salame e formaggio, un soffice panino farcito con salame e formaggio",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Uovo sodo",
            description:
              "Uovo sodo, con albume sodo e tuorlo morbido, semplice e nutriente",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Colazione Siciliana",
            description:
              "Menu per una persona: 1 granita con brioche, 1 espresso o succo di frutta",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Colazione Italiana Classica",
            description:
              "Menu per una persona: 1 cornetto, 1 cappuccino, 1 succo d'arancia fresco o 1 succo di frutta",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Menu Salato",
            description:
              "Menu salato per una persona: 1 brioche salata, 1 uovo sodo, 1 succo d'arancia fresco e 1 caffè",
            price: 6.0,
          },
        ],
        orderTitle: "Ordina la Tua Colazione",
        timeNote:
          "Nota: Gli ordini devono essere effettuati con almeno 30 minuti di anticipo.",
        yourName: "Il Tuo Nome",
        namePlaceholder: "Inserisci il tuo nome",
        selectRoom: "Seleziona Camera",
        roomPlaceholder: "-- Seleziona Camera --",
        menunote: "Scegli tra menu o singoli articoli da ordinare",
      },
    },

    fr: {
      tabs: {
        info: "Pour Vous",
        directions: "Indications",
        breakfast: "Petit-déjeuner",
        map: "Plan de la Ville",
        checkout: "Explorer",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "Je Dois M'enregistrer",
        checkInExisting: "Je Suis Déjà Enregistré",
      },
      uploadDocuments: {
        title: "Téléchargez vos pièces d'identité",
        removeButton: "Supprimer",
        sendDocuments: "Envoyer les documents via WhatsApp",
        continueButton: "Continuer vers les informations de l'hébergement",
      },
      info: {
        generalInfo: "Informations Générales",
        contactUs: "Contactez-nous",
        additionalServices: "Services Supplémentaires",
        checkin: "Enregistrement: 15h00 - 22h00",
        checkout: "Départ: Avant 10h30",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Contact via WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Se connecter au WiFi",
        },
        services: {
          bikeRental: {
            title: "Location de Vélos",
            description:
              "À partir de 10€ par jour - Demandez plus d'informations",
          },
          scubaDiving: {
            title: "Plongée Sous-Marine",
            description:
              "À partir de 60€ par personne, réservez 24h à l'avance - Demandez plus d'informations",
          },
          miniCruise: {
            title: "Croisière Miniature (2/3 Îles) aux Îles Éoliennes",
            description:
              "À partir de 40€ par personne - Réservez avec : Navisal ou Tarnav",
          },
          privateTour: {
            title: "Visite Privée aux Îles Éoliennes",
            description:
              "À partir de 100€ par personne - Demandez plus d'informations",
          },
        },
      },

      directions: {
        title: "Comment Arriver à Milazzo",
        arriving: {
          title: "Comment arriver à l'établissement",
          byCar: {
            title: "En Voiture",
            description:
              "Si vous arrivez en voiture, sortez de l'autoroute au péage de Milazzo et continuez en suivant le Viale Sicilia (axe routier principal) jusqu'à la dernière sortie disponible. Une fois arrivé, vous pourrez facilement vous garer sur la Piazza XXV Aprile, qui se trouve à proximité de l'établissement, ou dans d'autres zones environnantes. Si vous choisissez une place de stationnement payante (lignes bleues), vous pouvez gérer le paiement via l'application EasyPark, qui vous permet de payer le stationnement directement depuis votre smartphone.",
          },
          byTrain: {
            title: "En Train",
            description:
              "Si vous arrivez en train, descendez à la gare de Milazzo et prenez l'un des bus qui relient la gare au centre-ville. L'arrêt le plus proche de notre établissement est celui du port, facilement accessible avec les lignes 4 et 5. Vous pouvez vérifier les horaires des bus directement ici.",
          },
          byBus: {
            title: "En Bus (depuis l'Aéroport ou d'autres localités)",
            description:
              "Si vous arrivez en bus, par exemple de Catane ou d'autres localités, descendez à l'arrêt du port, qui est le plus proche de notre établissement. Pour plus d'informations sur les liaisons directes depuis l'aéroport de Catane, consultez les horaires des bus ici.",
          },
        },
        leaving: {
          title: "Quitter Milazzo",
          byCar: {
            title: "En Voiture",
            description:
              "Si vous partez en voiture, vous devrez suivre les indications pour le Viale Sicilia (axe routier principal), le parcourir jusqu'au bout, puis prendre l'échangeur de Milazzo pour vous engager sur l'autoroute A20 direction Messine (Catane) ou Palerme.",
          },
          byBusToMessina: {
            title: "En Bus (vers Messine)",
            description:
              "Si vous préférez voyager en bus vers Messine, vous pouvez consulter les horaires des compagnies suivantes : GiuntaBus et AST (Azienda Siciliana Trasporti), qui proposent plusieurs trajets quotidiens.",
          },
          byTrain: {
            title: "En Train",
            description:
              "Si vous devez prendre le train, prenez l'un des bus qui partent de l'arrêt du Port (lignes 4 et 5), qui vous conduiront à la gare ferroviaire. Vous pouvez consulter les horaires des bus ici.",
          },
          toAirport: {
            title: "Pour l'Aéroport de Catane",
            description:
              "Si vous devez prendre un vol depuis l'aéroport de Catane, vous pouvez utiliser les liaisons directes depuis Milazzo. Les horaires des bus pour l'aéroport sont disponibles ici.",
          },
        },
      },

      map: {
        title: "Explorer",
        openInMaps: "Ouvrir dans Google Maps",
        dayItinerary: "Itinéraire de la journée",
        itineraryDescription:
          "Découvrez le meilleur de la ville en une journée grâce à cet itinéraire soigneusement planifié. Explorez les attractions incontournables, profitez des expériences locales et tirez le meilleur parti de votre temps.",
        exploreButton: "Explorer Milazzo",
        mapDescription:
          "Explorez Milazzo grâce à cette carte interactive, mettant en avant les principales attractions, monuments et joyaux cachés à visiter à travers la ville.",
      },

      checkout: {
        title: "Instructions de Check-Out",
        instructions: [
          "Laissez toutes les clés de la chambre à l'intérieur de la chambre.",
          "Rassemblez tous vos effets personnels, y compris chargeurs et appareils électroniques.",
          "Vérifiez soigneusement la chambre pour tout objet que vous pourriez avoir laissé.",
          "Réglez tous les paiements en suspens, y compris la taxe de séjour.",
        ],
        description1:
          "Merci d'avoir choisi de séjourner chez nous ! Nous espérons que votre expérience a été merveilleuse. Avant de procéder au check-out, prenez un moment pour :",
        description2:
          "Si vous oubliez des objets, ne vous inquiétez pas : nous proposons un service de renvoi par courrier (frais supplémentaires applicables) pour retourner les objets perdus.",
        description3:
          "Une fois prêt à faire le check-out, cliquez simplement sur le bouton ci-dessous pour nous en informer. Si vous avez besoin d'aide avant de partir, n'hésitez pas à nous contacter. Nous sommes là pour vous aider !",
        buttonText: "Terminer le Check-Out",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Café Espresso",
            description: "Café espresso, pour un moment d'énergie et de goût",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Café Décaféiné",
            description: "Tout le goût de l'espresso, sans la caféine",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "Café Américain",
            description: "Espresso allongé, au goût délicat",
            price: 2.0,
          },
          {
            id: "coffe-macchiato",
            name: "Café Macchiato",
            description:
              "Espresso avec une touche de lait, pour un équilibre doux et corsé",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description:
              "Espresso, lait chaud et mousse onctueuse: le petit-déjeuner italien par excellence",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Cappuccino décaféiné",
            description:
              "La crémosité du cappuccino, avec la légèreté du décaféiné",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Cappuccino sans lactose",
            description:
              "Saveur complète et mousse délicate, conçu pour ceux qui évitent le lactose",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Cappuccino au lait de soja",
            description: "Une variante végétale au goût délicat et naturel",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Lait nature",
            description:
              "Chaud ou froid, simple et authentique comme une caresse",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Latte Macchiato",
            description:
              "Lait chaud avec une touche d'espresso: délicat, mais avec du caractère",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Latte Macchiato sans lactose",
            description:
              "La douceur du lait chaud, sans lactose, avec une légère touche d'espresso",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Latte Macchiato au Soja",
            description:
              "Une étreinte crémeuse de lait de soja, avec une touche délicate d'espresso",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Thé Chaud",
            description:
              "Une infusion relaxante, parfaite pour chaque moment de pause",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Café au Ginseng",
            description:
              "Un mélange énergisant de café et de ginseng, pour un boost naturel et enveloppant",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Café d'orge",
            description:
              "Une alternative délicate et sans caféine, avec le goût riche et grillé de l'orge",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Café glacé",
            description:
              "Rafraîchissant et corsé, disponible avec ou sans crème pour une touche supplémentaire de douceur",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Jus d'Orange Pressé",
            description:
              "Jus d'oranges fraîchement pressées, riche en vitamine C et au goût doux et pétillant, pour une dose d'énergie à chaque gorgée",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Jus d'Ananas",
            description:
              "Un jus d'ananas frais et sucré, parfait pour rafraîchir votre palais avec une explosion de saveur tropicale",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "Jus ACE",
            description:
              "Jus ACE, un mélange vitaminé d'orange, carotte et citron, pour une charge d'énergie naturelle et de fraîcheur à chaque gorgée",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Jus de Poire",
            description:
              "Jus de poire, délicat et enveloppant, pour une expérience gustative douce et naturelle qui rafraîchit le corps et l'esprit",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Jus de Pêche",
            description:
              "Jus de pêche, frais et juteux, avec la saveur sucrée des fruits fraîchement cueillis, pour un moment de pure fraîcheur",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Granité au citron avec brioche",
            description:
              "Une saveur fraîche et intense de citron, accompagnée de la douceur d'une brioche chaude. La combinaison parfaite pour l'été",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Granité à la fraise avec brioche",
            description:
              "Doux et fruité, le granité à la fraise se marie à la brioche moelleuse pour une expérience fraîche et irrésistible",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Granité au café avec brioche",
            description:
              "Une infusion de goût intense et rafraîchissant, accompagnée de la douceur de la brioche pour un plaisir unique",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Croissant Nature",
            description:
              "Simple et moelleux, parfait pour commencer la journée avec légèreté",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Croissant au Chocolat",
            description:
              "Un cœur de chocolat enveloppé dans une pâte parfumée, pour un réveil tout en douceur",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Croissant à la Confiture",
            description:
              "La douceur de la confiture enfermée dans une pâte moelleuse et parfumée, pour un petit-déjeuner délicieux",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Croissant à la Crème",
            description:
              "Une pâte moelleuse qui renferme une riche crème pâtissière, pour un plaisir irrésistible",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Croissant aux Fruits des Bois",
            description:
              "La douceur des fruits des bois enfermée dans une pâte moelleuse, pour un petit-déjeuner frais et délicieux",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Croissant Nature complet",
            description:
              "Moelleux et léger, avec de la farine complète pour un goût authentique et sain",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Croissant Végétalien à la Pomme",
            description:
              "Un délicat croissant végétalien, farci de douce confiture de pomme, parfait pour un petit-déjeuner léger et naturel",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Part de tarte",
            description:
              "Part de tarte à la confiture, un dessert délicieux avec une base parfumée et un cœur riche en confiture, parfaite pour une pause plaisir",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Biscuit Sandwich au Chocolat",
            description:
              "Deux biscuits moelleux unis par une délicieuse crème au chocolat, pour un moment sucré de pur plaisir",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Biscuit Sandwich à la Confiture",
            description:
              "Deux biscuits parfumés qui renferment une douce confiture, pour un plaisir simple et authentique",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Biscuit Sandwich Complet",
            description:
              "Biscuits complets au goût rustique, farcis de confiture, pour une délice saine et authentique",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Biscuits sans gluten",
            description:
              "Biscuits sans gluten, parfumés et délicieux, préparés avec des ingrédients sélectionnés pour un goût authentique et adapté à ceux qui suivent un régime sans gluten",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Brioche salée option 1",
            description:
              "Brioche salée au jambon et fromage, un petit pain moelleux farci de jambon cuit et de fromage",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Brioche salée option 2",
            description:
              "Brioche salée au salami et fromage, un petit pain moelleux farci de salami et de fromage",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Œuf dur",
            description:
              "Œuf dur, avec blanc ferme et jaune moelleux, simple et nutritif",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Petit Déjeuner Sicilien",
            description:
              "Menu pour une personne : 1 granita avec brioche, 1 expresso ou jus de fruits",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Petit Déjeuner Italien Classique",
            description:
              "Menu pour une personne : 1 croissant, 1 cappuccino, 1 jus d'orange frais ou 1 jus de fruits",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Menu Salé",
            description:
              "Menu salé pour une personne : 1 brioche salée, 1 œuf dur, 1 jus d'orange frais et 1 café",
            price: 6.0,
          },
        ],
        orderTitle: "Commandez Votre Petit-déjeuner",
        timeNote:
          "Remarque: Les commandes doivent être passées au moins 30 minutes à l'avance.",
        yourName: "Votre Nom",
        namePlaceholder: "Entrez votre nom",
        selectRoom: "Sélectionnez Chambre",
        roomPlaceholder: "-- Sélectionnez Chambre --",
        menunote:
          "Choisissez entre des menus ou des articles individuels à commander",
      },
    },
    es: {
      tabs: {
        info: "Para Ti",
        directions: "Indicaciones",
        breakfast: "Desayuno",
        map: "Explorar",
        checkout: "Check-Out",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "Tengo que Registrarme",
        checkInExisting: "Ya Me He Registrado",
      },
      uploadDocuments: {
        title: "Sube tus documentos de identidad",
        removeButton: "Eliminar",
        sendDocuments: "Enviar documentos por WhatsApp",
        continueButton: "Continuar a la información del alojamiento",
      },
      info: {
        generalInfo: "Información General",
        contactUs: "Contáctanos",
        additionalServices: "Servicios Adicionales",
        checkin: "Check-in: 15:00 - 22:00",
        checkout: "Check-out: Antes de las 10:30",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Contactar por WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Conectar al WiFi",
        },
        services: {
          bikeRental: {
            title: "Alquiler de Bicicletas",
            description: "Desde €10 por día - Solicite más información",
          },
          scubaDiving: {
            title: "Buceo",
            description:
              "Desde €60 por persona, reserve con 24h de antelación - Solicite más información",
          },
          miniCruise: {
            title: "Tour de Mini Cruceros (2/3 Islas) en las Islas Eolias",
            description:
              "Desde €40 por persona - Reserve con: Navisal o Tarnav",
          },
          privateTour: {
            title: "Tour Privado en las Islas Eolias",
            description: "Desde €100 por persona - Solicite más información",
          },
        },
      },

      directions: {
        title: "Cómo Llegar a Milazzo",
        arriving: {
          title: "Cómo llegar al alojamiento",
          byCar: {
            title: "En Coche",
            description:
              "Si llegas en coche, sal de la autopista en el peaje de Milazzo y continúa siguiendo Viale Sicilia (vía principal) hasta la última salida disponible. Una vez que llegues, podrás estacionar fácilmente en la Plaza XXV Aprile, que se encuentra cerca del alojamiento, o en otras zonas cercanas. Si eliges un espacio de estacionamiento de pago (líneas azules), puedes gestionar el pago a través de la aplicación EasyPark, que te permite pagar el estacionamiento directamente desde tu smartphone.",
          },
          byTrain: {
            title: "En Tren",
            description:
              "Si llegas en tren, bájate en la estación de Milazzo y toma uno de los autobuses que conectan la estación con el centro de la ciudad. La parada más cercana a nuestro alojamiento es la del puerto, fácilmente accesible con las líneas 4 y 5. Puedes verificar los horarios de los autobuses directamente aquí.",
          },
          byBus: {
            title: "En Autobús (desde el Aeropuerto u otras localidades)",
            description:
              "Si llegas en autobús, por ejemplo desde Catania u otras localidades, bájate en la parada del puerto, que es la más cercana a nuestro alojamiento. Para más información sobre conexiones directas desde el aeropuerto de Catania, consulta los horarios de los autobuses aquí.",
          },
        },
        leaving: {
          title: "Saliendo de Milazzo",
          byCar: {
            title: "En Coche",
            description:
              "Si sales en coche, deberás seguir las indicaciones hacia Viale Sicilia (vía principal), recorrerlo hasta el final, y luego tomar el enlace de Milazzo para incorporarte a la autopista A20 dirección Messina (Catania) o Palermo.",
          },
          byBusToMessina: {
            title: "En Autobús (hacia Messina)",
            description:
              "Si prefieres viajar en autobús hacia Messina, puedes consultar los horarios de las siguientes compañías: GiuntaBus y AST (Azienda Siciliana Trasporti), que ofrecen varios servicios diarios.",
          },
          byTrain: {
            title: "En Tren",
            description:
              "Si necesitas tomar el tren, toma uno de los autobuses que salen de la parada del Puerto (líneas 4 y 5), que te llevarán a la estación de trenes. Puedes consultar los horarios de los autobuses aquí.",
          },
          toAirport: {
            title: "Al Aeropuerto de Catania",
            description:
              "Si necesitas tomar un vuelo desde el aeropuerto de Catania, puedes utilizar las conexiones directas desde Milazzo. Los horarios de los autobuses para el aeropuerto están disponibles aquí.",
          },
        },
      },

      map: {
        title: "Explorar",
        openInMaps: "Abrir en Google Maps",
        dayItinerary: "Itinerario del día",
        itineraryDescription:
          "Descubre lo mejor de la ciudad en un día con este itinerario cuidadosamente planificado. Explora las atracciones imprescindibles, disfruta de experiencias locales y aprovecha al máximo tu tiempo.",
        exploreButton: "Explorar Milazzo",
        mapDescription:
          "Explora Milazzo a través de este mapa interactivo, destacando las principales atracciones, puntos de referencia y gemas ocultas para visitar por toda la ciudad.",
      },

      checkout: {
        title: "Instrucciones de Check-Out",
        instructions: [
          "Deje todas las llaves de la habitación dentro de la habitación.",
          "Recoja todas sus pertenencias personales, incluidos cargadores y dispositivos electrónicos.",
          "Revise cuidadosamente la habitación para verificar que no haya dejado ningún objeto.",
          "Liquide todos los pagos pendientes, incluido el impuesto turístico.",
        ],
        description1:
          "¡Gracias por elegir alojarse con nosotros! Esperamos que haya tenido una experiencia maravillosa. Antes de hacer el check-out, por favor:",
        description2:
          "Si olvida algún objeto, no se preocupe: ofrecemos un servicio de devolución por correo (con cargos adicionales) para devolver los objetos perdidos.",
        description3:
          "Una vez que esté listo para hacer el check-out, simplemente haga clic en el botón de abajo para notificarnos. Si necesita ayuda antes de irse, no dude en contactarnos. ¡Estamos aquí para ayudarle!",
        buttonText: "Completar Check-Out",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Café Espresso",
            description: "Café espresso, para un momento de energía y sabor",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Café Descafeinado",
            description: "Todo el sabor del espresso, sin la cafeína",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "Café Americano",
            description: "Espresso alargado, de sabor suave",
            price: 2.0,
          },

          {
            id: "coffe-macchiato",
            name: "Café Macchiato",
            description:
              "Espresso con un toque de leche, para un equilibrio suave y decidido",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description:
              "Espresso, leche caliente y espuma suave: el desayuno italiano por excelencia",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Cappuccino descafeinado",
            description:
              "La cremosidad del cappuccino, con la ligereza del descafeinado",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Cappuccino sin lactosa",
            description:
              "Sabor completo y espuma delicada, pensado para quienes evitan la lactosa",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Cappuccino con leche de soja",
            description: "Una variante vegetal con un sabor delicado y natural",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Leche blanca",
            description: "Caliente o fría, simple y genuina como una caricia",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Latte Macchiato",
            description:
              "Leche caliente con un toque de espresso: delicado, pero con carácter",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Latte Macchiato sin lactosa",
            description:
              "La dulzura de la leche caliente, sin lactosa, con un ligero toque de espresso",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Latte Macchiato de Soja",
            description:
              "Un abrazo cremoso de leche de soja, con un delicado toque de espresso",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Té Caliente",
            description:
              "Una infusión relajante, perfecta para cualquier momento de pausa",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Café Ginseng",
            description:
              "Una mezcla energizante de café y ginseng, para una carga natural y envolvente",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Café de cebada",
            description:
              "Una alternativa delicada y sin cafeína, con el sabor rico y tostado de la cebada",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Café frío",
            description:
              "Refrescante y decidido, disponible con o sin nata para un toque extra de dulzura",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Zumo de Naranja",
            description:
              "Zumo de naranjas frescas, rico en vitamina C y con sabor dulce y efervescente, para una dosis de energía en cada sorbo",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Zumo de Piña",
            description:
              "Un zumo de piña fresco y dulce, perfecto para refrescar el paladar con una explosión de sabor tropical",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "Zumo ACE",
            description:
              "Zumo ACE, una mezcla vitamínica de naranja, zanahoria y limón, para una carga de energía natural y frescura en cada sorbo",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Zumo de Pera",
            description:
              "Zumo de pera, delicado y envolvente, para una experiencia de sabor dulce y natural que refresca el cuerpo y la mente",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Zumo de Melocotón",
            description:
              "Zumo de melocotón, fresco y jugoso, con el dulce sabor de la fruta recién recogida, para un momento de pura frescura",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Granizado de limón con brioche",
            description:
              "Un fresco e intenso sabor a limón, acompañado de la suavidad de un brioche caliente. La combinación perfecta para el verano",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Granizado de fresa con brioche",
            description:
              "Dulce y afrutado, el granizado de fresa se une al suave brioche para una experiencia fresca e irresistible",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Granizado de café con brioche",
            description:
              "Una infusión de sabor intenso y refrescante, acompañada de la suavidad del brioche para un placer único",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Croissant Vacío",
            description:
              "Simple y suave, perfecto para comenzar el día con ligereza",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Croissant de Chocolate",
            description:
              "Un corazón de chocolate envuelto en una masa fragante, para un dulce despertar",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Croissant con Mermelada",
            description:
              "La dulzura de la mermelada encerrada en una masa suave y fragante, para un desayuno delicioso",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Croissant con Crema",
            description:
              "Una suave masa que contiene una rica crema pastelera, para un placer irresistible",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Croissant de Frutos del Bosque",
            description:
              "La dulzura de los frutos del bosque encerrada en una suave masa, para un desayuno fresco y delicioso",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Croissant Vacío integral",
            description:
              "Suave y ligero, con harina integral para un sabor genuino y saludable",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Croissant Vegano de Manzana",
            description:
              "Un delicado croissant vegano, relleno de dulce mermelada de manzana, perfecto para un desayuno ligero y natural",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Porción de tarta",
            description:
              "Porción de tarta de mermelada, un postre delicioso con una base fragante y un corazón rico en mermelada, perfecta para una pausa de placer",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Galleta Sandwich de Chocolate",
            description:
              "Dos galletas suaves unidas por una deliciosa crema de chocolate, para un dulce momento de puro placer",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Galleta Sandwich de Mermelada",
            description:
              "Dos galletas fragantes que contienen una dulce mermelada, para un placer simple y genuino",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Galleta Sandwich Integral",
            description:
              "Galletas integrales de sabor rústico, rellenas de mermelada, para una delicia sana y genuina",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Galletas sin gluten",
            description:
              "Galletas sin gluten, fragantes y deliciosas, preparadas con ingredientes seleccionados para un sabor genuino y adecuado para quienes siguen una dieta sin gluten",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Brioche salado opción 1",
            description:
              "Brioche salado con jamón y queso, un pan suave relleno de jamón cocido y queso",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Brioche salado opción 2",
            description:
              "Brioche salado con salami y queso, un pan suave relleno de salami y queso",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Huevo duro",
            description:
              "Huevo duro, con clara firme y yema suave, simple y nutritivo",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Desayuno Siciliano",
            description:
              "Menú para una persona: 1 granizado con brioche, 1 café expreso o zumo de frutas",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Desayuno Italiano Clásico",
            description:
              "Menú para una persona: 1 croissant, 1 capuchino, 1 zumo de naranja natural o 1 zumo de frutas",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Menú Salado",
            description:
              "Menú salado para una persona: 1 brioche salado, 1 huevo duro, 1 zumo de naranja natural y 1 café",
            price: 6.0,
          },
        ],
        orderTitle: "Ordena Tu Desayuno",
        timeNote:
          "Nota: Los pedidos deben realizarse con al menos 30 minutos de anticipación.",
        yourName: "Tu Nombre",
        namePlaceholder: "Introduce tu nombre",
        selectRoom: "Seleccionar Habitación",
        roomPlaceholder: "-- Seleccionar Habitación --",
        menunote: "Elija entre menús o artículos individuales para pedir",
      },
    },

    de: {
      tabs: {
        info: "Für Sie",
        directions: "Hinweise",
        breakfast: "Frühstück",
        map: "Erforschen",
        checkout: "Check-Out",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "Ich Muss Einchecken",
        checkInExisting: "Ich Habe Bereits Eingecheckt",
      },
      uploadDocuments: {
        title: "Laden Sie Ihre Ausweisdokumente hoch",
        removeButton: "Entfernen",
        sendDocuments: "Dokumente über WhatsApp senden",
        continueButton: "Weiter zu den Unterkunftsinformationen",
      },
      info: {
        generalInfo: "Allgemeine Informationen",
        contactUs: "Kontaktieren Sie uns",
        additionalServices: "Zusätzliche Dienstleistungen",
        checkin: "Check-in: 15:00 - 22:00 Uhr",
        checkout: "Check-out: Bis 10:30 Uhr",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Kontakt über WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Mit WLAN verbinden",
        },
        services: {
          bikeRental: {
            title: "Fahrradverleih",
            description:
              "Ab €10 pro Tag - Fragen Sie nach weiteren Informationen",
          },
          scubaDiving: {
            title: "Tauchen",
            description:
              "Ab €60 pro Person, 24h im Voraus buchen - Fragen Sie nach weiteren Informationen",
          },
          miniCruise: {
            title: "Minikreuzfahrt (2/3 Inseln) auf den Äolischen Inseln",
            description:
              "Ab €40 pro Person - Buchen Sie bei: Navisal oder Tarnav",
          },
          privateTour: {
            title: "Privattour auf den Äolischen Inseln",
            description:
              "Ab €100 pro Person - Fragen Sie nach weiteren Informationen",
          },
        },
      },

      directions: {
        title: "Wie man nach Milazzo kommt",
        arriving: {
          title: "Wie man zur Unterkunft kommt",
          byCar: {
            title: "Mit dem Auto",
            description:
              "Wenn Sie mit dem Auto anreisen, verlassen Sie die Autobahn an der Mautstelle Milazzo und folgen Sie dem Viale Sicilia (Hauptstraße) bis zur letzten verfügbaren Ausfahrt. Nach Ihrer Ankunft können Sie bequem auf der Piazza XXV Aprile parken, die sich in der Nähe der Unterkunft befindet, oder in anderen nahegelegenen Bereichen. Wenn Sie einen kostenpflichtigen Parkplatz wählen (blaue Linien), können Sie die Zahlung über die EasyPark-App verwalten, mit der Sie die Parkgebühren direkt von Ihrem Smartphone aus bezahlen können.",
          },
          byTrain: {
            title: "Mit dem Zug",
            description:
              "Wenn Sie mit dem Zug anreisen, steigen Sie am Bahnhof Milazzo aus und nehmen Sie einen der Busse, die den Bahnhof mit dem Stadtzentrum verbinden. Die nächstgelegene Haltestelle zu unserer Unterkunft ist die Hafenhaltestelle, die mit den Linien 4 und 5 leicht zu erreichen ist. Die Busfahrpläne können Sie direkt hier einsehen.",
          },
          byBus: {
            title: "Mit dem Bus (vom Flughafen oder anderen Orten)",
            description:
              "Wenn Sie mit dem Bus anreisen, zum Beispiel von Catania oder anderen Orten, steigen Sie an der Hafenhaltestelle aus, die der Unterkunft am nächsten liegt. Weitere Informationen zu direkten Verbindungen vom Flughafen Catania finden Sie hier in den Busfahrplänen.",
          },
        },
        leaving: {
          title: "Abreise aus Milazzo",
          byCar: {
            title: "Mit dem Auto",
            description:
              "Wenn Sie mit dem Auto abreisen, müssen Sie den Schildern zum Viale Sicilia (Hauptstraße) folgen, bis zum Ende fahren und dann die Ausfahrt Milazzo nehmen, um auf die Autobahn A20 in Richtung Messina (Catania) oder Palermo zu gelangen.",
          },
          byBusToMessina: {
            title: "Mit dem Bus (nach Messina)",
            description:
              "Wenn Sie lieber mit dem Bus nach Messina reisen möchten, können Sie die Fahrpläne der folgenden Unternehmen einsehen: GiuntaBus und AST (Azienda Siciliana Trasporti), die mehrere tägliche Fahrten anbieten.",
          },
          byTrain: {
            title: "Mit dem Zug",
            description:
              "Wenn Sie mit dem Zug fahren müssen, nehmen Sie einen der Busse, die von der Hafenhaltestelle abfahren (Linien 4 und 5), die Sie zum Bahnhof bringen. Die Busfahrpläne können Sie hier einsehen.",
          },
          toAirport: {
            title: "Zum Flughafen Catania",
            description:
              "Wenn Sie einen Flug vom Flughafen Catania nehmen müssen, können Sie die direkten Verbindungen von Milazzo nutzen. Die Busfahrpläne zum Flughafen sind hier verfügbar.",
          },
        },
      },

      map: {
        title: "Erforschen",
        openInMaps: "In Google Maps öffnen",
        dayItinerary: "Tagesplanung",
        itineraryDescription:
          "Entdecken Sie das Beste der Stadt an einem Tag mit diesem sorgfältig geplanten Reiseverlauf. Erkunden Sie die wichtigsten Sehenswürdigkeiten, genießen Sie lokale Erlebnisse und nutzen Sie Ihre Zeit optimal.",
        exploreButton: "Milazzo erkunden",
        mapDescription:
          "Erkunden Sie Milazzo mit dieser interaktiven Karte, die die wichtigsten Sehenswürdigkeiten, Wahrzeichen und versteckten Schätze der Stadt hervorhebt.",
      },

      checkout: {
        title: "Check-Out-Anweisungen",
        instructions: [
          "Lassen Sie alle Zimmerschlüssel im Zimmer.",
          "Sammeln Sie alle persönlichen Gegenstände, einschließlich Ladegeräte und elektronischer Geräte.",
          "Überprüfen Sie das Zimmer sorgfältig auf vergessene Gegenstände.",
          "Begleichen Sie alle offenen Zahlungen, einschließlich der Touristensteuer.",
        ],
        description1:
          "Vielen Dank, dass Sie sich für uns entschieden haben! Wir hoffen, Sie hatten eine wunderbare Erfahrung. Bevor Sie auschecken, nehmen Sie sich einen Moment Zeit für:",
        description2:
          "Sollten Sie etwas vergessen haben, keine Sorge: Wir bieten einen Rücksendeservice (zusätzliche Gebühren fallen an) für verlorene Gegenstände an.",
        description3:
          "Wenn Sie bereit sind auszuchecken, klicken Sie einfach auf den Knopf unten, um uns zu benachrichtigen. Wenn Sie Hilfe benötigen, bevor Sie abreisen, zögern Sie nicht, uns zu kontaktieren. Wir sind hier, um Ihnen zu helfen!",
        buttonText: "Check-Out abschließen",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Espresso Kaffee",
            description:
              "Espresso Kaffee, für einen Moment voller Energie und Geschmack",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Entkoffeinierter Kaffee",
            description: "Der volle Geschmack von Espresso, ohne Koffein",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "Americano Kaffee",
            description: "Verlängerter Espresso mit mildem Geschmack",
            price: 2.0,
          },

          {
            id: "coffe-macchiato",
            name: "Caffè Macchiato",
            description:
              "Espresso mit einem Hauch Milch, für ein sanftes und kräftiges Gleichgewicht",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Cappuccino",
            description:
              "Espresso, heiße Milch und weicher Schaum: das italienische Frühstück schlechthin",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Entkoffeinierter Cappuccino",
            description:
              "Die Cremigkeit des Cappuccinos, mit der Leichtigkeit des Entkoffeinierten",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Laktosefreier Cappuccino",
            description:
              "Voller Geschmack und zarter Schaum, für alle, die Laktose meiden",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Sojamilch Cappuccino",
            description:
              "Eine pflanzliche Variante mit delikatem und natürlichem Geschmack",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Reine Milch",
            description: "Heiß oder kalt, einfach und echt wie eine Umarmung",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Latte Macchiato",
            description:
              "Heiße Milch mit einem Hauch Espresso: delikat, aber mit Charakter",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Laktosefreier Latte Macchiato",
            description:
              "Die Süße heißer Milch, ohne Laktose, mit einem leichten Hauch von Espresso",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Soja Latte Macchiato",
            description:
              "Eine cremige Umarmung aus Sojamilch, mit einem zarten Hauch von Espresso",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Heißer Tee",
            description: "Ein entspannender Aufguss, perfekt für jede Pause",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Ginseng Kaffee",
            description:
              "Eine energiespendende Mischung aus Kaffee und Ginseng, für einen natürlichen und umhüllenden Energieschub",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Gerstenkaffee",
            description:
              "Eine sanfte Alternative ohne Koffein, mit dem reichen und gerösteten Geschmack von Gerste",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Eiskaffee",
            description:
              "Erfrischend und kräftig, erhältlich mit oder ohne Sahne für einen zusätzlichen Hauch von Süße",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Frischer Orangensaft",
            description:
              "Frisch gepresster Orangensaft, reich an Vitamin C und mit süßem, prickelndem Geschmack, für einen Energieschub in jedem Schluck",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Ananassaft",
            description:
              "Ein frischer und süßer Ananassaft, perfekt, um den Gaumen mit einer Explosion tropischen Geschmacks zu erfrischen",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "ACE Saft",
            description:
              "ACE Saft, eine vitaminreiche Mischung aus Orange, Karotte und Zitrone, für natürliche Energie und Frische in jedem Schluck",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Birnensaft",
            description:
              "Birnensaft, delikat und umhüllend, für ein süßes und natürliches Geschmackserlebnis, das Körper und Geist erfrischt",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Pfirsichsaft",
            description:
              "Pfirsichsaft, frisch und saftig, mit dem süßen Geschmack frisch gepflückter Früchte, für einen Moment purer Frische",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Zitronengranita mit Brioche",
            description:
              "Ein frischer und intensiver Zitronengeschmack, begleitet von der Weichheit einer warmen Brioche. Die perfekte Kombination für den Sommer",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Erdbeergranita mit Brioche",
            description:
              "Süß und fruchtig, die Erdbeergranita vereint sich mit der weichen Brioche für ein frisches und unwiderstehliches Erlebnis",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Kaffeegranita mit Brioche",
            description:
              "Eine Infusion von intensivem und erfrischendem Geschmack, begleitet von der Weichheit der Brioche für einen einzigartigen Genuss",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Einfaches Croissant",
            description:
              "Einfach und weich, perfekt um den Tag mit Leichtigkeit zu beginnen",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Schokoladen-Croissant",
            description:
              "Ein Schokoladenherz in duftendem Gebäck, für ein süßes Erwachen",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Marmeladen-Croissant",
            description:
              "Die Süße der Marmelade in einem weichen und duftenden Gebäck, für ein köstliches Frühstück",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Croissant mit Creme",
            description:
              "Ein weiches Gebäck mit einer reichen Vanillecrème, für ein unwiderstehliches Vergnügen",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Waldbeeren-Croissant",
            description:
              "Die Süße der Waldbeeren in einem weichen Gebäck, für ein frisches und köstliches Frühstück",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Vollkorn-Croissant",
            description:
              "Weich und leicht, mit Vollkornmehl für einen echten und gesunden Geschmack",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Veganes Apfel-Croissant",
            description:
              "Ein zartes veganes Croissant, gefüllt mit süßer Apfelmarmelade, perfekt für ein leichtes und natürliches Frühstück",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Stück Marmeladentarte",
            description:
              "Stück Marmeladentarte, ein köstliches Dessert mit einer duftenden Basis und einem marmeladereichen Herz, perfekt für eine genussvolle Pause",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Schokoladen-Sandwich-Keks",
            description:
              "Zwei weiche Kekse, verbunden durch eine köstliche Schokoladencreme, für einen süßen Moment reinen Vergnügens",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Marmeladen-Sandwich-Keks",
            description:
              "Zwei duftende Kekse mit süßer Marmelade, für ein einfaches und echtes Vergnügen",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Vollkorn-Sandwich-Keks",
            description:
              "Vollkornkekse mit rustikalem Geschmack, gefüllt mit Marmelade, für einen gesunden und echten Genuss",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Glutenfreie Kekse",
            description:
              "Glutenfreie Kekse, duftend und köstlich, zubereitet mit ausgewählten Zutaten für einen echten Geschmack, geeignet für alle, die eine glutenfreie Ernährung befolgen",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Herzhafte Brioche Option 1",
            description:
              "Herzhafte Brioche mit Schinken und Käse, ein weiches Brötchen gefüllt mit gekochtem Schinken und Käse",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Herzhafte Brioche Option 2",
            description:
              "Herzhafte Brioche mit Salami und Käse, ein weiches Brötchen gefüllt mit Salami und Käse",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Hartgekochtes Ei",
            description:
              "Hartgekochtes Ei, mit festem Eiweiß und weichem Eigelb, einfach und nahrhaft",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Sizilianisches Frühstück",
            description:
              "Menü für eine Person: 1 Granita mit Brioche, 1 Espresso oder Fruchtsaft",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Klassisches Italienisches Frühstück",
            description:
              "Menü für eine Person: 1 Croissant, 1 Cappuccino, 1 frischer Orangensaft oder 1 Fruchtsaft",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Herzhaftes Menü",
            description:
              "Herzhaftes Menü für eine Person: 1 herzhafte Brioche, 1 hartgekochtes Ei, 1 frischer Orangensaft und 1 Kaffee",
            price: 6.0,
          },
        ],
        orderTitle: "Bestellen Sie Ihr Frühstück",
        timeNote:
          "Hinweis: Bestellungen müssen mindestens 30 Minuten im Voraus aufgegeben werden.",
        yourName: "Ihr Name",
        namePlaceholder: "Geben Sie Ihren Namen ein",
        selectRoom: "Zimmer Auswählen",
        roomPlaceholder: "-- Zimmer Auswählen --",
        menunote:
          "Wählen Sie zwischen Menüs oder einzelnen Artikeln zur Bestellung",
      },
    },

    zh: {
      tabs: {
        info: "为您",
        directions: "指示",
        breakfast: "早餐",
        map: "探索",
        checkout: "退房",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "我需要办理入住",
        checkInExisting: "我已经办理了入住",
      },
      uploadDocuments: {
        title: "上传您的身份证件",
        removeButton: "删除",
        sendDocuments: "通过WhatsApp发送文件",
        continueButton: "继续查看住宿信息",
      },
      info: {
        generalInfo: "一般信息",
        contactUs: "联系我们",
        additionalServices: "附加服务",
        checkin: "入住：下午3:00 - 晚上10:00",
        checkout: "退房：上午10:30前",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "通过WhatsApp联系",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "连接WiFi",
        },
        services: {
          bikeRental: {
            title: "自行车租赁",
            description: "每天€10起 - 询问更多详情",
          },
          scubaDiving: {
            title: "潜水",
            description: "每人€60起，提前24小时预订 - 询问更多详情",
          },
          miniCruise: {
            title: "埃奥利安群岛迷你游船（2/3个岛屿）",
            description: "每人€40起 - 通过Navisal或Tarnav预订",
          },
          privateTour: {
            title: "埃奥利安群岛私人游",
            description: "每人€100起 - 询问更多详情",
          },
        },
      },

      directions: {
        title: "如何到达米拉佐",
        arriving: {
          title: "如何到达住宿地点",
          byCar: {
            title: "驾车",
            description:
              "如果您驾车前来，请在米拉佐收费站下高速公路，然后沿着西西里大道（主干道）继续行驶，直到最后一个可用出口。到达后，您可以轻松地在XXV Aprile广场停车，该广场位于住宿地点附近，或者在其他邻近区域停车。如果您选择付费停车位（蓝线），您可以通过EasyPark应用程序管理付款，该应用程序允许您直接通过智能手机支付停车费。",
          },
          byTrain: {
            title: "乘火车",
            description:
              "如果您乘火车前来，请在米拉佐站下车，然后乘坐连接车站与市中心的巴士之一。最靠近我们住宿地点的站点是港口站，可以通过4号和5号线轻松到达。您可以直接在这里查看巴士时刻表。",
          },
          byBus: {
            title: "乘巴士（从机场或其他地方）",
            description:
              "如果您乘巴士前来，例如从卡塔尼亚或其他地方，请在港口站下车，该站是最靠近我们住宿地点的站点。有关从卡塔尼亚机场直达的更多信息，请在这里查看巴士时刻表。",
          },
        },
        leaving: {
          title: "离开米拉佐",
          byCar: {
            title: "驾车",
            description:
              "如果您驾车离开，您需要按照指示前往西西里大道（主干道），一直行驶到尽头，然后取道米拉佐交叉口进入A20高速公路，朝着墨西拿（卡塔尼亚）或巴勒莫方向。",
          },
          byBusToMessina: {
            title: "乘巴士（前往墨西拿）",
            description:
              "如果您更喜欢乘巴士前往墨西拿，您可以查看以下公司的时刻表：GiuntaBus和AST（西西里运输公司），它们提供多个每日班次。",
          },
          byTrain: {
            title: "乘火车",
            description:
              "如果您需要乘火车，请乘坐从港口站出发的巴士之一（4号和5号线），它们会带您到火车站。您可以在这里查看巴士时刻表。",
          },
          toAirport: {
            title: "前往卡塔尼亚机场",
            description:
              "如果您需要从卡塔尼亚机场乘飞机，您可以使用从米拉佐出发的直达交通。前往机场的巴士时刻表可以在这里查看。",
          },
        },
      },

      map: {
        title: "探索",
        openInMaps: "在 Google 地图中打开",
        dayItinerary: "一日行程",
        itineraryDescription:
          "通过这个精心规划的行程，在一天内发现城市的最佳景点。探索必游景点，体验当地文化，充分利用您的时间。",
        exploreButton: "探索米拉佐",
        mapDescription:
          "通过这张互动地图探索米拉佐，突出显示城市中的主要景点、地标和隐藏的宝藏。",
      },

      checkout: {
        title: "退房指南",
        instructions: [
          "将所有房间钥匙留在房间内。",
          "收拾所有个人物品，包括充电器和电子设备。",
          "仔细检查房间，确保没有遗漏任何物品。",
          "结清所有未付款项，包括城市税。",
        ],
        description1:
          "感谢您选择入住！希望您度过了美好的时光。退房前，请注意：",
        description2:
          "如果遗忘了物品，不用担心 - 我们提供邮寄返回服务（需额外付费）。",
        description3:
          "准备退房时，只需点击下方按钮通知我们。如需任何帮助，随时与我们联系。我们随时为您服务！",
        buttonText: "完成退房",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "意式浓缩咖啡",
            description: "意式浓缩咖啡，带来充满能量与美味的时刻",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "无咖啡因咖啡",
            description: "保留浓缩咖啡的所有口感，但不含咖啡因",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "美式咖啡",
            description: "加热水的浓缩咖啡，口感柔和",
            price: 2.0,
          },
          {
            id: "coffe-macchiato",
            name: "玛奇朵咖啡",
            description: "浓缩咖啡加入一点牛奶，带来柔和而醇厚的平衡口感",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "卡布奇诺",
            description: "浓缩咖啡、热牛奶和绵密泡沫：意大利最经典的早餐饮品",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "无咖啡因卡布奇诺",
            description: "卡布奇诺的奶油口感，搭配无咖啡因的轻盈",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "无乳糖卡布奇诺",
            description: "丰富的口感和精致的奶泡，专为避免乳糖的人设计",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "豆浆卡布奇诺",
            description: "一款植物性变种，带有细腻自然的口感",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "纯牛奶",
            description: "冷热皆宜，简单纯粹如同一个拥抱",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "拿铁玛奇朵",
            description: "热牛奶加入一点浓缩咖啡：细腻柔和，却不失特色",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "无乳糖拿铁玛奇朵",
            description: "热牛奶的甜美，不含乳糖，加入一丝浓缩咖啡",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "豆浆拿铁玛奇朵",
            description: "豆浆的绵密拥抱，加入一丝浓缩咖啡的细腻触感",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "热茶",
            description: "一杯放松身心的茶饮，适合任何休息时刻",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "人参咖啡",
            description: "咖啡与人参的提神混合，带来自然而绵长的能量",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "大麦咖啡",
            description: "一种温和且不含咖啡因的替代品，带有大麦丰富的烘焙风味",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "冰咖啡",
            description: "清爽而浓郁，可选择加入奶油增添额外的甜味",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "鲜榨橙汁",
            description:
              "新鲜橙子榨汁，富含维生素C，带有甜美清新的味道，每一口都充满活力",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "菠萝汁",
            description: "新鲜甜美的菠萝汁，完美唤醒味蕾，带来热带风味的爆发",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "ACE果汁",
            description:
              "ACE果汁，橙子、胡萝卜和柠檬的维生素混合，每一口都带来自然能量和清新感",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "梨汁",
            description: "梨汁，细腻包容，带来甜美自然的味觉体验，刷新身心",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "桃子汁",
            description:
              "桃子汁，新鲜多汁，带有刚采摘的水果甜美风味，带来纯粹清新的一刻",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "柠檬刨冰配奶油面包",
            description:
              "新鲜浓郁的柠檬味道，搭配温暖柔软的奶油面包。夏日的完美组合",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "草莓刨冰配奶油面包",
            description:
              "甜美而果香四溢，草莓刨冰与松软的奶油面包结合，带来清新而令人难以抗拒的体验",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "咖啡刨冰配奶油面包",
            description:
              "浓郁而清爽的口感融合，搭配松软的奶油面包，带来独特的享受",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "原味牛角面包",
            description: "简单松软，完美开启轻盈的一天",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "巧克力牛角面包",
            description: "巧克力内馅包裹在香气四溢的面皮中，带来甜蜜的唤醒",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "果酱牛角面包",
            description: "果酱的甜美包裹在松软香气的面皮中，带来美味的早餐",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "奶油牛角面包",
            description: "松软的面皮中包含丰富的奶油，带来不可抗拒的美味",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "森林浆果牛角面包",
            description:
              "森林浆果的甜美包裹在松软的面皮中，带来清新而美味的早餐",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "全麦原味牛角面包",
            description: "松软轻盈，采用全麦面粉制作，带来纯正健康的口感",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "纯素苹果牛角面包",
            description:
              "一款精致的纯素牛角面包，内馅是甜美的苹果果酱，是轻盈自然早餐的完美选择",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "果酱塔切片",
            description:
              "果酱塔切片，一款美味的甜点，带有香气四溢的底座和丰富的果酱馅料，是休息时刻的完美享受",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "巧克力夹心饼干",
            description:
              "两片松软的饼干，中间夹着美味的巧克力奶油，带来纯粹愉悦的甜蜜时刻",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "果酱夹心饼干",
            description:
              "两片香气四溢的饼干中间夹着甜美的果酱，带来简单纯粹的享受",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "全麦夹心饼干",
            description:
              "全麦饼干带有质朴的口感，中间夹着果酱，是健康纯正的美味",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "无麸质饼干",
            description:
              "无麸质饼干，香气四溢且美味，选用精选材料制作，带来纯正的口感，适合遵循无麸质饮食的人群",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "咸味奶油面包选项1",
            description:
              "咸味奶油面包配火腿和奶酪，松软的面包中夹着熟火腿和奶酪",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "咸味奶油面包选项2",
            description:
              "咸味奶油面包配萨拉米香肠和奶酪，松软的面包中夹着萨拉米香肠和奶酪",
            price: 3.5,
          },
          {
            id: "egg",
            name: "水煮蛋",
            description: "水煮蛋，蛋白凝固而蛋黄柔软，简单而富有营养",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "西西里早餐",
            description: "单人套餐：1份冰沙配brioche面包，1杯浓缩咖啡或果汁",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "经典意式早餐",
            description:
              "单人套餐：1个牛角面包，1杯卡布奇诺，1杯鲜榨橙汁或1杯果汁",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "咸味套餐",
            description:
              "单人咸味套餐：1个咸味brioche面包，1个水煮蛋，1杯鲜榨橙汁和1杯咖啡",
            price: 6.0,
          },
        ],
        orderTitle: "订购早餐",
        timeNote: "请注意：订单必须提前至少30分钟下单。",
        yourName: "您的姓名",
        namePlaceholder: "输入您的姓名",
        selectRoom: "选择房间",
        roomPlaceholder: "-- 选择房间 --",
        menunote: "选择套餐或单品进行点餐",
      },
    },

    ru: {
      tabs: {
        info: "Для Вас",
        directions: "Указания",
        breakfast: "Завтрак",
        map: "Исследовать",
        checkout: "Выезд",
      },
      home: {
        welcome: "MiPA Companion",
        checkInNew: "Мне Нужно Зарегистрироваться",
        checkInExisting: "Я Уже Зарегистрирован",
      },
      uploadDocuments: {
        title: "Загрузите Ваши документы",
        removeButton: "Удалить",
        sendDocuments: "Отправить документы через WhatsApp",
        continueButton: "Перейти к информации о размещении",
      },
      info: {
        generalInfo: "Общая Информация",
        contactUs: "Свяжитесь с Нами",
        additionalServices: "Дополнительные Услуги",
        checkin: "Заезд: 15:00 - 22:00",
        checkout: "Выезд: До 10:30",
        address: "Via San Giovanni 42, Milazzo (ME)",
        phone: "+393339201524",
        email: "studiosmipa@gmail.com",
        whatsapp: "Связаться через WhatsApp",
        wifi: {
          ssid: "MiPA_guests",
          password: "viaS.Giovanni/42",
          connect: "Подключиться к WiFi",
        },
        services: {
          bikeRental: {
            title: "Прокат Велосипедов",
            description: "От €10 в день - Узнайте подробности",
          },
          scubaDiving: {
            title: "Дайвинг",
            description:
              "От €60 за человека, бронируйте за 24 часа - Узнайте подробности",
          },
          miniCruise: {
            title: "Мини-круиз (2/3 Острова) по Эолийским Островам",
            description:
              "От €40 за человека - Бронируйте через: Navisal или Tarnav",
          },
          privateTour: {
            title: "Частный Тур по Эолийским Островам",
            description: "От €100 за человека - Узнайте подробности",
          },
        },
      },

      directions: {
        title: "Как добраться до Милаццо",
        arriving: {
          title: "Как добраться до места проживания",
          byCar: {
            title: "На автомобиле",
            description:
              "Если вы прибываете на автомобиле, съезжайте с автострады на пункте оплаты Милаццо и продолжайте движение по проспекту Сицилия (главная дорога) до последнего доступного выезда. По прибытии вы сможете легко припарковаться на площади XXV Aprile, которая находится рядом с местом проживания, или в других близлежащих районах. Если вы выбираете платное парковочное место (синие линии), вы можете управлять оплатой через приложение EasyPark, которое позволяет оплачивать парковку непосредственно с вашего смартфона.",
          },
          byTrain: {
            title: "На поезде",
            description:
              "Если вы прибываете на поезде, выйдите на станции Милаццо и сядьте на один из автобусов, соединяющих станцию с центром города. Ближайшая остановка к нашему месту проживания - это остановка у порта, до которой легко добраться на линиях 4 и 5. Расписание автобусов можно проверить непосредственно здесь.",
          },
          byBus: {
            title: "На автобусе (из аэропорта или других мест)",
            description:
              "Если вы прибываете на автобусе, например из Катании или других мест, выйдите на остановке у порта, которая является ближайшей к нашему месту проживания. Для получения дополнительной информации о прямых сообщениях из аэропорта Катании, проверьте расписание автобусов здесь.",
          },
        },
        leaving: {
          title: "Выезд из Милаццо",
          byCar: {
            title: "На автомобиле",
            description:
              "Если вы выезжаете на автомобиле, вам нужно следовать указателям на проспект Сицилия (главная дорога), проехать его до конца, а затем взять развязку Милаццо, чтобы выехать на автостраду A20 в направлении Мессины (Катания) или Палермо.",
          },
          byBusToMessina: {
            title: "На автобусе (в Мессину)",
            description:
              "Если вы предпочитаете путешествовать на автобусе в Мессину, вы можете проверить расписание следующих компаний: GiuntaBus и AST (Azienda Siciliana Trasporti), которые предлагают несколько ежедневных рейсов.",
          },
          byTrain: {
            title: "На поезде",
            description:
              "Если вам нужно сесть на поезд, возьмите один из автобусов, отправляющихся от остановки Порт (линии 4 и 5), которые доставят вас до железнодорожного вокзала. Расписание автобусов можно проверить здесь.",
          },
          toAirport: {
            title: "В аэропорт Катании",
            description:
              "Если вам нужно вылететь из аэропорта Катании, вы можете воспользоваться прямыми сообщениями из Милаццо. Расписание автобусов в аэропорт доступно здесь.",
          },
        },
      },

      map: {
        title: "Исследовать",
        openInMaps: "Открыть в Google Maps",
        dayItinerary: "Дневной маршрут",
        itineraryDescription:
          "Откройте для себя лучшие места города за один день с этим тщательно спланированным маршрутом. Исследуйте главные достопримечательности, наслаждайтесь местными впечатлениями и максимально используйте свое время.",
        exploreButton: "Исследовать Милаццо",
        mapDescription:
          "Изучите Милаццо с помощью этой интерактивной карты, которая выделяет главные достопримечательности, памятники и скрытые жемчужины города.",
      },

      checkout: {
        title: "Инструкции по Выезду",
        instructions: [
          "Оставьте все ключи от комнаты внутри комнаты.",
          "Соберите все личные вещи, включая зарядные устройства и электронику.",
          "Тщательно проверьте комнату на наличие забытых вещей.",
          "Урегулируйте все незакрытые платежи, включая городской налог.",
        ],
        description1:
          "Спасибо, что выбрали нас! Надеемся, вам понравилось. Перед выездом, пожалуйста:",
        description2:
          "Если вы забыли какие-либо вещи, не волнуйтесь - мы предлагаем услугу возврата по почте (взимается дополнительная плата).",
        description3:
          "Когда будете готовы выехать, просто нажмите кнопку ниже, чтобы уведомить нас. Если вам нужна помощь перед отъездом, не стесняйтесь обращаться. Мы здесь, чтобы помочь!",
        buttonText: "Завершить Выезд",
      },
      breakfast: {
        items: [
          {
            id: "coffe-espresso",
            name: "Эспрессо",
            description: "Эспрессо кофе, для момента энергии и вкуса",
            price: 1.2,
          },
          {
            id: "coffe-deca",
            name: "Кофе без кофеина",
            description: "Весь вкус эспрессо, без кофеина",
            price: 1.3,
          },
          {
            id: "coffe-american",
            name: "Кофе Американо",
            description: "Эспрессо с добавлением горячей воды, мягкий вкус",
            price: 2.0,
          },
          {
            id: "coffe-macchiato",
            name: "Кофе Маккиато",
            description:
              "Эспрессо с добавлением молока, для мягкого и решительного баланса",
            price: 1.2,
          },
          {
            id: "cappuccino",
            name: "Капучино",
            description:
              "Эспрессо, горячее молоко и нежная пена: главный итальянский завтрак",
            price: 2.0,
          },
          {
            id: "cappuccino-deca",
            name: "Капучино без кофеина",
            description:
              "Кремовость капучино с легкостью декафеинированного кофе",
            price: 2.2,
          },
          {
            id: "cappuccino-nolattosio",
            name: "Капучино без лактозы",
            description:
              "Полный вкус и нежная пена, специально для тех, кто избегает лактозу",
            price: 2.3,
          },
          {
            id: "cappuccino-soy",
            name: "Капучино на соевом молоке",
            description: "Растительный вариант с нежным и натуральным вкусом",
            price: 2.3,
          },
          {
            id: "milk-plain",
            name: "Чистое молоко",
            description:
              "Горячее или холодное, простое и искреннее как объятие",
            price: 1.6,
          },
          {
            id: "latte-macchiato",
            name: "Латте Макиато",
            description:
              "Горячее молоко с добавлением эспрессо: нежный, но с характером",
            price: 2.0,
          },
          {
            id: "latte-macchiato-nolattosio",
            name: "Латте Макиато без лактозы",
            description:
              "Сладость горячего молока, без лактозы, с легким добавлением эспрессо",
            price: 2.3,
          },
          {
            id: "latte-macchiato-soy",
            name: "Соевый Латте Макиато",
            description:
              "Кремовое объятие соевого молока с нежным добавлением эспрессо",
            price: 2.3,
          },
          {
            id: "hot-thea",
            name: "Горячий чай",
            description:
              "Расслабляющий напиток, идеальный для любого момента отдыха",
            price: 3.5,
          },
          {
            id: "ginseng-coffe",
            name: "Кофе с женьшенем",
            description:
              "Энергетическая смесь кофе и женьшеня, для естественного и обволакивающего заряда",
            price: 2.5,
          },
          {
            id: "barley-coffe",
            name: "Ячменный кофе",
            description:
              "Нежная альтернатива без кофеина, с богатым и обжаренным вкусом ячменя",
            price: 2.5,
          },
          {
            id: "ice-coffe",
            name: "Холодный кофе",
            description:
              "Освежающий и насыщенный, доступен с или без сливок для дополнительной сладости",
            price: 2.5,
          },
          {
            id: "orange-juice",
            name: "Свежевыжатый апельсиновый сок",
            description:
              "Свежевыжатый апельсиновый сок, богатый витамином С, со сладким и бодрящим вкусом, заряд энергии в каждом глотке",
            price: 3.5,
          },
          {
            id: "juice-pineapple",
            name: "Ананасовый сок",
            description:
              "Свежий и сладкий ананасовый сок, идеально освежает вкусовые рецепторы взрывом тропического вкуса",
            price: 2.2,
          },
          {
            id: "juice-ace",
            name: "Сок ACE",
            description:
              "Сок ACE, витаминная смесь апельсина, моркови и лимона, для натурального заряда энергии и свежести в каждом глотке",
            price: 2.2,
          },
          {
            id: "juice-pear",
            name: "Грушевый сок",
            description:
              "Грушевый сок, нежный и обволакивающий, для сладкого и натурального вкусового опыта, освежающего тело и разум",
            price: 2.2,
          },
          {
            id: "juice-peach",
            name: "Персиковый сок",
            description:
              "Персиковый сок, свежий и сочный, со сладким вкусом свежесобранных фруктов, для момента чистой свежести",
            price: 2.2,
          },
          {
            id: "lemongranita-brioches",
            name: "Лимонная гранита с бриошью",
            description:
              "Свежий и интенсивный вкус лимона, сопровождаемый мягкостью теплой бриоши. Идеальное сочетание для лета",
            price: 4.0,
          },
          {
            id: "strawberry-brioches",
            name: "Клубничная гранита с бриошью",
            description:
              "Сладкая и фруктовая, клубничная гранита соединяется с мягкой бриошью для свежего и неотразимого опыта",
            price: 4.0,
          },
          {
            id: "coffe-brioches",
            name: "Кофейная гранита с бриошью",
            description:
              "Настой интенсивного и освежающего вкуса, сопровождаемый мягкостью бриоши для уникального удовольствия",
            price: 4.0,
          },
          {
            id: "cornetto-empty",
            name: "Пустой рогалик",
            description: "Простой и мягкий, идеален для легкого начала дня",
            price: 1.2,
          },
          {
            id: "cornetto-chocolate",
            name: "Шоколадный рогалик",
            description:
              "Шоколадное сердце, завернутое в ароматное тесто, для сладкого пробуждения",
            price: 1.2,
          },
          {
            id: "cornetto-marmelade",
            name: "Рогалик с джемом",
            description:
              "Сладость джема, заключенная в мягкое и ароматное тесто, для вкусного завтрака",
            price: 1.2,
          },
          {
            id: "cornetto-cream",
            name: "Рогалик с кремом",
            description:
              "Мягкое тесто, содержащее богатый заварной крем, для неотразимого удовольствия",
            price: 1.2,
          },
          {
            id: "cornetto-bosco",
            name: "Рогалик с лесными ягодами",
            description:
              "Сладость лесных ягод, заключенная в мягкое тесто, для свежего и вкусного завтрака",
            price: 1.5,
          },
          {
            id: "cornetto-wholegrain",
            name: "Цельнозерновой пустой рогалик",
            description:
              "Мягкий и легкий, с цельнозерновой мукой для настоящего и здорового вкуса",
            price: 1.5,
          },
          {
            id: "cornetto-vegan",
            name: "Веганский яблочный рогалик",
            description:
              "Нежный веганский рогалик, начиненный сладким яблочным джемом, идеально подходит для легкого и натурального завтрака",
            price: 1.5,
          },
          {
            id: "crostata",
            name: "Кусок торта с джемом",
            description:
              "Кусок торта с джемом, вкусный десерт с ароматной основой и сердцем, богатым джемом, идеален для приятного перерыва",
            price: 2.5,
          },
          {
            id: "occhiodibue-choco",
            name: "Шоколадное печенье-сэндвич",
            description:
              "Два мягких печенья, соединенных вкусным шоколадным кремом, для сладкого момента чистого удовольствия",
            price: 0.9,
          },
          {
            id: "occhiodibue-marmelade",
            name: "Печенье-сэндвич с джемом",
            description:
              "Два ароматных печенья, содержащих сладкий джем, для простого и настоящего удовольствия",
            price: 0.9,
          },
          {
            id: "occhiodibue-wholegrain",
            name: "Цельнозерновое печенье-сэндвич",
            description:
              "Цельнозерновое печенье с деревенским вкусом, начиненное джемом, для здорового и натурального лакомства",
            price: 0.9,
          },
          {
            id: "bisciots-nogluten",
            name: "Безглютеновое печенье",
            description:
              "Безглютеновое печенье, ароматное и вкусное, приготовленное из отборных ингредиентов для настоящего вкуса, подходящего для тех, кто следует безглютеновой диете",
            price: 2.0,
          },
          {
            id: "brioche-salty1",
            name: "Соленая бриошь вариант 1",
            description:
              "Соленая бриошь с ветчиной и сыром, мягкая булочка, начиненная вареной ветчиной и сыром",
            price: 3.5,
          },
          {
            id: "brioche-salty2",
            name: "Соленая бриошь вариант 2",
            description:
              "Соленая бриошь с салями и сыром, мягкая булочка, начиненная салями и сыром",
            price: 3.5,
          },
          {
            id: "egg",
            name: "Вареное яйцо",
            description:
              "Вареное яйцо, с твердым белком и мягким желтком, простое и питательное",
            price: 1.0,
          },
          {
            id: "menu-sicilian",
            name: "Сицилийский завтрак",
            description:
              "Меню на одного человека: 1 гранита с бриошью, 1 эспрессо или фруктовый сок",
            price: 5.5,
          },
          {
            id: "menu-classic",
            name: "Классический итальянский завтрак",
            description:
              "Меню на одного человека: 1 круассан, 1 капучино, 1 свежевыжатый апельсиновый сок или 1 фруктовый сок",
            price: 5.0,
          },
          {
            id: "menu-salty",
            name: "Соленое меню",
            description:
              "Соленое меню на одного человека: 1 соленая бриошь, 1 вареное яйцо, 1 свежевыжатый апельсиновый сок и 1 кофе",
            price: 6.0,
          },
        ],
        orderTitle: "Заказать Завтрак",
        timeNote:
          "Примечание: Заказы должны быть размещены как минимум за 30 минут до доставки.",
        yourName: "Ваше Имя",
        namePlaceholder: "Введите ваше имя",
        selectRoom: "Выберите Номер",
        roomPlaceholder: "-- Выберите Номер --",
        menunote: "Выберите между меню или отдельными блюдами для заказа",
      },
    },
  };

  // Get breakfast items based on current language
  const breakfastItems = translations[language].breakfast.items;

  const [breakfastQuantities, setBreakfastQuantities] = useState<
    Record<string, number>
  >(breakfastItems.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));

  // Map URL State
  const [mapUrl, setMapUrl] = useState(
    "https://www.google.com/maps/d/embed?mid=15vrvCbCRnWxkxZrUN1FkFf96XWx7sUyc&hl=it&ehbc=2E312F"
  );

  // Function to connect to WiFi
  const connectToWiFi = () => {
    const ssid = translations[language].info.wifi.ssid;
    const password = translations[language].info.wifi.password;

    // Create a WiFi connection URL
    const wifiUrl = `wifi:S:${ssid};T:WPA;P:${password};;`;

    // For mobile devices, we can use a deep link to open WiFi settings
    // This will work on iOS and many Android devices
    // For browsers that support navigator.share, we could use that API

    // For modern browsers, we can use a QR code generator API
    window.location.href = wifiUrl;

    // Fallback to copy to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`SSID: ${ssid}\nPassword: ${password}`);
      alert(
        `WiFi details copied to clipboard:\nSSID: ${ssid}\nPassword: ${password}`
      );
    }
  };

  // Online/Offline and PWA Event Listeners
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // PWA Install Prompt Listener
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener(
      "beforeinstallprompt",
      handleBeforeInstallPrompt as EventListener
    );

    // Load data from localStorage on component mount
    const storedCheckedInStatus = localStorage.getItem("isCheckedIn");
    const storedImages = localStorage.getItem("uploadedDocuments");
    const storedWhatsAppSent = localStorage.getItem("documentsSentViaWhatsApp");

    if (storedCheckedInStatus) {
      setIsCheckedIn(JSON.parse(storedCheckedInStatus));
    }

    if (storedImages) {
      setUploadedImages(JSON.parse(storedImages));
    }

    if (storedWhatsAppSent) {
      setDocumentsSentViaWhatsApp(JSON.parse(storedWhatsAppSent));
    }

    // Register service worker
    registerServiceWorker();

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);

  // Save check-in status to localStorage
  useEffect(() => {
    localStorage.setItem("isCheckedIn", JSON.stringify(isCheckedIn));
  }, [isCheckedIn]);

  // Save uploaded images to localStorage
  useEffect(() => {
    localStorage.setItem("uploadedDocuments", JSON.stringify(uploadedImages));
  }, [uploadedImages]);

  // Save WhatsApp sent status to localStorage
  useEffect(() => {
    localStorage.setItem(
      "documentsSentViaWhatsApp",
      JSON.stringify(documentsSentViaWhatsApp)
    );
  }, [documentsSentViaWhatsApp]);

  // PWA Installation Handler
  const handleInstallPWA = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const result = await installPrompt.userChoice;
        if (result.outcome === "accepted") {
          console.log("App installed successfully");
        }
        setInstallPrompt(null);
      } catch (error) {
        console.error("PWA installation failed", error);
      }
    }
  };

  const handleCheckInChoice = (isNewGuest: boolean) => {
    if (isNewGuest) {
      setCurrentPage("upload-id");
    } else {
      setCurrentPage("property-info");
      setIsCheckedIn(true);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newImageUrls = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setUploadedImages((prev) => [...prev, ...newImageUrls]);
      setDocumentsSentViaWhatsApp(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setUploadedImages((prev) =>
      prev.filter((_, index) => index !== indexToRemove)
    );
    setDocumentsSentViaWhatsApp(false);
  };

  const handleWhatsAppShare = () => {
    const phoneNumber = "+393339201524";
    const message = "Check-in documents for accommodation:";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
    setDocumentsSentViaWhatsApp(true);
  };

  // Breakfast-related methods
  const updateBreakfastQuantity = (itemId: string, change: number) => {
    setBreakfastQuantities((prev) => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + change),
    }));
  };

  const calculateBreakfastTotal = () => {
    return breakfastItems.reduce(
      (total, item) => total + breakfastQuantities[item.id] * item.price,
      0
    );
  };

  const sendBreakfastOrder = () => {
    const roomSelect = document.getElementById(
      "room-select"
    ) as HTMLSelectElement;
    const guestNameInput = document.getElementById(
      "guest-name"
    ) as HTMLInputElement;

    const room = roomSelect?.value;
    const guestName = guestNameInput?.value;

    if (!room || room === "none") {
      alert("Please select your room");
      return;
    }

    if (!guestName) {
      alert("Please enter your name");
      return;
    }

    const italianTranslations = translations["it"].breakfast.items;

    const orderItems = italianTranslations
      .filter((item) => breakfastQuantities[item.id] > 0)
      .map((item) => `${breakfastQuantities[item.id]}x ${item.name}`);

    const message =
      `Ordine colazione per ${guestName}, Camera ${room}:\n` +
      orderItems.join("\n") +
      `\n\nTotale: €${calculateBreakfastTotal().toFixed(2)}`;

    window.open(
      `https://wa.me/393463454085?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Check-out method
  const handleCheckOut = () => {
    const roomSelect = document.getElementById(
      "checkout-room-select"
    ) as HTMLSelectElement;
    const guestNameInput = document.getElementById(
      "checkout-guest-name"
    ) as HTMLInputElement;

    const room = roomSelect?.value;
    const guestName = guestNameInput?.value;

    if (!room || room === "none") {
      alert("Please select your room");
      return;
    }

    if (!guestName) {
      alert("Please enter your name");
      return;
    }

    const message = `Check-out request:\nName: ${guestName}\nRoom: ${room}\n\nI would like to proceed with the check-out process.`;

    const phoneNumber = "+393339201524";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  // Render methods
  const renderLanguageSwitcher = () => (
    <div className="language-switcher">
      <select
        className="language-dropdown"
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
      >
        <option value="en">English</option>
        <option value="it">Italiano</option>
        <option value="es">Español</option>
        <option value="fr">Français</option>
        <option value="de">Deutsch</option>
        <option value="zh">中文</option>
        <option value="ru">Русский</option>
      </select>
    </div>
  );

  const renderHomePage = () => (
    <div className="container">
      {renderLanguageSwitcher()}
      <h1>{translations[language].home.welcome}</h1>
      <div className="check-in-buttons">
        <button
          className="check-in-button"
          onClick={() => handleCheckInChoice(true)}
        >
          {translations[language].home.checkInNew}
        </button>
        <button
          className="check-in-button"
          onClick={() => handleCheckInChoice(false)}
        >
          {translations[language].home.checkInExisting}
        </button>
      </div>
    </div>
  );

  const renderUploadPage = () => (
    <div className="container">
      {renderLanguageSwitcher()}
      <h2>{translations[language].uploadDocuments.title}</h2>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />

      {uploadedImages.length > 0 && (
        <div className="image-preview">
          {uploadedImages.map((imageUrl, index) => (
            <div key={index} className="preview-item">
              <img src={imageUrl} alt={`Uploaded ${index}`} />
              <button onClick={() => removeImage(index)}>
                {translations[language].uploadDocuments.removeButton}
              </button>
            </div>
          ))}
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="button-group">
          <button onClick={handleWhatsAppShare} className="whatsapp-share">
            {translations[language].uploadDocuments.sendDocuments}
          </button>
          <button
            onClick={() => setCurrentPage("property-info")}
            disabled={!documentsSentViaWhatsApp}
            className={!documentsSentViaWhatsApp ? "disabled" : ""}
          >
            {translations[language].uploadDocuments.continueButton}
          </button>
        </div>
      )}
    </div>
  );

  const renderPropertyInfoPage = () => (
    <div className="container">
      {renderLanguageSwitcher()}

      <div className="tabs">
        <div className="tab-headers">
          <button
            className={activeTab === "info" ? "active" : ""}
            onClick={() => setActiveTab("info")}
          >
            <span className="tab-icon material-icons">person</span>
            <span className="tab-text">{translations[language].tabs.info}</span>
          </button>

          <button
            className={activeTab === "directions" ? "active" : ""}
            onClick={() => setActiveTab("directions")}
          >
            <span className="tab-icon material-icons">train</span>
            <span className="tab-text">
              {translations[language].tabs.directions}
            </span>
          </button>

          <button
            className={activeTab === "breakfast" ? "active" : ""}
            onClick={() => setActiveTab("breakfast")}
          >
            <span className="tab-icon material-icons">restaurant_menu</span>
            <span className="tab-text">
              {translations[language].tabs.breakfast}
            </span>
          </button>
          <button
            className={activeTab === "map" ? "active" : ""}
            onClick={() => setActiveTab("map")}
          >
            <span className="tab-icon material-icons">map</span>
            <span className="tab-text">{translations[language].tabs.map}</span>
          </button>
          <button
            className={activeTab === "checkout" ? "active" : ""}
            onClick={() => setActiveTab("checkout")}
          >
            <span className="tab-icon material-icons">exit_to_app</span>
            <span className="tab-text">
              {translations[language].tabs.checkout}
            </span>
          </button>
        </div>

        <div className="tab-content">
          {activeTab === "info" && (
            <div className="for-you-tab">
              <div className="info-section">
                <h2>{translations[language].info.generalInfo}</h2>
                <div className="info-item">
                  <Clock className="icon" />
                  <p>
                    <strong>{translations[language].info.checkin}</strong>
                  </p>
                </div>
                <div className="info-item">
                  <Clock className="icon" />
                  <p>
                    <strong>{translations[language].info.checkout}</strong>
                  </p>
                </div>
                <div className="info-item">
                  <MapPin className="icon" />
                  <p>
                    <strong>Address:</strong>{" "}
                    <a
                      href="https://maps.google.com/maps?q=Via+San+Giovanni+42,+Milazzo+(ME)"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translations[language].info.address}
                    </a>
                  </p>
                </div>

                <div className="info-item">
                  <Wifi className="icon" />
                  <div>
                    <p>
                      <strong>WiFi:</strong>{" "}
                      {translations[language].info.wifi.ssid}
                    </p>
                    <p>Password: {translations[language].info.wifi.password}</p>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        connectToWiFi();
                      }}
                      className="wifi-connect-button"
                    >
                      {translations[language].info.wifi.connect}
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-section">
                <h2>{translations[language].info.contactUs}</h2>
                <div className="info-item">
                  <Phone className="icon" />
                  <p>
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${translations[language].info.phone}`}>
                      {translations[language].info.phone}
                    </a>
                  </p>
                </div>
                <div className="info-item">
                  <Mail className="icon" />
                  <p>
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${translations[language].info.email}`}>
                      {translations[language].info.email}
                    </a>
                  </p>
                </div>
                <div className="info-item">
                  <MessageCircle className="icon" />
                  <p>
                    <strong>Chat:</strong>{" "}
                    <a
                      href={`https://wa.me/${translations[language].info.phone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {translations[language].info.whatsapp}
                    </a>
                  </p>
                </div>
              </div>

              <div className="services-section">
                <h2>{translations[language].info.additionalServices}</h2>
                <div className="service-item">
                  <Bike className="icon" />
                  <div>
                    <strong>
                      {translations[language].info.services.bikeRental.title}
                    </strong>
                    <p>
                      {
                        translations[language].info.services.bikeRental
                          .description
                      }
                    </p>
                  </div>
                </div>
                <div className="service-item">
                  <Waves className="icon" />
                  <div>
                    <strong>
                      {translations[language].info.services.scubaDiving.title}
                    </strong>
                    <p>
                      {
                        translations[language].info.services.scubaDiving
                          .description
                      }
                    </p>
                  </div>
                </div>
                <div className="service-item">
                  <Sailboat className="icon" />
                  <div>
                    <strong>
                      {translations[language].info.services.miniCruise.title}
                    </strong>
                    <p>
                      {
                        translations[language].info.services.miniCruise
                          .description
                      }{" "}
                      From €40 per person - Book with:{" "}
                      <a
                        href="https://navisal.com/EN/excursions.aspx"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Navisal
                      </a>{" "}
                      or{" "}
                      <a
                        href="https://minicrociere.tarnav.it/minicruises/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Tarnav
                      </a>
                    </p>
                  </div>
                </div>
                <div className="service-item">
                  <Sailboat className="icon" />
                  <div>
                    <strong>
                      {translations[language].info.services.privateTour.title}
                    </strong>
                    <p>
                      {
                        translations[language].info.services.privateTour
                          .description
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "directions" && (
            <div className="directions-section">
              <h2>{translations[language].directions.title}</h2>

              {/* Arriving at the Property Section */}
              <div className="arriving-section">
                <h3>{translations[language].directions.arriving.title}</h3>

                {/* Car Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.arriving.byCar.title}
                  </h4>
                  <p>
                    {/* Using a strategy that works across all languages */}
                    {(() => {
                      const linkTerms = {
                        en: "EasyPark",
                        it: "EasyPark",
                        fr: "EasyPark",
                        es: "EasyPark",
                        de: "EasyPark",
                        ru: "EasyPark",
                        zh: "EasyPark",
                        // Add other languages as needed
                      };

                      const text =
                        translations[language].directions.arriving.byCar
                          .description;
                      const term = linkTerms[language];

                      if (text.includes(term)) {
                        const parts = text.split(term);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://www.easypark.com/en-it/download?utm_source=Web&utm_campaign=IT_one_web_download_app&utm_medium=marketing"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {term}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                </div>

                {/* Train Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.arriving.byTrain.title}
                  </h4>
                  <p>
                    {(() => {
                      const linkTerms = {
                        en: "here",
                        it: "qui",
                        fr: "ici",
                        es: "aquí",
                        de: "hier",
                        ru: "здесь",
                        zh: "这里",
                      };

                      const text =
                        translations[language].directions.arriving.byTrain
                          .description;
                      const term = linkTerms[language];

                      if (text.includes(term)) {
                        const parts = text.split(term);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://cdn.prod.website-files.com/625686464e10c9be6a93fb86/6752da222937d2e195f9b8cc_2024.12.09%20Orario%20Linee%20Urbane%20Milazzo.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {term}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                </div>

                {/* Bus Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.arriving.byBus.title}
                  </h4>
                  <p>
                    {(() => {
                      const linkTerms = {
                        en: "here",
                        it: "qui",
                        fr: "ici",
                        es: "aquí",
                        de: "hier",
                        ru: "здесь",
                        zh: "这里",
                        // Add other languages as needed
                      };

                      const text =
                        translations[language].directions.arriving.byBus
                          .description;
                      const term = linkTerms[language];

                      if (text.includes(term)) {
                        const parts = text.split(term);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://giuntabus.com/milazzo-aeroporto-catania/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {term}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                </div>
              </div>

              {/* Navigation Button - Added between the two sections */}
              <div
                className="navigation-button-container"
                style={{ margin: "2rem 0", textAlign: "center" }}
              >
                <a
                  href="https://maps.app.goo.gl/SGg7HEx5kXiT49WW6"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="nav-button"
                  style={{
                    padding: "12px 24px",
                    backgroundColor: "#4285F4",
                    color: "white",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "bold",
                    display: "inline-block",
                  }}
                >
                  {language === "en" && "Bring me to the property"}
                  {language === "it" && "Portami alla struttura"}
                  {language === "fr" && "Emmène-moi à l'établissement"}
                  {language === "es" && "Llévame al alojamiento"}
                  {language === "de" && "Bring mich zum Grundstück"}
                  {language === "ru" && "Привезти меня к объекту"}
                  {language === "zh" && "带我去物业"}
                </a>
              </div>

              {/* Leaving Milazzo Section */}
              <div className="leaving-section">
                <h3>{translations[language].directions.leaving.title}</h3>

                {/* Car Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.leaving.byCar.title}
                  </h4>
                  <p>
                    {
                      translations[language].directions.leaving.byCar
                        .description
                    }
                  </p>
                </div>

                {/* Bus to Messina Section */}
                <div className="direction-option">
                  <h4>
                    {
                      translations[language].directions.leaving.byBusToMessina
                        .title
                    }
                  </h4>
                  <p>
                    {(() => {
                      const linkTerms = {
                        en: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        it: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        fr: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        es: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        de: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        ru: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                        zh: {
                          giuntabus: "GiuntaBus",
                          ast: "AST",
                        },
                      };

                      const text =
                        translations[language].directions.leaving.byBusToMessina
                          .description;
                      const terms = linkTerms[language];

                      // First check if both terms exist in the text
                      if (
                        text.includes(terms.giuntabus) &&
                        text.includes(terms.ast)
                      ) {
                        // Split once by the first term
                        const giuntaParts = text.split(terms.giuntabus);

                        // Then split the second part by the second term
                        const astParts = giuntaParts[1].split(terms.ast);

                        return (
                          <>
                            {giuntaParts[0]}
                            <a
                              href="https://www.giuntabustrasporti.com/orari"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {terms.giuntabus}
                            </a>
                            {astParts[0]}
                            <a
                              href="http://www.aziendasicilianatrasporti.it:8080/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {terms.ast}
                            </a>
                            {astParts[1]}
                          </>
                        );
                      }
                      // If only Giuntabus is in the text
                      else if (text.includes(terms.giuntabus)) {
                        const parts = text.split(terms.giuntabus);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://www.giuntabustrasporti.com/orari"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {terms.giuntabus}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      // If only AST is in the text
                      else if (text.includes(terms.ast)) {
                        const parts = text.split(terms.ast);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="http://www.aziendasicilianatrasporti.it:8080/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {terms.ast}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      // If neither term is found, just return the original text
                      return text;
                    })()}
                  </p>
                </div>

                {/* Train Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.leaving.byTrain.title}
                  </h4>
                  <p>
                    {(() => {
                      const linkTerms = {
                        en: "here",
                        it: "qui",
                        fr: "ici",
                        es: "aquí",
                        de: "hier",
                        ru: "здесь",
                        zh: "这里",
                        // Add other languages as needed
                      };

                      const text =
                        translations[language].directions.leaving.byTrain
                          .description;
                      const term = linkTerms[language];

                      if (text.includes(term)) {
                        const parts = text.split(term);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://cdn.prod.website-files.com/625686464e10c9be6a93fb86/6752da222937d2e195f9b8cc_2024.12.09%20Orario%20Linee%20Urbane%20Milazzo.pdf"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {term}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                </div>

                {/* To Airport Section */}
                <div className="direction-option">
                  <h4>
                    {translations[language].directions.leaving.toAirport.title}
                  </h4>
                  <p>
                    {(() => {
                      const linkTerms = {
                        en: "here",
                        it: "qui",
                        fr: "ici",
                        es: "aquí",
                        de: "hier",
                        ru: "здесь",
                        zh: "这里",
                        // Add other languages as needed
                      };

                      const text =
                        translations[language].directions.leaving.toAirport
                          .description;
                      const term = linkTerms[language];

                      if (text.includes(term)) {
                        const parts = text.split(term);
                        return (
                          <>
                            {parts[0]}
                            <a
                              href="https://giuntabus.com/milazzo-aeroporto-catania/"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {term}
                            </a>
                            {parts[1]}
                          </>
                        );
                      }
                      return text;
                    })()}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "breakfast" && (
            <div>
              <h2>{translations[language].breakfast.orderTitle}</h2>
              <p className="time-note">
                {translations[language].breakfast.timeNote}
              </p>
              <div>
                <label htmlFor="guest-name">
                  {translations[language].breakfast.yourName}
                </label>
                <input
                  type="text"
                  id="guest-name"
                  placeholder={translations[language].breakfast.namePlaceholder}
                />
              </div>
              <div>
                <label htmlFor="room-select">
                  {translations[language].breakfast.selectRoom}
                </label>
                <select id="room-select">
                  <option value="none">
                    {translations[language].breakfast.roomPlaceholder}
                  </option>
                  <option value="MiPA1">MiPA1</option>
                  <option value="MiPA2">MiPA2</option>
                  <option value="MiPA3">MiPA3</option>
                  <option value="MiPA4">MiPA4</option>
                </select>
              </div>

              <p
                className="menu-note"
                style={{ marginTop: "25px", fontSize: "20px" }}
              >
                <b> {translations[language].breakfast.menunote}</b>
              </p>
              {/* Menu Items Section */}
              <div className="breakfast-section">
                <h3 className="section-title">Menu Combinations</h3>
                <div className="section-divider"></div>

                {breakfastItems
                  .filter((item) => item.id.startsWith("menu-"))
                  .map((item) => (
                    <div key={item.id} className="breakfast-item">
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">
                          {item.description}
                        </div>
                        <div className="item-price">
                          €{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="item-quantity">
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{breakfastQuantities[item.id]}</span>
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Beverages Section */}
              <div className="breakfast-section">
                <h3 className="section-title">Beverages</h3>
                <div className="section-divider"></div>

                {breakfastItems
                  .filter(
                    (item) =>
                      (item.id.includes("coffe") ||
                        item.id.includes("juice") ||
                        item.id.includes("milk") ||
                        item.id.includes("cappuccino") ||
                        item.id.includes("latte") ||
                        item.id.includes("thea")) &&
                      !item.id.includes("granita")
                  )
                  .map((item) => (
                    <div key={item.id} className="breakfast-item">
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">
                          {item.description}
                        </div>
                        <div className="item-price">
                          €{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="item-quantity">
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{breakfastQuantities[item.id]}</span>
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Food Section */}
              <div className="breakfast-section">
                <h3 className="section-title">Food & Pastries</h3>
                <div className="section-divider"></div>

                {breakfastItems
                  .filter(
                    (item) =>
                      (item.id.includes("cornetto") ||
                        item.id.includes("granita") ||
                        item.id.includes("crostata") ||
                        item.id.includes("occhiodibue") ||
                        item.id.includes("bisciots") ||
                        item.id.includes("brioche") ||
                        item.id.includes("egg")) &&
                      !item.id.startsWith("menu-")
                  )
                  .map((item) => (
                    <div key={item.id} className="breakfast-item">
                      <div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-description">
                          {item.description}
                        </div>
                        <div className="item-price">
                          €{item.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="item-quantity">
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, -1)}
                        >
                          -
                        </button>
                        <span>{breakfastQuantities[item.id]}</span>
                        <button
                          onClick={() => updateBreakfastQuantity(item.id, 1)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="total-section">
                <span className="total-label">Total:</span>
                <span className="total-amount">
                  €{calculateBreakfastTotal().toFixed(2)}
                </span>
              </div>

              <button
                onClick={sendBreakfastOrder}
                className="breakfast-order-button"
              >
                Place Order via WhatsApp
              </button>
            </div>
          )}

          {activeTab === "map" && (
            <div className="map-section">
              <h2>{translations[language].map.title}</h2>

              {/* Day Itinerary Section */}
              <div
                className="card"
                style={{
                  borderLeft: "4px solid #8b5cf6",
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    color: "#8b5cf6",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span className="material-symbols-rounded">event</span>
                  {translations[language].map.dayItinerary}
                </h3>
                <p>{translations[language].map.itineraryDescription}</p>
                <a
                  href="https://esploramilazzo.onrender.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-button"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #8b5cf6)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    const before = e.currentTarget.querySelector(
                      ".button-hover"
                    ) as HTMLElement | null;
                    if (before) before.style.opacity = "1";
                  }}
                  onMouseOut={(e) => {
                    const before = e.currentTarget.querySelector(
                      ".button-hover"
                    ) as HTMLElement | null;
                    if (before) before.style.opacity = "0";
                  }}
                >
                  <div
                    className="button-hover"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #6025c6, #7c3aed)",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      zIndex: -1,
                    }}
                  />
                  {translations[language].map.exploreButton}
                </a>
              </div>

              {/* Interactive City Map Section */}
              <div
                className="card"
                style={{
                  borderLeft: "4px solid #3b82f6", // Changed from #b45309 (orange) to #3b82f6 (light blue)
                  marginBottom: "24px",
                }}
              >
                <h3
                  style={{
                    color: "#3b82f6", // Changed from #b45309 to #3b82f6 to match the border
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "16px",
                  }}
                >
                  <span className="material-symbols-rounded">map</span>
                  {/* Fix for missing mapTitle property */}
                  {translations[language].map.title || "Interactive City Map"}
                </h3>
                <p>{translations[language].map.mapDescription}</p>
                <div className="map-container">
                  <iframe
                    className="map-iframe"
                    src={mapUrl}
                    allowFullScreen
                    loading="lazy"
                  />
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="map-button"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #3b82f6)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseOver={(e) => {
                    const before = e.currentTarget.querySelector(
                      ".button-hover"
                    ) as HTMLElement | null;
                    if (before) before.style.opacity = "1";
                  }}
                  onMouseOut={(e) => {
                    const before = e.currentTarget.querySelector(
                      ".button-hover"
                    ) as HTMLElement | null;
                    if (before) before.style.opacity = "0";
                  }}
                >
                  <div
                    className="button-hover"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, #2563eb, #2563eb)",
                      opacity: 0,
                      transition: "opacity 0.2s ease",
                      zIndex: -1,
                    }}
                  />
                  {translations[language].map.openInMaps}
                </a>
              </div>
            </div>
          )}

          {activeTab === "checkout" && (
            <div className="checkout-section">
              <h2>{translations[language].checkout.title}</h2>
              <p>{translations[language].checkout.description1}</p>

              <div>
                <label htmlFor="checkout-guest-name">Your Name</label>
                <input
                  type="text"
                  id="checkout-guest-name"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="checkout-room-select">Select Room</label>
                <select id="checkout-room-select">
                  <option value="none">-- Select Room --</option>
                  <option value="MiPA1">MiPA1</option>
                  <option value="MiPA2">MiPA2</option>
                  <option value="MiPA3">MiPA3</option>
                  <option value="MiPA4">MiPA4</option>
                </select>
              </div>

              <ul>
                {translations[language].checkout.instructions.map(
                  (instruction, index) => (
                    <li key={index}>{instruction}</li>
                  )
                )}
              </ul>
              <p>{translations[language].checkout.description2}</p>
              <p>{translations[language].checkout.description3}</p>

              <button onClick={handleCheckOut} className="checkout-button">
                {translations[language].checkout.buttonText}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isCheckedIn) return renderPropertyInfoPage();

    switch (currentPage) {
      case "home":
        return renderHomePage();
      case "upload-id":
        return renderUploadPage();
      case "property-info":
        return renderPropertyInfoPage();
      default:
        return renderHomePage();
    }
  };

  // Render the Offline Warning Component
  const OfflineWarning = () => (
    <div className="offline-warning">
      You are currently offline. Some features may be limited.
    </div>
  );

  return (
    <div className="app">
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      {!isOnline && <OfflineWarning />}
      {renderContent()}
      {installPrompt && <button onClick={handleInstallPWA}>Install App</button>}
    </div>
  );
};
export default AccommodationApp;
