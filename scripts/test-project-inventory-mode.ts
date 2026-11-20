import assert from 'node:assert/strict';
import { getProjectInventoryModeDefaults, resolveProjectInventoryMode, transitionProjectInventoryMode } from '../src/lib/projectInventoryMode';

assert.equal(resolveProjectInventoryMode('Primary', 'Resale'), 'Primary');
assert.equal(resolveProjectInventoryMode('Primary Sale', 'Resale'), 'Primary');
assert.equal(resolveProjectInventoryMode('Resale', 'Primary'), 'Resale');
assert.equal(resolveProjectInventoryMode('Rental', 'Primary'), 'Rental');
assert.equal(resolveProjectInventoryMode(undefined, 'Resale'), 'Resale');
assert.deepEqual(getProjectInventoryModeDefaults('Resale'), { segment: 'Prime Resale', presentStatus: 'Ready to Move-IN', handoverStatus: 'Ready to Move' });
assert.deepEqual(getProjectInventoryModeDefaults('Rental'), { segment: 'Verified Rental', presentStatus: 'Ready to Move-IN', handoverStatus: 'Ready to Move' });
assert.deepEqual(transitionProjectInventoryMode({ type: 'Primary', segment: 'Luxury', presentStatus: 'Under Construction', handoverStatus: 'Under Construction' }, 'Primary', 'Resale'), { type: 'Resale', segment: 'Prime Resale', presentStatus: 'Ready to Move-IN', handoverStatus: 'Ready to Move' });
assert.deepEqual(transitionProjectInventoryMode({ segment: 'Custom Segment', presentStatus: 'Nearing Completion', handoverStatus: 'Nearing Completion' }, 'Primary', 'Resale'), { type: 'Resale', segment: 'Custom Segment', presentStatus: 'Nearing Completion', handoverStatus: 'Nearing Completion' });
assert.equal(transitionProjectInventoryMode({ price: '₹40,000/month', lastPrice: '₹40,000/month' }, 'Rental', 'Resale').price, '');
console.log('[PASS] Admin Vault Primary / Resale / Rental mode transitions.');
