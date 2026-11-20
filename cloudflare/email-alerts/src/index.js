const ALLOWED = new Set(["enquiries", "opportunities", "property_submissions", "referrals", "subscriptions"]);
const MAX_BYTES = 12 * 1024;
const cors = (origin) => ({
  "access-control-allow-origin": origin,
  "access-control-allow-methods": "POST, OPTIONS",
  "access-control-allow-headers": "Content-Type",
  "vary": "Origin"
});
const response = (data, status, origin) => new Response(JSON.stringify(data), {
  status, headers: { ...cors(origin), "content-type": "application/json; charset=utf-8", "cache-control": "no-store" }
});
const plain = (v) => v == null || v === "" ? "Not provided" :
  Array.isArray(v) ? v.map(plain).join(", ").slice(0, 1200) :
  typeof v === "object" ? JSON.stringify(v).slice(0, 1200) :
  String(v).replace(/[\u0000-\u001f\u007f]/g, " ").slice(0, 1200);
const esc = (v) => plain(v).replace(/[&<>"']/g, c => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]));
const pick = (d, keys) => keys.map(k => d[k]).find(v => v !== undefined && v !== null && v !== "");
async function hash(s) {
  const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(bytes)].map(x => x.toString(16).padStart(2, "0")).join("");
}
async function verifyTurnstile(token, ip, secret) {
  const form = new URLSearchParams({ secret, response: token });
  if (ip) form.set("remoteip", ip);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!r.ok) return false;
  const result = await r.json();
  return result.success === true && ["bshomez.in", "www.bshomez.in"].includes(result.hostname);
}
function buildEmail(collection, d) {
  const rows = [
    ["Property Name", ["propertyName","projectName","name"]],
    ["Location", ["location","preferredLocation"]],
    ["Full Address", ["fullAddress","address"]],
    ["Google Map URL", ["googleMapUrl","mapUrl"]],
    ["Willing To", ["willingTo"]],
    ["Seller Type", ["sellerType","saleFrom"]],
    ["Property Type", ["propertyType"]],
    ["Society Type", ["societyType","projectTypeCategory"]],
    ["Expected Price / Rent", ["expectedPrice","rentPerMonth","monthlyRental","price"]],
    ["Maintenance", ["maintenance"]],
    ["Advance", ["advance","bookingAmount"]],
    ["Property Status", ["propertyStatus","presentStatus","handoverStatus"]],
    ["Possession Date", ["possessionDate","handoverDate"]],
    ["Configuration", ["configuration","rooms","residenceType"]],
    ["Door Facing", ["doorFacing","mainDoorFacing","facing"]],
    ["Floor / Tower", ["floorAndTower","floorNumber","floor","towerNumber","tower"]],
    ["Total Acres", ["totalAcres","projectSize"]],
    ["Furnishing", ["furnishing","interiorStatus","furnishType"]],
    ["Available From", ["availableFrom"]],
    ["Amenities", ["amenities","features"]],
    ["Message / Others", ["others","message","comment","notes","interested","services"]]
  ].map(([label, keys]) => [label, plain(pick(d, keys))]);
  const name = plain(pick(d, ["ownerName","customerName","name","fullName","contactName"]));
  const phone = plain(pick(d, ["ownerMobile","customerPhone","mobile","phone","number","contactNumber"]));
  const email = plain(pick(d, ["ownerEmail","customerEmail","email"]));
  const rera = plain(pick(d, ["reraNumber","rera","RERANumber"]));
  const text = ["New BS Homez submission", "Collection: " + collection, "Name: " + name, "Mobile: " + phone, "Email: " + email, "RERA Number: " + rera, ...rows.map(([k,v]) => k + ": " + v)].join("\n");
  const html = "<div style='font-family:Arial,sans-serif'><h2>New BS Homez submission</h2><p><b>Name:</b> " + esc(name) + "<br><b>Mobile:</b> " + esc(phone) + "<br><b>Email:</b> " + esc(email) + "</p><p style='padding:12px;background:#fff4d6'><b>RERA Number: " + esc(rera) + "</b></p><p>Collection: " + esc(collection) + "</p><table>" + rows.map(([k,v]) => "<tr><th style='text-align:left;padding:7px'>" + esc(k) + "</th><td style='padding:7px'>" + esc(v) + "</td></tr>").join("") + "</table></div>";
  return { subject: "BS Homez | New " + collection.replaceAll("_", " ") + " submission", text, html };
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigins = (env.ALLOWED_ORIGINS || "https://bshomez.in,https://www.bshomez.in").split(",").map(x => x.trim());
    if (!allowedOrigins.includes(origin)) return new Response("Forbidden", { status: 403 });
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...cors(origin), "access-control-max-age": "86400" } });
    if (request.method !== "POST") return response({ success:false, error:"Method not allowed" }, 405, origin);
    if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) return response({ success:false, error:"JSON required" }, 415, origin);
    if (Number(request.headers.get("content-length") || 0) > MAX_BYTES) return response({ success:false, error:"Request too large" }, 413, origin);
    let body;
    try { body = await request.json(); } catch { return response({ success:false, error:"Invalid JSON" }, 400, origin); }
    if (new TextEncoder().encode(JSON.stringify(body)).length > MAX_BYTES) return response({ success:false, error:"Request too large" }, 413, origin);
    const { collection, eventId, payload, turnstileToken } = body || {};
    if (!ALLOWED.has(collection) || !payload || typeof payload !== "object" || Array.isArray(payload)) return response({ success:false, error:"Invalid submission" }, 400, origin);
    if (typeof eventId !== "string" || !/^[a-f0-9-]{36}$/i.test(eventId)) return response({ success:false, error:"Invalid event ID" }, 400, origin);
    if (typeof turnstileToken !== "string" || turnstileToken.length > 2048) return response({ success:false, error:"Security verification required" }, 400, origin);
    const ip = request.headers.get("CF-Connecting-IP") || "";
    if (!await verifyTurnstile(turnstileToken, ip, env.TURNSTILE_SECRET_KEY)) return response({ success:false, error:"Security verification failed" }, 403, origin);
    const ipKey = "rate:" + await hash(ip || "unknown");
    const eventKey = "event:" + eventId;
    if (await env.ALERT_LIMITS.get(eventKey)) return response({ success:true, duplicate:true }, 200, origin);
    const count = Number(await env.ALERT_LIMITS.get(ipKey) || 0);
    if (count >= 5) return response({ success:false, error:"Too many submissions. Try again later." }, 429, origin);
    await env.ALERT_LIMITS.put(ipKey, String(count + 1), { expirationTtl: 600 });
    await env.ALERT_LIMITS.put(eventKey, "processing", { expirationTtl: 86400 });
    try {
      const mail = buildEmail(collection, payload);
      const sent = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": "Bearer " + env.RESEND_API_KEY, "Content-Type": "application/json", "Idempotency-Key": "bshomez-" + eventId },
        body: JSON.stringify({ from: env.EMAIL_FROM || "BS Homez Alerts <alerts@bshomez.in>", to: [env.EMAIL_TO || "contact@bshomez.in"], ...mail })
      });
      if (!sent.ok) {
        const details = await sent.text();
        await env.ALERT_LIMITS.delete(eventKey);
        console.error("Resend delivery failed", sent.status, details.slice(0, 200));
        return response({ success:false, error:"Email delivery failed" }, 502, origin);
      }
      await env.ALERT_LIMITS.put(eventKey, "sent", { expirationTtl: 86400 });
      return response({ success:true, delivered:true }, 200, origin);
    } catch (error) {
      await env.ALERT_LIMITS.delete(eventKey);
      console.error("Email dispatch failed", error instanceof Error ? error.message : "unknown");
      return response({ success:false, error:"Email service unavailable" }, 502, origin);
    }
  }
};
