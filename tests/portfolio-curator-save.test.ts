import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Project, PublicPortfolioItem } from '../src/types';
import {
  buildPublicPortfolioCuratorUpdate,
  publicPortfolioToProject
} from '../src/lib/propertyWorkflow';

const existing = {
  id: 'curator-property-1',
  submissionId: 'submission-1',
  name: 'Original Property',
  location: 'Whitefield',
  category: 'Resale',
  propertyType: 'Apartment',
  societyType: 'Gated',
  formattedPrice: 'Rs. 1 Cr',
  propertyStatus: 'Ready to Move',
  possessionDate: '2026-01-01',
  configuration: '2 BHK',
  doorFacing: 'East',
  floorNumber: '10',
  towerNumber: 'A',
  totalAcres: '2',
  amenities: ['Gym'],
  furnishing: 'Semi Furnished',
  others: 'Original notes',
  mainImageUrl: '',
  imageUrls: [],
  publicationStatus: 'Approved',
  isPublished: false,
  isDeleted: false,
  createdAt: new Date('2026-01-01T00:00:00Z')
} as PublicPortfolioItem;

describe('Portfolio Curator public-listing edit/save mapping', () => {
  it('persists the editable Primary/Resale form fields and reloads them consistently', () => {
    const edited = {
      id: existing.id,
      sourceCollection: 'public_portfolio',
      name: 'Updated Property',
      description: 'Updated public description',
      price: 'Rs. 1.40 Cr',
      location: 'Sarjapur Road',
      locationTarget: 'Sarjapur Road',
      zone: 'Whitefield',
      type: 'Resale',
      propertyType: 'Villa',
      configuration: ['3 BHK'],
      segment: 'Verified Resale',
      imageUrls: [],
      features: ['Gym', 'Security'],
      societyType: 'Individual',
      possessionDate: '2027-06-01',
      handoverDate: '2027-06-01',
      handoverStatus: 'Under Construction',
      presentStatus: 'Under Construction',
      mainDoorFacing: 'North',
      furnishType: 'Furnished',
      saleFrom: 'Owner',
      projectTypeCategory: 'Individual'
    } as Project;

    const update = buildPublicPortfolioCuratorUpdate(edited, existing);
    assert.equal(update.propertyType, 'Villa');
    assert.equal(update.possessionDate, '2027-06-01');
    assert.equal(update.societyType, 'Individual');
    assert.equal(update.sellerType, 'Resale');
    assert.equal(update.furnishing, 'Furnished');
    assert.equal(update.propertyStatus, 'Under Construction');
    assert.equal(update.saleFrom, 'Owner');

    const reloaded = publicPortfolioToProject({ ...existing, ...update } as PublicPortfolioItem);
    assert.equal(reloaded.propertyType, 'Villa');
    assert.equal(reloaded.societyType, 'Individual');
    assert.equal(reloaded.possessionDate, '2027-06-01');
    assert.equal(reloaded.saleFrom, 'Owner');
    assert.equal(reloaded.furnishType, 'Full Furnished');
    assert.equal(reloaded.handoverStatus, 'Under Construction');
  });

  it('preserves Unfurnished and Semi Furnished selections', () => {
    const base = {
      id: existing.id,
      name: existing.name,
      description: '',
      price: existing.formattedPrice,
      location: existing.location,
      locationTarget: existing.location,
      zone: 'Whitefield',
      type: 'Resale',
      propertyType: 'Apartment',
      configuration: ['2 BHK'],
      segment: 'Verified Resale',
      imageUrls: [],
      features: [],
      furnishType: 'Unfurnished'
    } as Project;

    assert.equal(buildPublicPortfolioCuratorUpdate(base, existing).furnishing, 'Unfurnished');
    assert.equal(buildPublicPortfolioCuratorUpdate({ ...base, furnishType: 'Semi Furnished' }, existing).furnishing, 'Semi Furnished');
  });
});
