import { readFile } from 'node:fs/promises';
import { after, before, beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails
} from '@firebase/rules-unit-testing';
import { doc, getDoc, serverTimestamp, setDoc, writeBatch, updateDoc, deleteDoc } from 'firebase/firestore';

const projectId = 'demo-bshomez-rules-test';
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

  it('rejects invalid sale pricing and unexpected private submission fields', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const submission = submissionData('submission-invalid', 'portfolio-invalid');
    submission.expectedPrice = -1;
    submission.unexpectedAdminFlag = true;
    const batch = writeBatch(db);
    batch.set(doc(db, 'property_submissions/submission-invalid'), submission);
    batch.set(doc(db, 'public_portfolio/portfolio-invalid'), publicData('submission-invalid', 'portfolio-invalid'));
    await assertFails(batch.commit());
  });

  it('allows a valid rental submission with rent-specific fields', async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    const submission = submissionData('submission-rental', 'portfolio-rental');
    delete submission.sellerType;
    delete submission.expectedPrice;
    submission.willingTo = 'Rental';
    submission.targetCategory = 'Rental';
    submission.rentPerMonth = 45000;
    submission.maintenance = '3000';
    submission.advance = '180000';
    submission.availableFrom = '2026-12-01';
    const portfolio = publicData('submission-rental', 'portfolio-rental');
    portfolio.category = 'Rental';
    portfolio.formattedPrice = 'Rs. 45K/mo';
    portfolio.publicationStatus = 'Pending Review';
    const batch = writeBatch(db);
    batch.set(doc(db, 'property_submissions/submission-rental'), submission);
    batch.set(doc(db, 'public_portfolio/portfolio-rental'), portfolio);
    await assertSucceeds(batch.commit());
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

  it('allows admin curator edits, hide and archive while rejecting non-admin and private-field updates', async () => {
    const publicDb = testEnv.unauthenticatedContext().firestore();
    const batch = writeBatch(publicDb);
    batch.set(doc(publicDb, 'property_submissions/curator-submission'), submissionData('curator-submission', 'curator-portfolio'));
    batch.set(doc(publicDb, 'public_portfolio/curator-portfolio'), publicData('curator-submission', 'curator-portfolio'));
    await assertSucceeds(batch.commit());

    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    const portfolioRef = doc(adminDb, 'public_portfolio/curator-portfolio');
    await assertSucceeds(updateDoc(portfolioRef, {
      name: 'Curated Property Name',
      location: 'Sarjapur Road',
      category: 'Primary',
      formattedPrice: 'Rs. 1.40 Cr*',
      expectedPrice: 14000000,
      projectWriteUps: 'Admin-approved public description',
      updatedAt: serverTimestamp()
    }));

    const ordinaryDb = testEnv.authenticatedContext('ordinary-user').firestore();
    await assertFails(updateDoc(doc(ordinaryDb, 'public_portfolio/curator-portfolio'), {
      name: 'Unauthorized Edit',
      updatedAt: serverTimestamp()
    }));
    await assertFails(updateDoc(portfolioRef, {
      ownerMobile: '9876543210',
      updatedAt: serverTimestamp()
    }));

    await assertSucceeds(updateDoc(portfolioRef, {
      publicationStatus: 'Approved',
      isPublished: false,
      isDeleted: false,
      updatedAt: serverTimestamp()
    }));
    await assertSucceeds(updateDoc(portfolioRef, {
      publicationStatus: 'Archived',
      isPublished: false,
      isDeleted: true,
      updatedAt: serverTimestamp()
    }));

    const visitorDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(visitorDb, 'public_portfolio/curator-portfolio')));
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

  it('restricts project inventory creation and mutation to admins and denies hard deletes', async () => {
    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    const projectRef = doc(adminDb, 'projects/security-project');
    await assertSucceeds(setDoc(projectRef, {
      name: 'Security Test Project',
      location: 'Whitefield',
      type: 'Primary',
      price: 'Rs. 1 Cr'
    }));

    const visitorDb = testEnv.unauthenticatedContext().firestore();
    await assertFails(setDoc(doc(visitorDb, 'projects/visitor-project'), {
      name: 'Visitor Project',
      location: 'Whitefield',
      type: 'Primary',
      price: 'Rs. 1 Cr'
    }));
    await assertFails(updateDoc(doc(visitorDb, 'projects/security-project'), {
      price: 'Rs. 2 Cr'
    }));
    await assertFails(deleteDoc(doc(visitorDb, 'projects/security-project')));

    const ordinaryDb = testEnv.authenticatedContext('ordinary-user').firestore();
    await assertFails(updateDoc(doc(ordinaryDb, 'projects/security-project'), {
      price: 'Rs. 2 Cr'
    }));
    await assertFails(deleteDoc(doc(ordinaryDb, 'projects/security-project')));

    await assertSucceeds(updateDoc(projectRef, { price: 'Rs. 1.1 Cr' }));
    await assertSucceeds(updateDoc(projectRef, {
      isDeleted: true,
      updatedAt: serverTimestamp()
    }));
    const archivedProject = await assertSucceeds(getDoc(projectRef));
    assert.equal(archivedProject.data().isDeleted, true);
    await assertFails(deleteDoc(projectRef));

    // Public-portfolio archives also write a minimal, durable projects tombstone.
    // This shape must pass create validation without relying on legacy display fields.
    const tombstoneRef = doc(adminDb, 'projects/public-portfolio-archive-marker');
    await assertSucceeds(setDoc(tombstoneRef, {
      id: 'public-portfolio-archive-marker',
      name: 'Archived Public Listing',
      location: 'Whitefield',
      type: 'Primary',
      price: 'Contact for price',
      isDeleted: true,
      isPaused: true,
      updatedAt: serverTimestamp()
    }));
    const tombstone = await assertSucceeds(getDoc(tombstoneRef));
    assert.equal(tombstone.data().isDeleted, true);
  });

  it('allows public lead creation but restricts lead reads and management to admins', async () => {
    const visitorDb = testEnv.unauthenticatedContext().firestore();
    const enquiryRef = doc(visitorDb, 'enquiries/security-enquiry');
    const opportunityRef = doc(visitorDb, 'opportunities/security-opportunity');
    const subscriptionRef = doc(visitorDb, 'subscriptions/security-subscription');
    const referralRef = doc(visitorDb, 'referrals/security-referral');

    const adminDb = testEnv.authenticatedContext('admin-user', { admin: true }).firestore();
    await assertSucceeds(setDoc(doc(adminDb, 'projects/security-subscription-project'), {
      name: 'Subscription Test Project',
      location: 'Whitefield',
      type: 'Primary',
      price: 'Rs. 1 Cr'
    }));

    await assertSucceeds(setDoc(enquiryRef, {
      customerName: 'Test Customer',
      customerPhone: '9876543210',
      projectName: 'Security Test Project',
      projectId: 'security-project',
      type: 'Form'
    }));
    await assertSucceeds(setDoc(opportunityRef, {
      name: 'Test Business',
      mobile: '9876543210',
      category: 'Business'
    }));
    await assertSucceeds(setDoc(subscriptionRef, {
      email: 'test@example.com',
      projectId: 'security-subscription-project',
      projectName: 'Subscription Test Project',
      createdAt: serverTimestamp()
    }));
    await assertSucceeds(setDoc(referralRef, {
      name: 'Test Referrer',
      mobileNumber: '9876543210',
      budget: '1 Cr',
      location: 'Whitefield',
      propertyType: 'Villa',
      unitType: '3BHK',
      contactDateTime: '2026-11-24',
      whatsappNumber: '9876543210',
      lookingFor: 'New Building'
    }));

    const ordinaryDb = testEnv.authenticatedContext('ordinary-user').firestore();
    const visitorRefs = [
      doc(ordinaryDb, 'enquiries/security-enquiry'),
      doc(ordinaryDb, 'opportunities/security-opportunity'),
      doc(ordinaryDb, 'subscriptions/security-subscription'),
      doc(ordinaryDb, 'referrals/security-referral')
    ];
    for (const ref of visitorRefs) {
      await assertFails(getDoc(ref));
      await assertFails(updateDoc(ref, { unauthorizedChange: true }));
      await assertFails(deleteDoc(ref));
    }

    const adminRefs = [
      doc(adminDb, 'enquiries/security-enquiry'),
      doc(adminDb, 'opportunities/security-opportunity'),
      doc(adminDb, 'subscriptions/security-subscription'),
      doc(adminDb, 'referrals/security-referral')
    ];
    for (const ref of adminRefs) {
      await assertSucceeds(getDoc(ref));
      await assertSucceeds(updateDoc(ref, { adminReviewed: true }));
      await assertSucceeds(deleteDoc(ref));
    }
  });

});
