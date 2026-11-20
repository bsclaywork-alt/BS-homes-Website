export interface EnquiryAlertPayload {
  collectionName?: 'enquiries' | 'opportunities' | 'property_submissions' | 'referrals' | 'subscriptions';
  customerName?: string;
  name?: string;
  customerPhone?: string;
  phone?: string;
  mobile?: string;
  customerEmail?: string;
  email?: string;
  projectName?: string;
  interestedProjects?: string;
  enquiryCategory?: string;
  category?: string;
  propertyCategory?: string;
  preferredLocation?: string;
  location?: string;
  message?: string;
  type?: string;
  source?: string;
  [key: string]: unknown;
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: Record<string, unknown>) => string;
      execute: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

async function loadTurnstile(): Promise<void> {
  if (window.turnstile) return;
  if (!turnstileScriptPromise) {
    turnstileScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-bshomez-turnstile]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(new Error('Turnstile could not load.')), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset.bshomezTurnstile = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Turnstile could not load.'));
      document.head.appendChild(script);
    }).catch((error) => {
      turnstileScriptPromise = null;
      throw error;
    });
  }
  await turnstileScriptPromise;
  if (!window.turnstile) throw new Error('Turnstile is unavailable.');
}

async function getTurnstileToken(siteKey: string): Promise<string> {
  await loadTurnstile();
  return new Promise((resolve, reject) => {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-10000px';
    container.style.top = '0';
    document.body.appendChild(container);
    let widgetId = '';
    let settled = false;
    const finish = (token?: string, error?: Error) => {
      if (settled) return;
      settled = true;
      if (widgetId) window.turnstile?.remove(widgetId);
      container.remove();
      if (token) resolve(token);
      else reject(error || new Error('Security verification failed. Please try again.'));
    };
    try {
      widgetId = window.turnstile!.render(container, {
        sitekey: siteKey,
        size: 'invisible',
        execution: 'execute',
        callback: (token: string) => finish(token),
        'error-callback': () => finish(undefined, new Error('Security verification failed. Please retry.')),
        'expired-callback': () => finish(undefined, new Error('Security verification expired. Please retry.')),
        'timeout-callback': () => finish(undefined, new Error('Security verification timed out. Please retry.'))
      });
      window.turnstile!.execute(widgetId);
    } catch (error) {
      finish(undefined, error instanceof Error ? error : new Error('Security verification failed.'));
    }
  });
}

/**
 * Sends a non-blocking email alert after the corresponding Firestore write succeeds.
 * Resend and Turnstile secrets remain on the Cloudflare Worker, never in browser code.
 */
export async function dispatchEnquiryEmailAlert(
  payload: EnquiryAlertPayload
): Promise<{ success: boolean; delivered?: boolean; recipient?: string }> {
  try {
    const workerUrl = import.meta.env.VITE_EMAIL_ALERT_WORKER_URL;
    const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;
    if (!workerUrl || !siteKey) {
      console.info('[BS Homez email alert] Worker configuration is not set; Firestore submission remains saved.');
      return { success: false, recipient: 'contact@bshomez.in' };
    }
    const collectionName = payload.collectionName ||
      (payload.type === 'Business Opportunity' || payload.enquiryCategory === 'Opportunity' ? 'opportunities' : 'enquiries');
    const turnstileToken = await getTurnstileToken(siteKey);
    const { collectionName: _collectionName, ...emailPayload } = payload;
    const res = await fetch(workerUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        collection: collectionName,
        eventId: crypto.randomUUID(),
        payload: emailPayload,
        turnstileToken
      })
    });
    const data = await res.json().catch(() => ({}));
    return {
      success: Boolean(data?.success),
      delivered: Boolean(data?.delivered),
      recipient: 'contact@bshomez.in'
    };
  } catch (err) {
    console.warn('[BS Homez email alert] Non-blocking dispatch warning:', err);
    return { success: false, recipient: 'contact@bshomez.in' };
  }
}
