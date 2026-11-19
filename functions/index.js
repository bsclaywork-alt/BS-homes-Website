const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const { Resend } = require('resend');
const admin = require('firebase-admin');

admin.initializeApp();

const resendApiKey = defineSecret('RESEND_API_KEY');
const REGION = 'asia-southeast1';
const RECIPIENT = 'contact@bshomez.in';
const SENDER = 'BS Homez Alerts <alerts@bshomez.in>';

const FIELD_ORDER = [
  ['Property Name', ['propertyName', 'projectName', 'name']],
  ['Location', ['location', 'preferredLocation']],
  ['Full Address', ['fullAddress', 'address']],
  ['Google Map URL', ['googleMapUrl', 'mapUrl']],
  ['Willing To', ['willingTo']],
  ['Seller Type', ['sellerType', 'saleFrom']],
  ['Property Type', ['propertyType']],
  ['Society Type', ['societyType', 'projectTypeCategory']],
  ['Expected Price/Rent', ['expectedPrice', 'rentPerMonth', 'monthlyRental', 'price']],
  ['Maintenance', ['maintenance']],
  ['Advance', ['advance', 'bookingAmount']],
  ['Property Status', ['propertyStatus', 'presentStatus', 'handoverStatus']],
  ['Possession Date', ['possessionDate', 'handoverDate']],
  ['Configuration', ['configuration', 'rooms', 'residenceType']],
  ['Door Facing', ['doorFacing', 'mainDoorFacing', 'facing']],
  ['Floor & Tower', ['floorAndTower']],
  ['Floor', ['floorNumber', 'floor', 'floorAvailability']],
  ['Tower', ['towerNumber', 'tower']],
  ['Total Acres', ['totalAcres', 'projectSize']],
  ['Furnishing', ['furnishing', 'interiorStatus', 'furnishType']],
  ['Available From', ['availableFrom']],
  ['Amenities', ['amenities', 'features']],
  ['Others', ['others', 'message', 'comment', 'notes', 'interested', 'services']]
];

function plain(value) {
  if (value === undefined || value === null || value === '') return 'Not provided';
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'Not provided';
  if (typeof value === 'object') {
    if (typeof value.toDate === 'function') return value.toDate().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    return JSON.stringify(value);
  }
  return String(value);
}
function pick(data, keys) {
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}
function esc(value) {
  return plain(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function buildEmail(collectionName, id, data) {
  const personName = pick(data, ['ownerName', 'customerName', 'name', 'fullName', 'contactName']);
  const mobile = pick(data, ['ownerMobile', 'customerPhone', 'mobile', 'phone', 'number', 'contactNumber']);
  const email = pick(data, ['ownerEmail', 'customerEmail', 'email']);
  const rera = pick(data, ['reraNumber', 'rera', 'RERANumber']);
  const propertyRows = FIELD_ORDER.map(([label, keys]) => {
    const value = pick(data, keys);
    const display = label === 'Expected Price/Rent' && data.willingTo === 'Rental' && data.rentPerMonth
      ? data.rentPerMonth
      : value;
    return { label, value: plain(display) };
  });
  const extras = Object.entries(data)
    .filter(([key, value]) => value !== undefined && value !== null && value !== '' &&
      !FIELD_ORDER.some(([, keys]) => keys.includes(key)) &&
      !['ownerName','customerName','name','fullName','contactName','ownerMobile','customerPhone','mobile','phone','number','contactNumber','ownerEmail','customerEmail','email','reraNumber','rera','RERANumber','createdAt','updatedAt','timestamp','submissionStatus','publicationStatus','isDeleted','photos','video'].includes(key))
    .slice(0, 35)
    .map(([key, value]) => [key.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase()), plain(value)]);
  const title = `New BS Homez enquiry — ${plain(pick(data, ['propertyName','projectName','name']) || collectionName)}`;
  const rows = propertyRows.map(({label,value}) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#555;width:190px">${esc(label)}</td><td style="padding:8px;border-bottom:1px solid #eee;color:#111">${esc(value)}</td></tr>`).join('');
  const extraRows = extras.map(([label,value]) => `<tr><td style="padding:8px;border-bottom:1px solid #eee;color:#555">${esc(label)}</td><td style="padding:8px;border-bottom:1px solid #eee;color:#111">${esc(value)}</td></tr>`).join('');
  const reraBlock = `<div style="margin:16px 0;padding:14px;border:2px solid #b58b43;background:#fff9ec"><div style="font-size:12px;font-weight:700;color:#805b1c;text-transform:uppercase">RERA Number</div><div style="font-size:18px;font-weight:800;color:#111;word-break:break-word">${esc(rera)}</div></div>`;
  const html = `<div style="font-family:Arial,sans-serif;color:#222;max-width:760px;margin:auto"><div style="background:#111;padding:20px;color:#d5b16c"><h2 style="margin:0">BS HOMEZ — NEW INQUIRY</h2><p style="margin:6px 0 0">Source: ${esc(collectionName)} | Record: ${esc(id)}</p></div><div style="padding:18px"><h3>Contact Details</h3><table style="width:100%;border-collapse:collapse"><tr><td style="padding:8px;color:#555;width:190px">Name</td><td style="padding:8px;font-weight:bold">${esc(personName)}</td></tr><tr><td style="padding:8px;color:#555">Mobile</td><td style="padding:8px;font-weight:bold">${esc(mobile)}</td></tr><tr><td style="padding:8px;color:#555">Email</td><td style="padding:8px">${esc(email)}</td></tr></table>${reraBlock}<h3>Property / Inquiry Details</h3><table style="width:100%;border-collapse:collapse">${rows}${extraRows}</table><p style="font-size:11px;color:#777;margin-top:18px">This notification is private and intended for BS Homez Admin. Do not publish owner contact details or full address to the public portfolio.</p></div></div>`;
  const text = [
    'BS HOMEZ — NEW INQUIRY', `Source: ${collectionName}`, `Record: ${id}`, '',
    'CONTACT DETAILS', `Name: ${plain(personName)}`, `Mobile: ${plain(mobile)}`, `Email: ${plain(email)}`, '',
    `RERA NUMBER: ${plain(rera)}`, '', 'PROPERTY / INQUIRY DETAILS',
    ...propertyRows.map(({label,value}) => `${label}: ${value}`),
    ...extras.map(([label,value]) => `${label}: ${value}`)
  ].join('\n');
  return { subject: title, html, text };
}

async function deliver(collectionName, snapshot, secretValue) {
  const db = admin.firestore();
  const alertRef = db.collection('_emailAlertDispatches').doc(`${collectionName}__${snapshot.id}`);
  const now = Date.now();
  const claimed = await db.runTransaction(async (tx) => {
    const current = await tx.get(alertRef);
    const state = current.exists ? current.data() : {};
    if (state.status === 'sent') return false;
    if (state.status === 'processing' && state.leaseUntil && state.leaseUntil.toMillis() > now) return false;
    tx.set(alertRef, {
      status: 'processing',
      sourceCollection: collectionName,
      sourceDocumentId: snapshot.id,
      attempts: (state.attempts || 0) + 1,
      leaseUntil: admin.firestore.Timestamp.fromMillis(now + 10 * 60 * 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
    return true;
  });
  if (!claimed) return;
  try {
    const resend = new Resend(secretValue);
    const email = buildEmail(collectionName, snapshot.id, snapshot.data());
    const result = await resend.emails.send({
      from: SENDER,
      to: [RECIPIENT],
      subject: email.subject,
      html: email.html,
      text: email.text,
      tags: [{ name: 'source', value: collectionName }]
    });
    if (result.error) throw new Error(result.error.message || 'Resend delivery failed');
    await alertRef.set({
      status: 'sent',
      providerMessageId: result.data && result.data.id ? result.data.id : null,
      sentAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      leaseUntil: admin.firestore.FieldValue.delete(),
      lastError: admin.firestore.FieldValue.delete()
    }, { merge: true });
  } catch (error) {
    await alertRef.set({
      status: 'failed',
      lastError: String(error && error.message ? error.message : error).slice(0, 1000),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      leaseUntil: admin.firestore.FieldValue.delete()
    }, { merge: true });
    throw error;
  }
}

function makeHandler(collectionName) {
  return async (event) => {
    const snapshot = event.data;
    if (!snapshot) return;
    await deliver(collectionName, snapshot, resendApiKey.value());
  };
}

exports.emailEnquiryAlert = onDocumentCreated({
  document: 'enquiries/{enquiryId}',
  region: REGION,
  retry: true,
  secrets: [resendApiKey],
  timeoutSeconds: 120
}, makeHandler('enquiries'));

exports.emailOpportunityAlert = onDocumentCreated({
  document: 'opportunities/{opportunityId}',
  region: REGION,
  retry: true,
  secrets: [resendApiKey],
  timeoutSeconds: 120
}, makeHandler('opportunities'));

exports.emailPropertySubmissionAlert = onDocumentCreated({
  document: 'property_submissions/{submissionId}',
  region: REGION,
  retry: true,
  secrets: [resendApiKey],
  timeoutSeconds: 120
}, makeHandler('property_submissions'));
