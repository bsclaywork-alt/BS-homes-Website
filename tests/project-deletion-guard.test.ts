import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { isProjectDeletionLocked } from '../src/lib/projectDeletionGuard';

describe('project deletion guard', () => {
  it('locks Firestore tombstones, archived and rejected records', () => {
    assert.equal(isProjectDeletionLocked({ isDeleted: true }), true);
    assert.equal(isProjectDeletionLocked({ publicationStatus: 'Archived' }), true);
    assert.equal(isProjectDeletionLocked({ publicationStatus: 'Rejected' }), true);
  });
  it('allows active and merely hidden records', () => {
    assert.equal(isProjectDeletionLocked({ isDeleted: false, publicationStatus: 'Published' }), false);
    assert.equal(isProjectDeletionLocked({ isDeleted: false, publicationStatus: 'Approved' }), false);
  });
  it('does not let an active cache override a server tombstone', () => {
    assert.equal(isProjectDeletionLocked({ isDeleted: false }, { isDeleted: true }), true);
  });
});
