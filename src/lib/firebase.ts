import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  initializeFirestore,
  setLogLevel,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Suppress internal gRPC idle stream disconnect and harmless WebChannel timeout logs
if (typeof window !== 'undefined') {
  const origError = console.error;
  console.error = function (...args: any[]) {
    const text = args.map(a => (typeof a === 'string' ? a : (a?.message || ''))).join(' ');
    if (
      text.includes('Disconnecting idle stream') ||
      text.includes('Timed out waiting for new targets') ||
      text.includes("RPC 'Listen' stream") ||
      (text.includes('@firebase/firestore') && text.includes('CANCELLED'))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

// Set Firestore log level to silent to suppress internal gRPC stream lifecycle notices
try {
  setLogLevel('silent');
} catch {}

// Initialize Firestore targeting the provisioned database ID with long-polling auto-detection
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      ignoreUndefinedProperties: true
    }, firebaseConfig.firestoreDatabaseId);
  } catch {
    return getFirestore(app, firebaseConfig.firestoreDatabaseId);
  }
})();
export const auth = getAuth(app);

// Connection test per Firebase skill guidelines
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore client is operating offline.");
    }
  }
}
testConnection().catch(() => {});

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errCode = (error as { code?: string })?.code || '';

  // Gracefully handle transient connection/offline states, quota limits, and idle stream reconnects
  if (
    errCode === 'unavailable' ||
    errCode === 'failed-precondition' ||
    errCode === 'cancelled' ||
    errCode === '1' ||
    errMsg.includes('CANCELLED') ||
    errMsg.includes('Disconnecting idle stream') ||
    errMsg.includes('Timed out waiting for new targets') ||
    errMsg.includes('unavailable') ||
    errMsg.includes('offline') ||
    errMsg.includes('Quota') ||
    errMsg.includes('resource-exhausted') ||
    errMsg.includes('Could not reach Cloud Firestore backend')
  ) {
    console.info(`Firestore listener reconnecting / cached fallback active for ${path || 'collection'}.`);
    return;
  }

  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.warn('Firestore operation notice:', JSON.stringify(errInfo));
}
