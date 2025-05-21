// Common config for all API calls
export interface DYApiConfig {
  apiKey: string;
  version?: "v2";
  dataCenter?: "us" | "eu";
  extraHeaders?: Record<string, string>;
}

// Choose Variations (POST /v2/serve/user/choose)
export interface DYChooseVariationsRequest {
  user: Record<string, any>;
  context: Record<string, any>;
  selector?: any;
  options?: any;
}
export type DYChooseVariationsResponse = any;

// Track Pageviews (POST /v2/collect/user/pageview)
export interface DYTrackPageviewsRequest {
  user: Record<string, any>;
  context: Record<string, any>;
}
export type DYTrackPageviewsResponse = any;

// Track Engagement (POST /v2/collect/user/engagement)
export interface DYTrackEngagementRequest {
  user: Record<string, any>;
  context: Record<string, any>;
  engagement: Record<string, any>;
}
export type DYTrackEngagementResponse = any;

// Search (POST /v2/serve/user/search)
export interface DYSearchRequest {
  user: Record<string, any>;
  context: Record<string, any>;
  search: Record<string, any>;
}
export type DYSearchResponse = any;

// Track Events (POST /v2/collect/user/event)
export interface DYTrackEventsRequest {
  user: Record<string, any>;
  context: Record<string, any>;
  event: Record<string, any>;
}
export type DYTrackEventsResponse = any;

// Update Product Feed (POST /v2/feeds/{feedId}/bulk)
export interface DYUpdateProductFeedRequest {
  items: any[];
}
export type DYUpdateProductFeedResponse = any;

// Track Transaction Status - Specific Item (GET /v2/feeds/{feedId}/transaction/{transactionId}/item/{itemId})
export type DYTrackTransactionStatusSpecificItemResponse = any;

// Track Transaction Status - Whole Transaction (GET /v2/feeds/{feedId}/transaction/{transactionId})
export type DYTrackTransactionStatusWholeTransactionResponse = any;

// Update Branch Feed (POST /v2/feeds/branch/{id}/inventory)
export interface DYUpdateBranchFeedRequest {
  inventory: any[];
}
export type DYUpdateBranchFeedResponse = any;

// Report Outages (POST /v2/feeds/branch/outage/bulk)
export interface DYReportOutagesRequest {
  outages: any[];
}
export type DYReportOutagesResponse = any;

// User Data API (POST /v2/userdata/{feedKey}/bulk)
export interface DYUserDataApiRequest {
  users: any[];
}
export type DYUserDataApiResponse = any;

// External Events API (POST /v2/collect/user/external)
export interface DYExternalEventsApiRequest {
  events: any[];
}
export type DYExternalEventsApiResponse = any;

// Profile Anywhere (GET /v2/profile/anywhere/{userId})
export type DYProfileAnywhereResponse = any;
