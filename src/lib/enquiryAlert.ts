export interface EnquiryAlertPayload {
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
}

/**
 * Dispatches an automated email lead notification directly to contact@bshomez.in
 * Safe and non-blocking: never prevents the user from submitting or viewing confirmation.
 */
export async function dispatchEnquiryEmailAlert(payload: EnquiryAlertPayload): Promise<{ success: boolean; delivered?: boolean; recipient?: string }> {
  try {
    const res = await fetch('/api/enquiry/alert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return {
      success: Boolean(data?.success),
      delivered: Boolean(data?.delivered),
      recipient: data?.recipient || 'contact@bshomez.in'
    };
  } catch (err) {
    console.warn('[Enquiry Email Alert] Non-blocking dispatch warning:', err);
    return { success: false, recipient: 'contact@bshomez.in' };
  }
}
