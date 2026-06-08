export interface TrackingData {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landingPage: string;
}

export interface SessionInitRequest extends TrackingData {
  visitorId?: string;
  sessionId?: string;
}

export interface SessionInitResponse {
  visitorId: string;
  sessionId: string;
}

export interface ContactSubmitRequest {
  name: string;
  email: string;
  message: string;
}

export interface ContactSubmitResponse {
  success: boolean;
  message: string;
}

export interface ReferrerStat {
  source: string;
  count: number;
}

export interface DashboardStats {
  totalVisitors: number;
  totalSessions: number;
  totalSubmissions: number;
  sources: ReferrerStat[];
}
