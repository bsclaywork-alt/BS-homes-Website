import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, writeBatch } from 'firebase/firestore';
import { CheckCircle2, Clock, Loader2, RefreshCw, XCircle } from 'lucide-react';
import { auth, db } from '../lib/firebase';
import { PropertySubmission, SubmissionWorkflowStatus } from '../types';
import { buildSanitizedPublicPortfolioRecord } from '../lib/propertyWorkflow';

export const AdminPropertySubmissions: React.FC = () => {
  const [items, setItems] = useState<PropertySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    let cancelled = false;
    const start = async () => {
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('Please sign in with your Admin Vault account.');
        const token = await user.getIdTokenResult(true);
        if (token.claims.admin !== true) throw new Error('Admin authorization is required to view private property submissions.');
        if (cancelled) return;
        setAuthorized(true);
        const q = query(collection(db, 'property_submissions'), orderBy('createdAt', 'desc'));
        unsubscribe = onSnapshot(q, snapshot => {
          setItems(snapshot.docs.map(item => ({ ...item.data(), id: item.id } as PropertySubmission)));
          setLoading(false);
          setError('');
        }, err => {
          setLoading(false);
          setError(err.message || 'Unable to load property submissions. Check Firestore admin rules.');
        });
      } catch (err: any) {
        if (!cancelled) {
          setLoading(false);
          setError(err?.message || 'Admin authorization failed.');
        }
      }
    };
    void start();
    return () => { cancelled = true; unsubscribe?.(); };
  }, []);

  const changeStatus = async (item: PropertySubmission, status: SubmissionWorkflowStatus) => {
    if (!item.id || !item.publicPortfolioId || busyId) return;
    setBusyId(item.id);
    setError('');
    try {
      const batch = writeBatch(db);
      const submissionRef = doc(db, 'property_submissions', item.id);
      const publicRef = doc(db, 'public_portfolio', item.publicPortfolioId);
      const now = serverTimestamp();
      batch.update(submissionRef, {
        submissionStatus: status,
        reviewedBy: auth.currentUser?.email || auth.currentUser?.uid || 'Admin',
        reviewedAt: now,
        updatedAt: now
      });
      const publicRecord = buildSanitizedPublicPortfolioRecord(item, { publicationStatus: status });
      publicRecord.isPublished = status === 'Published';
      publicRecord.isDeleted = status === 'Rejected' || status === 'Archived' || Boolean(item.isDeleted);
      publicRecord.updatedAt = now;
      batch.set(publicRef, publicRecord, { merge: true });
      await batch.commit();
    } catch (err: any) {
      setError(err?.message || 'Unable to update this submission. No changes were confirmed.');
    } finally {
      setBusyId(null);
    }
  };

  if (!authorized && loading) return <div className="p-6 text-white/60 text-sm">Verifying Admin Vault access…</div>;

  return (
    <section className="space-y-5 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-white/5 p-5">
        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-art-gold font-bold">Private owner intake</p>
          <h3 className="text-xl font-serif">Offer Your Asset — Review Queue</h3>
          <p className="text-xs text-white/50 mt-1">Owner contact details and full address are visible only in this authenticated Admin Vault queue.</p>
        </div>
        <span className="text-xs font-mono text-white/60">{items.filter(x => x.submissionStatus === 'Pending Review').length} pending review</span>
      </div>
      {error && <div role="alert" className="p-3 border border-red-500/40 bg-red-500/10 text-red-200 text-xs">{error}</div>}
      {loading ? <div className="p-8 text-center text-white/50"><Loader2 className="animate-spin inline mr-2" size={16}/>Loading private submissions…</div> :
        items.length === 0 ? <div className="p-8 border border-white/10 text-center text-white/50 text-sm">No property submissions found.</div> :
        <div className="space-y-4">
          {items.map(item => {
            const pending = item.submissionStatus === 'Pending Review';
            return <article key={item.id} className="border border-white/10 bg-[#111] p-5 space-y-4">
              <div className="flex flex-wrap justify-between gap-3">
                <div>
                  <h4 className="text-lg font-serif text-white">{item.propertyName || 'Property submission'}</h4>
                  <p className="text-xs text-white/50">{item.location} · {item.willingTo} · {item.targetCategory}</p>
                </div>
                <span className="h-fit text-[10px] uppercase tracking-wider border border-art-gold/30 bg-art-gold/10 text-art-gold px-2 py-1">{item.submissionStatus}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                <div><span className="text-white/40 block">Owner Name</span>{item.ownerName || 'Not provided'}</div>
                <div><span className="text-white/40 block">Owner Mobile</span>{item.ownerCountryCode || '+91'} {item.ownerMobile || 'Not provided'}</div>
                <div><span className="text-white/40 block">Full Address (Private)</span>{item.fullAddress || 'Not provided'}</div>
                <div><span className="text-white/40 block">Property Type / Society</span>{item.propertyType} / {item.societyType}</div>
                <div><span className="text-white/40 block">Expected Price / Rent</span>{item.willingTo === 'Rental' ? item.rentPerMonth ?? 'Not provided' : item.expectedPrice ?? 'Not provided'}</div>
                <div><span className="text-white/40 block">RERA Number</span><strong className="text-art-gold">{item.reraNumber || 'Not provided'}</strong></div>
                <div><span className="text-white/40 block">Configuration / Facing</span>{item.configuration} / {item.doorFacing}</div>
                <div><span className="text-white/40 block">Floor / Tower</span>{[item.floorNumber, item.towerNumber].filter(Boolean).join(' / ') || 'Not provided'}</div>
                <div><span className="text-white/40 block">Status / Possession</span>{item.propertyStatus} / {item.possessionDate || 'Not provided'}</div>
                <div><span className="text-white/40 block">Furnishing / Available From</span>{item.furnishing} / {item.availableFrom || 'Not provided'}</div>
                <div><span className="text-white/40 block">Maintenance / Advance</span>{item.maintenance || 'Not provided'} / {item.advance || 'Not provided'}</div>
                <div><span className="text-white/40 block">Total Acres</span>{item.totalAcres || 'Not provided'}</div>
              </div>
              <div className="text-xs"><span className="text-white/40 block">Amenities</span>{item.amenities?.join(', ') || 'Not provided'}</div>
              <div className="text-xs"><span className="text-white/40 block">Others</span>{item.others || 'Not provided'}</div>
              {item.googleMapUrl && <a className="text-xs text-art-gold underline break-all" href={item.googleMapUrl} target="_blank" rel="noreferrer">Open Google Map URL</a>}
              <div className="flex flex-wrap gap-2 border-t border-white/10 pt-3">
                {pending && <>
                  <button type="button" disabled={busyId === item.id} onClick={() => void changeStatus(item, 'Published')} className="px-4 py-2 bg-emerald-600 text-white text-[10px] uppercase font-bold disabled:opacity-50"><CheckCircle2 size={13} className="inline mr-1"/>Approve & Publish</button>
                  <button type="button" disabled={busyId === item.id} onClick={() => void changeStatus(item, 'Rejected')} className="px-4 py-2 bg-red-950 border border-red-500/40 text-red-200 text-[10px] uppercase font-bold disabled:opacity-50"><XCircle size={13} className="inline mr-1"/>Reject</button>
                </>}
                {item.submissionStatus === 'Published' && <span className="text-xs text-emerald-300"><CheckCircle2 size={13} className="inline mr-1"/>Published to public portfolio</span>}
                {busyId === item.id && <span className="text-xs text-white/50"><RefreshCw size={13} className="inline animate-spin mr-1"/>Saving…</span>}
                {!pending && item.submissionStatus !== 'Published' && <span className="text-xs text-white/40"><Clock size={13} className="inline mr-1"/>No pending action</span>}
              </div>
            </article>;
          })}
        </div>}
    </section>
  );
};
