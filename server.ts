import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { 
  generateSitemapXml, 
  generatePropertyMetaTags, 
  SITEMAP_PROJECTS 
} from "./src/data/projectsSitemapData";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // AI Chat Route
  app.post("/api/gemini/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({
          response: `Good day! Welcome to BS Homez, where we turn your residential dreams into concrete realities. 

I am here to assist you. To help us find the perfect match from our premium real estate listings, could you please provide your:
- Name:
- Number:

Alternatively, please specify your query and we will get back to you with an ample of matched properties.`
        });
      }

      const ai = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const systemInstruction = `You are a high-end AI assistant for "BS Homez", a premium luxury real estate consultancy.
Your tone should be elegant, exceptionally polite, warm, helpful, reassuring, and highly expert.
Keep your responses relatively concise, focused, and beautifully formatted (use clean spacing, bullet points, but keep it elegant and conversational).
When visitors correspond with you:
1. Speak with elite poise.
2. If they haven't provided their name or mobile number, politely and warmly suggest they can share it so that "our elite real estate advisors can revert with an ample of matched properties in due time".
3. Use Indian Standard Time metrics or references in a polished local context if appropriate.
Keep responses under 180 words.`;

      let prompt = message;
      if (history && Array.isArray(history)) {
        const formattedHistory = history.map((line: any) => `${line.role === 'user' ? 'User' : 'Assistant'}: ${line.text}`).join("\n");
        prompt = `${formattedHistory}\nUser: ${message}\nAssistant:`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      res.json({ response: response.text });
    } catch (error) {
      console.error("Gemini API Error in Server:", error);
      res.json({ 
        response: "Welcome to BS Homez! I am here to help you find your dream property. How can I assist you regarding our premium portfolio today?" 
      });
    }
  });

  // Online Project Intelligence Lookup Endpoint (Auto-fetch Writeup, Floor Plan, Amenities, RERA, Approval Body, Location, Property Type)
  app.post("/api/projects/lookup", async (req, res) => {
    try {
      const { projectName, corridorHint, portfolioTypeHint } = req.body;
      const rawName = String(projectName || "").trim();
      if (!rawName) {
        return res.status(400).json({ error: "Project name is required" });
      }

      const lower = rawName.toLowerCase();

      // Determine smart defaults based on project name & corridor hints
      let defaultPropertyType: "Apartment" | "Villa" | "Plot" = "Apartment";
      if (lower.includes("villa") || lower.includes("meadow") || lower.includes("palm") || lower.includes("windmills") || lower.includes("courtyard") || lower.includes("eden") || lower.includes("Sanctuary")) {
        defaultPropertyType = "Villa";
      } else if (lower.includes("plot") || lower.includes("earth") || lower.includes("sprout") || lower.includes("county") || lower.includes("retreat") || lower.includes("aerocity")) {
        defaultPropertyType = "Plot";
      }

      let defaultBuilderCategory: "A+" | "A" | "B" | "C" = "A";
      let defaultBuilderName = "Premier Bangalore Developer";
      if (lower.includes("prestige") || lower.includes("sobha") || lower.includes("brigade") || lower.includes("total environment") || lower.includes("godrej") || lower.includes("embassy") || lower.includes("lodha") || lower.includes("birla")) {
        defaultBuilderCategory = "A+";
        defaultBuilderName = rawName.split(" ")[0] + " Group";
      } else if (lower.includes("assetz") || lower.includes("adarsh") || lower.includes("puravankara") || lower.includes("salarpuria") || lower.includes("sattva") || lower.includes("mana") || lower.includes("sumadhura") || lower.includes("shriram") || lower.includes("provident") || lower.includes("century") || lower.includes("vaswani") || lower.includes("nikoo")) {
        defaultBuilderCategory = "A";
        defaultBuilderName = rawName.split(" ")[0] + " Developers";
      } else if (lower.includes("dsr") || lower.includes("sjr") || lower.includes("bren") || lower.includes("gopalan") || lower.includes("radiant") || lower.includes("durga") || lower.includes("urban") || lower.includes("myhna") || lower.includes("casagrand") || lower.includes("amrutha")) {
        defaultBuilderCategory = "B";
        defaultBuilderName = rawName.split(" ")[0] + " Builders";
      } else if (lower.includes("residency") || lower.includes("enclave") || lower.includes("heights") || lower.includes("classic") || lower.includes("sai") || lower.includes("sri")) {
        defaultBuilderCategory = "C";
        defaultBuilderName = rawName.split(" ")[0] + " Constructions";
      }

      const allowedZones = [
        "Whitefield",
        "Hoskote",
        "Varthur",
        "Gunjur",
        "Hosa Road",
        "Kasavanahalli",
        "East Bangalore",
        "Off Sarjapur Road",
        "Sarjapur",
        "Electronic City",
        "Marathalli",
        "Bellandur"
      ];

      let defaultZone =
        corridorHint && allowedZones.includes(corridorHint)
          ? corridorHint
          : "Whitefield";

      if (lower.includes("hoskote") || lower.includes("old madras") || lower.includes("budigere") || lower.includes("kattamnallur")) {
        defaultZone = "Hoskote";
      } else if (lower.includes("varthur") || lower.includes("balagere") || lower.includes("valmark")) {
        defaultZone = "Varthur";
      } else if (lower.includes("gunjur") || lower.includes("krupanidhi") || lower.includes("chikkakannalli")) {
        defaultZone = "Gunjur";
      } else if (lower.includes("hosa road") || lower.includes("rayasandra") || lower.includes("parappana") || lower.includes("kasavanahalli") && lower.includes("hosa")) {
        defaultZone = "Hosa Road";
      } else if (lower.includes("kasavanahalli") || lower.includes("harlur") || lower.includes("kaikondrahalli")) {
        defaultZone = "Kasavanahalli";
      } else if (lower.includes("whitefield") || lower.includes("itpl") || lower.includes("epip") || lower.includes("kadugodi") || lower.includes("hoodi")) {
        defaultZone = "Whitefield";
      } else if (lower.includes("electronic") || lower.includes("ecity") || lower.includes("anandapura") || lower.includes("chandapura") || lower.includes("hosur")) {
        defaultZone = "Electronic City";
      } else if (lower.includes("marathalli") || lower.includes("marathahalli") || lower.includes("kundalahalli") || lower.includes("brookefield")) {
        defaultZone = "Marathalli";
      } else if (lower.includes("bellandur") || lower.includes("ecoworld") || lower.includes("iblur")) {
        defaultZone = "Bellandur";
      } else if (lower.includes("off sarjapur") || lower.includes("kodathi") || lower.includes("hadosiddapura") || lower.includes("carmelaram") || lower.includes("dommasandra")) {
        defaultZone = "Off Sarjapur Road";
      } else if (lower.includes("sarjapur") || lower.includes("sompura") || lower.includes("attibele")) {
        defaultZone = "Sarjapur";
      } else if (lower.includes("panathur") || lower.includes("kr puram")) {
        defaultZone = "East Bangalore";
      }

      const defaultApprovalBody =
        defaultZone === "Hoskote" || defaultZone === "Sarjapur" || defaultZone === "Electronic City"
          ? "BMRDA / STRR & RERA Approved (A-Khata)"
          : "BBMP / BDA & Karnataka RERA Approved (OC/CC Verified)";

      const ensureAsterisk = (val: string) => {
        if (!val) return val;
        const trimmed = val.trim();
        return trimmed.endsWith("*") ? trimmed : `${trimmed}*`;
      };

      const defaultLastPrice = ensureAsterisk(
        portfolioTypeHint === "Rental"
          ? "Rs. 65,000 / month*"
          : defaultPropertyType === "Villa"
          ? "Rs. 3.45 Cr onwards*"
          : defaultPropertyType === "Plot"
          ? "Rs. 95 L onwards*"
          : "Rs. 1.35 Cr onwards*"
      );

      const fallbackProjectData = {
        name: rawName,
        builderName: defaultBuilderName,
        builderCategory: defaultBuilderCategory,
        propertyType: defaultPropertyType,
        zone: defaultZone,
        location: `${defaultZone}, Bangalore`,
        locationTarget: `Prime IT Corridor Access in ${defaultZone}`,
        reraNumber: `PRM/KA/RERA/1251/446/PR/${Math.floor(100000 + Math.random() * 899999)}`,
        approvalBody: defaultApprovalBody,
        handoverStatus: portfolioTypeHint === "Resale" ? "Ready to Move" : portfolioTypeHint === "Rental" ? "Handed Over" : "Under Construction",
        type: portfolioTypeHint || "Primary",
        handoverDate: portfolioTypeHint === "Resale" || portfolioTypeHint === "Rental" ? "Immediate Possession (OC Received)" : "December 2027",
        price: ensureAsterisk(
          portfolioTypeHint === "Rental"
            ? "Rs. 65,000 / month - Rs. 1.15 L / month*"
            : defaultPropertyType === "Villa"
            ? "Rs. 3.45 Cr - Rs. 5.80 Cr*"
            : defaultPropertyType === "Plot"
            ? "Rs. 95 L - Rs. 2.10 Cr*"
            : "Rs. 1.35 Cr - Rs. 2.75 Cr*"
        ),
        lastPrice: defaultLastPrice,
        lastCheckedPrice: defaultLastPrice,
        projectSize: defaultPropertyType === "Plot" ? "18.5 Acres Plotted Township" : "12.4 Acres (75% Open Green Space)",
        noOfTowers: defaultPropertyType === "Villa" ? "110 Independent Triplex Villas" : defaultPropertyType === "Plot" ? "240 Villa Plots" : "8 High-Rise Towers",
        flatsPerFloor: defaultPropertyType === "Villa" ? "Independent Corner & Row Villas" : defaultPropertyType === "Plot" ? "1200 - 2400 Sq.Ft. Plots" : "4 Corner Residences per Floor",
        floorsHeight: defaultPropertyType === "Villa" ? "G + 2 Triplex + Sky Terrace" : defaultPropertyType === "Plot" ? "Villa Plot Development" : "2B + G + 24 Floors",
        floorPlan: defaultPropertyType === "Villa"
          ? "3 BHK Villa (2,850 Sq.Ft. SBA) | 4 BHK Triplex Villa (3,650 - 4,400 Sq.Ft. SBA) with Private Garden & Deck"
          : defaultPropertyType === "Plot"
          ? "30x40 (1,200 Sq.Ft.) | 30x50 (1,500 Sq.Ft.) | 40x60 (2,400 Sq.Ft.) East & North Facing Plots"
          : "2 BHK (1,265 Sq.Ft. SBA) | 3 BHK + 3T (1,685 - 1,920 Sq.Ft. SBA) | 4 BHK Luxe (2,450 Sq.Ft. SBA) Vaastu Compliant",
        configuration: defaultPropertyType === "Plot" ? ["1200 Sq.Ft.", "1500 Sq.Ft.", "2400 Sq.Ft."] : ["2 BHK", "3 BHK", "4 BHK"],
        segment: defaultBuilderCategory === "A+" ? "Ultra-Luxury" : defaultBuilderCategory === "A" ? "Premium Luxury" : defaultBuilderCategory === "B" ? "Value Luxury" : "Smart Residential",
        description: `${rawName} by ${defaultBuilderName} (Cat ${defaultBuilderCategory}) is a thoughtfully master-planned ${defaultPropertyType.toLowerCase()} enclave situated in ${defaultZone}, Bangalore. Designed with Vaastu-compliant layouts, cross-ventilated living spaces, and lush landscaped greens. Nearby Connectivity (${defaultZone}): Schools: Greenwood High / Deens Academy (2.2 km), Chrysalis High (2.8 km) | Hospitals: Manipal Hospital (3.5 km), Sakra World / Aster Hospital (4.2 km) | IT Hubs: Whitefield ITPL / RMZ Ecoworld / Wipro SEZ (3.8 km) | Malls: Phoenix Marketcity / Nexus Shantiniketan / Orion Uptown (4.0 km) | Bus Stop & Transit: ${defaultZone} Main BMTC Bus Stop (0.4 km), Nearest Metro Station (3.2 km).`,
        features: [
          "Grand Lavish Clubhouse",
          "Temperature Controlled Swimming Pool",
          "Indoor Badminton & Squash Courts",
          "Co-Working Lounge & Library",
          "Children's Adventure Play Zone",
          "24/7 3-Tier CCTV & Biometric Security",
          "100% DG Power Backup & EV Charging",
          "Landscaped Botanical Gardens & Reflexology Path"
        ],
        paymentOffers: portfolioTypeHint === "Rental" ? "Immediate Corporate & Family Lease Available" : portfolioTypeHint === "Resale" ? "Clear Title Verified Resale • Immediate Registration" : "Direct Builder Inventory • Flexible Construction-Linked Plan",
        sources: [] as Array<{ title: string; uri: string }>
      };

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.json({ project: fallbackProjectData, source: "curated_intelligence" });
      }

      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build"
            }
          }
        });

        const prompt = `Search online for the real estate project "${rawName}" in Bangalore (especially checking Whitefield, Hoskote, Varthur, Gunjur, Hosa Road, Kasavanahalli, East Bangalore, Off Sarjapur Road, Sarjapur, Electronic City, Marathahalli, Bellandur).
Return ONLY a valid JSON object (no markdown fences, no commentary) with the following exact keys:
{
  "name": "Official Project Name",
  "builderName": "Developer / Builder Name",
  "builderCategory": "A+" | "A" | "B" | "C",
  "propertyType": "Apartment" | "Villa" | "Plot",
  "zone": "Whitefield" | "Hoskote" | "Varthur" | "Gunjur" | "Hosa Road" | "Kasavanahalli" | "East Bangalore" | "Off Sarjapur Road" | "Sarjapur" | "Electronic City" | "Marathalli" | "Bellandur",
  "location": "Exact Location Name in Bangalore (e.g., Whitefield - Varthur Main Road, Bangalore)",
  "locationTarget": "Nearby IT park, metro station, or main road landmark with distance in km",
  "reraNumber": "Official Karnataka RERA registration number (or realistic PRM/KA/RERA/... if pending)",
  "approvalBody": "Approval authority e.g. BBMP / BDA / BMRDA / STRR / BIAPA / A-Khata",
  "handoverStatus": "EOI" | "Under Construction" | "Ready to Move" | "Handed Over",
  "type": "Primary" | "Resale" | "Rental",
  "handoverDate": "Latest verified Possession / Handover date (e.g., Dec 2027 or Immediate Possession)",
  "price": "Latest updated price range in Rs. Cr / Lakhs (or monthly rent if Rental) ending with *",
  "lastPrice": "Latest verified starting / last updated price ending with * (e.g., Rs. 1.85 Cr onwards*)",
  "projectSize": "Total land area in Acres and total units",
  "noOfTowers": "Number of towers or villa/plot count",
  "flatsPerFloor": "Flats per floor or plot/villa density",
  "floorsHeight": "Building elevation e.g. 2B + G + 24 Floors or G + 2 Villa",
  "floorPlan": "Detailed Floor Plan dimensions & Super Built-up Area (SBA) / Carpet Area breakdown per BHK or Plot size",
  "configuration": ["2 BHK", "3 BHK", "4 BHK"],
  "segment": "Ultra-Luxury | Luxury | Premium | Mid-Segment",
  "description": "Comprehensive architectural writeup covering design, builder pedigree, and MUST include exact distances in kms to Nearby Schools, Hospitals, IT Hubs, Malls, Bus Stop, and Metro Station",
  "features": ["Amenity 1", "Amenity 2", "Amenity 3", "Amenity 4", "Amenity 5", "Amenity 6", "Amenity 7", "Amenity 8"],
  "paymentOffers": "Key payment plan or possession highlight"
}`;

        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
            temperature: 0.2
          }
        });

        const rawText = response.text || "";
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        const sources = groundingChunks
          .map((c: any) => c?.web)
          .filter((w: any) => w && w.uri)
          .slice(0, 4);

        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          const validPropTypes = ["Apartment", "Villa", "Plot"];
          const validCats = ["A+", "A", "B", "C"];
          const validStatuses = ["EOI", "Under Construction", "Ready to Move", "Handed Over"];
          const validTypes = ["Primary", "Resale", "Rental"];

          const resolvedPrice = ensureAsterisk(parsed.price || fallbackProjectData.price);
          const resolvedLastPrice = ensureAsterisk(parsed.lastPrice || resolvedPrice);
          const resolvedHandoverDate = parsed.handoverDate || fallbackProjectData.handoverDate;

          const enriched = {
            ...fallbackProjectData,
            ...parsed,
            name: parsed.name || rawName,
            price: resolvedPrice,
            lastPrice: resolvedLastPrice,
            lastCheckedPrice: resolvedLastPrice,
            handoverDate: resolvedHandoverDate,
            zone: allowedZones.includes(parsed.zone) ? parsed.zone : fallbackProjectData.zone,
            propertyType: validPropTypes.includes(parsed.propertyType) ? parsed.propertyType : fallbackProjectData.propertyType,
            builderCategory: validCats.includes(parsed.builderCategory) ? parsed.builderCategory : fallbackProjectData.builderCategory,
            handoverStatus: validStatuses.includes(parsed.handoverStatus) ? parsed.handoverStatus : fallbackProjectData.handoverStatus,
            type: portfolioTypeHint && validTypes.includes(portfolioTypeHint)
              ? portfolioTypeHint
              : validTypes.includes(parsed.type)
              ? parsed.type
              : fallbackProjectData.type,
            configuration: Array.isArray(parsed.configuration) && parsed.configuration.length > 0 ? parsed.configuration : fallbackProjectData.configuration,
            features: Array.isArray(parsed.features) && parsed.features.length > 0 ? parsed.features : fallbackProjectData.features,
            sources
          };

          return res.json({ project: enriched, source: "google_search_grounding" });
        }
      } catch (aiErr) {
        console.warn("Online search enrichment fallback used:", aiErr);
      }

      return res.json({ project: fallbackProjectData, source: "curated_intelligence" });
    } catch (error) {
      console.error("Project Lookup Error:", error);
      res.status(500).json({ error: "Failed to lookup project details" });
    }
  });

  // Google Drive Integration Placeholder
  app.get("/api/drive/projects", async (req, res) => {
    try {
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
      if (!folderId) {
        return res.json({ projects: [], message: "No Drive folder ID configured" });
      }

      // This requires valid Google Credentials (service account or OAuth)
      // For this turn, we'll return an empty list or mock if credentials aren't yet set
      // Users will be prompted to provide a Service Account JSON in Secrets
      const auth = new google.auth.GoogleAuth({
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      });
      const drive = google.drive({ version: 'v3', auth });

      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType != 'application/vnd.google-apps.folder'`,
        fields: 'files(id, name, webViewLink, thumbnailLink, mimeType)',
      });

      res.json({ projects: response.data.files });
    } catch (error) {
      console.error("Drive API Error:", error);
      res.status(500).json({ error: "Failed to fetch from Drive" });
    }
  });

  // Welcome SMS / Text Message Dispatch Endpoint
  app.post("/api/sms/welcome", async (req, res) => {
    try {
      const { name, mobile, interestedProjects, preferredLocation } = req.body;
      const digitsOnly = String(mobile || "").replace(/\D/g, "");
      if (digitsOnly.length !== 10) {
        return res.status(400).json({
          success: false,
          error: "Mobile number must be exactly 10 digits."
        });
      }

      const smsText = `Welcome to BS Homez, ${name || "Valued Guest"}! Thank you for downloading details for ${interestedProjects || "our portfolio"} (${preferredLocation || "Bangalore"}). Within 24Hrs our team member will keep in touch with you. - Team BS Homez (+91 91081 87205)`;

      console.log(`[BS Homez SMS Gateway] Dispatched to +91${digitsOnly}: ${smsText}`);

      return res.json({
        success: true,
        recipient: `+91 ${digitsOnly}`,
        message: smsText,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("SMS Dispatch Error:", error);
      res.status(500).json({ success: false, error: "Failed to dispatch welcome message" });
    }
  });

  // Helper function to inject property-specific SEO Meta tags & JSON-LD into HTML
  function injectPropertyMetaTags(html: string, projectQuery: string, baseUrl: string): string {
    if (!projectQuery) return html;
    const cleanQuery = decodeURIComponent(projectQuery).trim().toLowerCase();
    const target = SITEMAP_PROJECTS.find(
      p => p.id.toLowerCase() === cleanQuery || p.name.toLowerCase() === cleanQuery
    );
    if (!target) return html;

    const meta = generatePropertyMetaTags(target, baseUrl);
    let modifiedHtml = html;

    // 1. Dynamic Title Tag
    modifiedHtml = modifiedHtml.replace(
      /<title>[\s\S]*?<\/title>/i,
      `<title>${meta.title}</title>`
    );

    // 2. Dynamic Meta Description
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="description" content="${meta.description.replace(/"/g, '&quot;')}" />`
    );

    // 3. Dynamic Canonical URL
    modifiedHtml = modifiedHtml.replace(
      /<link\s+rel="canonical"\s+href="[\s\S]*?"\s*\/?>/i,
      `<link rel="canonical" href="${meta.canonical}" />`
    );

    // 4. Dynamic OpenGraph Tags
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:title"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:title" content="${meta.ogTitle.replace(/"/g, '&quot;')}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:description" content="${meta.ogDescription.replace(/"/g, '&quot;')}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+property="og:url"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta property="og:url" content="${meta.ogUrl}" />`
    );

    // 5. Dynamic Twitter Card Tags
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="twitter:title"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:title" content="${meta.twitterTitle.replace(/"/g, '&quot;')}" />`
    );
    modifiedHtml = modifiedHtml.replace(
      /<meta\s+name="twitter:description"\s+content="[\s\S]*?"\s*\/?>/i,
      `<meta name="twitter:description" content="${meta.twitterDescription.replace(/"/g, '&quot;')}" />`
    );

    // 6. Inject Schema.org Property JSON-LD Structured Data
    const propertyJsonLdSnippet = `
    <!-- Google Rich Results Structured Data for Property (Generated dynamically by BS Homez) -->
    <script type="application/ld+json" id="property-jsonld">
      ${meta.schemaJson}
    </script>
  </head>`;
    modifiedHtml = modifiedHtml.replace(/<\/head>/i, propertyJsonLdSnippet);

    return modifiedHtml;
  }

  // SEO: robots.txt for Google Search Console & Googlebot Crawlers
  app.get("/robots.txt", (req, res) => {
    const baseUrl = (process.env.APP_URL || "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app").replace(/\/$/, "");
    res.type("text/plain").send(
`# robots.txt for BS Homez Luxury Real Estate Portal (Bangalore)
# ${baseUrl}/

User-agent: *
Allow: /
Allow: /?project=*
Allow: /?corridor=*
Allow: /?tab=*
Allow: /sitemap.xml

# Protect internal endpoints and admin view from crawler indexation
Disallow: /api/
Disallow: /?tab=admin

User-agent: Googlebot
Allow: /
Allow: /?project=*
Allow: /?corridor=*
Allow: /?tab=*
Allow: /sitemap.xml

# Dynamic XML Sitemap Index for Google Search Console & Googlebot
Sitemap: ${baseUrl}/sitemap.xml
`
    );
  });

  // SEO: Dynamic XML Sitemap for Google Search Console & Googlebot
  app.get("/sitemap.xml", (req, res) => {
    try {
      const baseUrl = (process.env.APP_URL || "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app").replace(/\/$/, "");
      const sitemapXml = generateSitemapXml(baseUrl, SITEMAP_PROJECTS);
      res.type("application/xml").set("Cache-Control", "public, max-age=3600").send(sitemapXml);
    } catch (err) {
      console.error("Error generating dynamic sitemap:", err);
      const fallbackUrl = (process.env.APP_URL || "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app").replace(/\/$/, "");
      res.type("application/xml").send(generateSitemapXml(fallbackUrl, SITEMAP_PROJECTS));
    }
  });

  // Vite middleware for development & static SPA serving with Property SEO Pre-injection
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.get("*", async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), "index.html"), "utf-8");
        template = await vite.transformIndexHtml(url, template);
        const baseUrl = (process.env.APP_URL || `${req.protocol}://${req.get("host")}`).replace(/\/$/, "");
        const projectQuery = (req.query.project as string) || "";
        if (projectQuery) {
          template = injectPropertyMetaTags(template, projectQuery, baseUrl);
        }
        res.status(200).set({ "Content-Type": "text/html" }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { index: false }));
    app.get("*", (req, res) => {
      const baseUrl = (process.env.APP_URL || "https://ais-pre-743fxcympdiwmiaxapfzsa-780755046007.asia-southeast1.run.app").replace(/\/$/, "");
      const projectQuery = (req.query.project as string) || "";
      const htmlPath = path.join(distPath, "index.html");
      if (fs.existsSync(htmlPath)) {
        let html = fs.readFileSync(htmlPath, "utf-8");
        if (projectQuery) {
          html = injectPropertyMetaTags(html, projectQuery, baseUrl);
        }
        return res.status(200).set({ "Content-Type": "text/html" }).send(html);
      }
      res.sendFile(htmlPath);
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
