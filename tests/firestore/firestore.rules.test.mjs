import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import { doc, getDoc, serverTimestamp, setDoc, writeBatch, updateDoc } from 'firebase/firestore';

const projectId = 'bshomez-rules-test';
let testEnv;

const submissionData = (submissionId, portfolioId) => ({
  id: submissionId,
  publicPortfolioId: portfolioId,
  dedupKey: '9876543210_sample_property_whitefield_sell',
  ownerName: 'Private Owner',
  ownerMobile: '9876543210',
  ownerCountryCode: '+91',
  propertyName: 'Sample Property',
  location: 'Whitefield',
  fullAddress: 'Private full address, Bengaluru',
  googleMapUrl: 'https://maps.google.com/?q=whitefield',
  reraNumber: 'PRM/KA/RERA/123456',
  willingTo: 'Sell',
  sellerType: 'Resale',
  targetCategory: 'Resale',
  propertyType: 'Apartment',
  societyType: 'Gated',
  expectedPrice: 12500000,
  propertyStatus: 'Ready to Move',
  possessionDate: '',
  configuration: '3 BHK',
  doorFacing: 'East',
  floorNumber: '8',
  towerNumber: 'A',
  totalAcres: '',
  amenities: ['Security', 'Lift'],
  furnishing: 'Semi Furnished',
  others: '',
  photos: [],
  video: null,
  submissionStatus: 'Pending Review',
  isDeleted: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

const publicData = (submissionId, portfolioId) => ({
  id: portfolioId,
  submissionId,
  name: 'Sample Property',
  location: 'Whitefield',
  googleMapUrl: 'https://maps.google.com/?q=whitefield',
  reraNumber: 'PRM/KA/RERA/123456',
  category: 'Resale',
  propertyType: 'Apartment',
  societyType: 'Gated',
  formattedPrice: 'Rs. 1.25 Cr*',
  propertyStatus: 'Ready to Move',
  possessionDate: '',
  configuration: '3 BHK',
  doorFacing: 'East',
  floorNumber: '8',
  towerNumber: 'A',
  totalAcres: '',
  amenities: ['Security', 'Lift'],
  furnishing: 'Semi Furnished',
  others: '',
  mainImageUrl: '',
  imageUrls: [],
  photoThumbnails: [],
  videoUrl: '',
  videoPosterUrl: '',
  storagePaths: [],
  publicationStatus: 'Pending Review',
  isPublished: false,
  isDeleted: false,
  createdAt: serverTimestamp(),
  updatedAt: serverTimestamp()
});

before(async () => {
  const rules = await readFile(new URL('../../firestore.rules', import.meta.url), 'utf8');
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: { rules }
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

after(async () => {
  await testEnv.cleanup();
});

describe('Offer Your Asset Firestore rules', () => {
  it('allows a valid public submission batch while keeping owner details private', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, 'property_submissions/submission-1'), submissionData('submission-1', 'portfolio-1'));
    batch.set(doc(db, 'public_portfolio/portfolio-1'), publicData('submission-1', 'portfolio-1'));
    await assertSucceeds(batch.commit());

    await assertFails(getDoc(doc(db, 'property_submissions/submission-1')));
    await assertFails(getDoc(doc(db, 'public_portfolio/portfolio-1')));

    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    const privateRecord = await assertSucceeds(getDoc(doc(adminDb, 'property_submissions/submission-1')));
    assert.equal(privateRecord.data().ownerName, 'Private Owner');

    const publicRecord = await assertSucceeds(getDoc(doc(adminDb, 'public_portfolio/portfolio-1')));
    assert.equal('ownerName' in publicRecord.data(), false);
    assert.equal('ownerMobile' in publicRecord.data(), false);
    assert.equal('fullAddress' in publicRecord.data(), false);
  });

  it('rejects owner contact fields in a public portfolio document', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const batch = writeBatch(db);
    batch.set(doc(db, 'property_submissions/submission-2'), submissionData('submission-2', 'portfolio-2'));
    const publicRecord = publicData('submission-2', 'portfolio-2');
    publicRecord.ownerMobile = '9876543210';
    batch.set(doc(db, 'public_portfolio/portfolio-2'), publicRecord);
    await assertFails(batch.commit());
  });

  it('rejects anonymous reads of private owner submissions', async () => {
    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'property_submissions/submission-3'), submissionData('submission-3', 'portfolio-3'));
    batch.set(doc(adminDb, 'public_portfolio/portfolio-3'), publicData('submission-3', 'portfolio-3'));
    await assertSucceeds(batch.commit());

    const visitorDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(visitorDb, 'property_submissions/submission-3')));
    const ordinaryUserDb = testEnv.authenticatedContext('ordinary-user').firestore();
    await assertFails(getDoc(doc(ordinaryUserDb, 'property_submissions/submission-3')));
  });

  it('allows only an admin to publish and then exposes only the sanitized public record', async () => {
    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    const batch = writeBatch(adminDb);
    batch.set(doc(adminDb, 'property_submissions/submission-4'), submissionData('submission-4', 'portfolio-4'));
    batch.set(doc(adminDb, 'public_portfolio/portfolio-4'), publicData('submission-4', 'portfolio-4'));
    await assertSucceeds(batch.commit());

    const ordinaryDb = testEnv.authenticatedContext('ordinary-user').firestore();
    await assertFails(updateDoc(doc(ordinaryDb, 'property_submissions/submission-4'), {
      submissionStatus: 'Published',
      reviewedBy: 'ordinary-user',
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }));

    const adminBatch = writeBatch(adminDb);
    adminBatch.update(doc(adminDb, 'property_submissions/submission-4'), {
      submissionStatus: 'Published',
      reviewedBy: 'admin@example.test',
      reviewedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    adminBatch.update(doc(adminDb, 'public_portfolio/portfolio-4'), {
      publicationStatus: 'Published',
      isPublished: true,
      isDeleted: false,
      updatedAt: serverTimestamp()
    });
    await assertSucceeds(adminBatch.commit());

    const visitorDb = testEnv.unauthenticatedContext().firestore();
    const visible = await assertSucceeds(getDoc(doc(visitorDb, 'public_portfolio/portfolio-4')));
    assert.equal(visible.data().publicationStatus, 'Published');
    assert.equal('ownerName' in visible.data(), false);
  });
});
