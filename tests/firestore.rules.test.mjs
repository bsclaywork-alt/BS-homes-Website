import { readFileSync } from 'node:fs';
import { after, before, test } from 'node:test';
import {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';

const projectId = 'demo-bshomez-firestore-security';
let env;
const rules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');

before(async () => {
  env = await initializeTestEnvironment({
    projectId,
    firestore: { rules },
  });
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'projects', 'seed_project'), {
      name: 'Seed Property', location: 'Whitefield, Bengaluru', type: 'Primary', price: '₹1 Cr',
    });
  });
});

after(async () => {
  await env.cleanup();
});

const projectData = {
  name: 'Test Property', location: 'Whitefield, Bengaluru', type: 'Primary', price: '₹1.2 Cr',
};

test('public users can read the public project catalogue', async () => {
  await assertSucceeds(getDoc(doc(env.unauthenticatedContext().firestore(), 'projects', 'seed_project')));
});

test('unauthenticated and ordinary signed-in users cannot create, update or delete projects', async () => {
  const anon = env.unauthenticatedContext().firestore();
  const member = env.authenticatedContext('member-1').firestore();
  await assertFails(setDoc(doc(anon, 'projects', 'anon_project'), projectData));
  await assertFails(updateDoc(doc(anon, 'projects', 'seed_project'), { price: '₹2 Cr' }));
  await assertFails(deleteDoc(doc(anon, 'projects', 'seed_project')));
  await assertFails(setDoc(doc(member, 'projects', 'member_project'), projectData));
  await assertFails(updateDoc(doc(member, 'projects', 'seed_project'), { price: '₹2 Cr' }));
  await assertFails(deleteDoc(doc(member, 'projects', 'seed_project')));
});

test('admin custom claim permits valid project create, update and delete', async () => {
  const db = env.authenticatedContext('admin-1', { admin: true }).firestore();
  await assertSucceeds(setDoc(doc(db, 'projects', 'admin_project'), projectData));
  await assertSucceeds(updateDoc(doc(db, 'projects', 'admin_project'), { price: '₹1.3 Cr' }));
  await assertSucceeds(deleteDoc(doc(db, 'projects', 'admin_project')));
});

test('public enquiry and opportunity form submissions remain available', async () => {
  const db = env.unauthenticatedContext().firestore();
  await assertSucceeds(setDoc(doc(db, 'enquiries', 'public_enquiry'), {
    customerName: 'Test Customer', customerPhone: '9876543210',
    projectName: 'Seed Property', projectId: 'seed_project', type: 'Form',
  }));
  await assertSucceeds(setDoc(doc(db, 'opportunities', 'public_opportunity'), {
    name: 'Property Owner', mobile: '9876543210', email: 'owner@example.com',
    interested: 'Sell property', services: ['Resale'], comment: 'Please call',
    category: 'Opportunity',
  }));
});

test('non-admin users cannot read lead records; admin claim can read them', async () => {
  const member = env.authenticatedContext('member-2').firestore();
  const admin = env.authenticatedContext('admin-2', { admin: true }).firestore();
  await assertFails(getDoc(doc(member, 'enquiries', 'public_enquiry')));
  await assertSucceeds(getDoc(doc(admin, 'enquiries', 'public_enquiry')));
});
