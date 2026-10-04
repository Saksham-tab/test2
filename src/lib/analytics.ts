export type AnalyticsEvent =
  | 'page_view'
  | 'product_view'
  | 'search'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'buy_now'
  | 'checkout_started'
  | 'purchase'
  | 'wishlist_added'
  | 'ai_guide_opened'
  | 'ai_recommendation_generated'
  | 'ai_recommendation_clicked'
  | 'chatbot_opened'
  | 'chatbot_message_sent';

export interface AnalyticsPayload {
  [key: string]: unknown;
}

class AnalyticsService {
  private isDevelopment = true;

  track(event: AnalyticsEvent, payload?: AnalyticsPayload) {
    if (this.isDevelopment && typeof window !== 'undefined') {
      // In dev mode, emit clean structured telemetry for transparency
      // eslint-disable-next-line no-console
      console.debug(`[Analytics: ${event}]`, payload ?? {});
    }

    // Extensible: external analytics provider (GA4, Mixpanel, Segment) plugs in here
    // without altering any UI component.
    if (typeof window !== 'undefined' && (window as unknown as { customAnalyticsDispatch?: (e: string, p?: unknown) => void }).customAnalyticsDispatch) {
      (window as unknown as { customAnalyticsDispatch: (e: string, p?: unknown) => void }).customAnalyticsDispatch(event, payload);
    }
  }
}

export const analytics = new AnalyticsService();
