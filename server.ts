import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { INITIAL_CONFIG, INITIAL_PRODUCTS, INITIAL_PROMOTIONS } from './src/data/initialData.ts';
import { Product, Promotion, RestaurantConfig, Order } from './src/types.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent state (with initial seed data)
let products: Product[] = [...INITIAL_PRODUCTS];
let promotions: Promotion[] = [...INITIAL_PROMOTIONS];
let restaurantConfig: RestaurantConfig = { ...INITIAL_CONFIG };
let orders: Order[] = [
  {
    id: 'OSO-8472',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    items: [
      {
        cartItemId: 'prod-3-default',
        product: INITIAL_PRODUCTS[2], // Oriental Paisa Bowl
        quantity: 2,
        customization: {
          selectedSauce: 'Glaseado hoisin-lulo de la casa',
          removedIngredients: [],
          addedExtras: [{ id: 'ext-6', name: 'Porción extra de chicharrón crocante (100g)', priceExtra: 9500 }],
        },
        unitPrice: 48400,
        subtotal: 96800,
      },
      {
        cartItemId: 'prod-7-default',
        product: INITIAL_PRODUCTS[6], // Limonada de coco
        quantity: 2,
        customization: {
          removedIngredients: [],
          addedExtras: [],
        },
        unitPrice: 9900,
        subtotal: 19800,
      },
    ],
    modality: 'domicilio',
    customerName: 'Carolina Mendoza',
    phone: '3104567890',
    deliveryAddress: 'Calle 60 # 7-45, Apto 502',
    deliveryNeighborhood: 'El Vergel, Ibagué',
    paymentMethod: 'nequi',
    notes: 'Please do not ring bell loudly, baby sleeping. Leave with front desk if needed.',
    subtotal: 116600,
    discount: 0,
    deliveryFee: 5000,
    total: 121600,
    status: 'preparando',
  },
];

// Gemini setup
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize GoogleGenAI with key:', err);
  }
}

// REST Endpoints
app.get('/api/products', (_req: Request, res: Response) => {
  res.json(products);
});

app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    ...req.body,
    id: req.body.id || `prod-${Date.now()}`,
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  products[index] = { ...products[index], ...req.body };
  res.json(products[index]);
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  products = products.filter((p) => p.id !== id);
  res.json({ success: true, id });
});

app.get('/api/promotions', (_req: Request, res: Response) => {
  res.json(promotions);
});

app.put('/api/promotions/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const index = promotions.findIndex((p) => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Promotion not found' });
  }
  promotions[index] = { ...promotions[index], ...req.body };
  res.json(promotions[index]);
});

app.get('/api/config', (_req: Request, res: Response) => {
  res.json(restaurantConfig);
});

app.put('/api/config', (req: Request, res: Response) => {
  restaurantConfig = { ...restaurantConfig, ...req.body };
  res.json(restaurantConfig);
});

app.get('/api/orders', (_req: Request, res: Response) => {
  res.json(orders);
});

app.post('/api/orders', (req: Request, res: Response) => {
  const order: Order = {
    ...req.body,
    id: req.body.id || `OSO-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    status: 'recibido',
  };
  orders.unshift(order);
  res.status(201).json(order);
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const order = orders.find((o) => o.id === id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }
  order.status = status;
  res.json(order);
});

// Chatbot endpoint: Oso Asistente
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message } = req.body;
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // System knowledge context
  const menuSummary = products
    .map(
      (p) =>
        `- ${p.name} ($${p.price.toLocaleString('en-US')} COP, category: ${p.category}): ${p.description}. Allergens: [${p.allergens.join(', ') || 'None'}]. Sauces: [${p.availableSauces.join(', ')}].`
    )
    .join('\n');

  const promosSummary = promotions
    .map((pr) => `- ${pr.name} (${pr.badge}): ${pr.benefit}. ${pr.conditions}`)
    .join('\n');

  const systemPrompt = `You are "Oso Assistant", the friendly, charismatic, and expert culinary advisor of the restaurant "Oso Fusion" located in Ibagué, Tolima, Colombia.
Our culinary proposal is a unique fusion between Asian gastronomy (high-flame Wok, artisanal Japanese gyozas, Sichuan spices, sweet hoisin glaze, steamed jasmine rice) and the most celebrated flavors of Tolima and Colombia (native lulo fruit, crispy green plantains, crispy pork belly chicharrón, high-altitude Andean coffee, guanábana, golden criolla potatoes).

Restaurant Details:
- Address: ${restaurantConfig.address}, ${restaurantConfig.city}, ${restaurantConfig.department}
- Hours: ${restaurantConfig.openingHours}
- Delivery: City-wide across the urban area of Ibagué. Base delivery fee: $${restaurantConfig.baseDeliveryFee.toLocaleString('en-US')} COP.
- Official WhatsApp ordering line: ${restaurantConfig.phone}

Current Menu Items:
${menuSummary}

Active Promotions:
${promosSummary}

Instructions:
1. Always respond with warmth, hospitality, and culinary passion in English.
2. Provide concise, elegant, and well-structured answers using formatting like bullet points or bold text where appropriate.
3. When guests ask for recommendations or pairings, suggest specific pairings with prices in COP and explain why they harmonize (e.g., Oriental Paisa Bowl with Coconut & Mint Lemonade, or Oriental Tostones followed by Sichuan Lomo and Lulo Cheesecake).
4. If asked about allergies or celiac restrictions, be extremely clear and responsible regarding allergens.
5. Invite guests to customize and add items directly from the virtual menu or confirm orders via the official WhatsApp.`;

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nGuest query: "${message}"` }] },
        ],
      });
      const text = response.text || '';
      return res.json({ reply: text });
    } catch (err) {
      console.warn('Gemini chat error, falling back to heuristic engine:', err);
    }
  }

  // Heuristic intelligent fallback in English
  const lower = message.toLowerCase();
  let reply = '';

  if (lower.includes('recommend') || lower.includes('suggest') || lower.includes('signature') || lower.includes('best') || lower.includes('what should i eat') || lower.includes('popular') || lower.includes('recomien')) {
    reply = `With pleasure! 🐾 Our undisputed signature dish is the **Oriental Paisa Bowl** ($38,900 COP): coconut jasmine rice, crispy pork belly glazed in sweet hoisin and Tolima lulo fruit, steamed edamame, caramelized sweet plantains, and a tender fried egg.\n\nTo start, you cannot miss the **Oriental Tostones** ($24,900 COP) with braised pork shoulder, and to drink, our chilled **Coconut & Mint Lemonade** ($9,900 COP). It's the ultimate Oso Fusion pairing! ✨`;
  } else if (lower.includes('gluten') || lower.includes('celiac') || lower.includes('allergy') || lower.includes('allergens') || lower.includes('alerg')) {
    reply = `Guest wellbeing is our highest priority! 🍃\n\nOur naturally gluten-free options are the **Coconut & Mint Lemonade**, the **Lychee & Blackberry Iced Tea**, and our **Traditional Colombian Specialty Coffee**.\nFor mains, the **Oriental Paisa Bowl** has no wheat flour in its base ingredients, but contains soy (hoisin glaze). If you have severe celiac disease, please inform us when ordering via WhatsApp so our kitchen team can ensure strict cross-contamination protocols. 🐾`;
  } else if (lower.includes('promo') || lower.includes('discount') || lower.includes('birthday') || lower.includes('wednesday') || lower.includes('deal')) {
    reply = `We have delightful promotions at Oso Fusion! 🎉\n\n1. **Fusion Wednesday**: 20% OFF on all Main Courses.\n2. **Birthday Fest**: FREE DESSERT (Lulo Cheesecake or Coconut Mochi) on orders over $45,000 COP!\n3. **Groups & Family**: Complimentary appetizer round (Gyozas & Tostones sampler) for every 5 guests in parties of 20+.\n4. **Sunday for Two**: 2 Coconut Lemonades + crispy Wontons for $19,900 COP with the purchase of two mains.\n\nYou can claim these directly when preparing your order! 🐻`;
  } else if (lower.includes('where') || lower.includes('location') || lower.includes('address') || lower.includes('hours') || lower.includes('open') || lower.includes('time') || lower.includes('donde') || lower.includes('horario')) {
    reply = `📍 We are located at **Cra. 6 with Calle 50, Piedra Pintada, Ibagué, Tolima**.\n\n🕒 Our operating hours are **Tuesday to Sunday from 12:00 PM to 10:30 PM** (and holiday Mondays). We deliver city-wide across Ibagué with a base delivery fee of $5,000 COP! 🛵`;
  } else if (lower.includes('delivery') || lower.includes('order') || lower.includes('whatsapp') || lower.includes('ship') || lower.includes('domicilio')) {
    reply = `🛵 We deliver straight to your doorstep across all urban sectors of Ibagué.\nYou can build your customized order right here on the digital menu, select **"Delivery"**, and send it directly to our official WhatsApp **322 768 8168**. Your order will arrive piping hot in approximately 25 to 40 minutes! 📦`;
  } else if (lower.includes('dessert') || lower.includes('sweet') || lower.includes('cheesecake') || lower.includes('mochi') || lower.includes('postre')) {
    reply = `To finish on a high note, we feature two culinary gems! 🍮\n\n• **Lulo & Ginger Cheesecake** ($18,900 COP): velvety baked cheesecake over spiced ginger crust with native Tolima lulo glaze and candied ginger.\n• **Coconut & Guanábana Mochi** ($16,900 COP): two traditional Japanese mochis filled with Colombian soursop mousse and toasted coconut.\n\nWould you like me to add one to your order? 🐾`;
  } else {
    reply = `What a pleasure to welcome you to Oso Fusion! 🐾 As your culinary guide for our Asian-Colombian kitchen in Ibagué, I can assist you with wok selections, steamed dumplings with tamarind BBQ, our iconic Paisa Bowl, vegetarian modifications, or dietary questions. How may I guide your dining experience today?`;
  }

  res.json({ reply });
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
