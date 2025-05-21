import {
  DYApiConfig,
  DYChooseVariationsRequest,
  DYChooseVariationsResponse,
  DYTrackPageviewsRequest,
  DYTrackPageviewsResponse,
  DYTrackEngagementRequest,
  DYTrackEngagementResponse,
  DYSearchRequest,
  DYSearchResponse,
  DYTrackEventsRequest,
  DYTrackEventsResponse,
  DYUpdateProductFeedRequest,
  DYUpdateProductFeedResponse,
  DYTrackTransactionStatusSpecificItemResponse,
  DYTrackTransactionStatusWholeTransactionResponse,
  DYUpdateBranchFeedRequest,
  DYUpdateBranchFeedResponse,
  DYReportOutagesRequest,
  DYReportOutagesResponse,
  DYUserDataApiRequest,
  DYUserDataApiResponse,
  DYExternalEventsApiRequest,
  DYExternalEventsApiResponse,
  DYProfileAnywhereResponse,
} from "./types";

const US_BASE_URL = "https://dy-api.com";
const EU_BASE_URL = "https://dy-api.eu";

export class DynamicYieldClient {
  private config: DYApiConfig;
  private baseUrl: string;

  constructor(config: DYApiConfig) {
    const version = config.version ?? "v2";
    const dataCenter = config.dataCenter ?? "us";
    this.config = {
      ...config,
      version,
    };
    this.baseUrl =
      dataCenter === "eu"
        ? `${EU_BASE_URL}/${version}`
        : `${US_BASE_URL}/${version}`;
  }

  private getHeaders(contentType = true) {
    return {
      accept: "application/json",
      ...(contentType ? { "content-type": "application/json" } : {}),
      "dy-api-key": this.config.apiKey,
      ...(this.config.extraHeaders || {}),
    };
  }

  async chooseVariations(
    body: DYChooseVariationsRequest
  ): Promise<DYChooseVariationsResponse> {
    const response = await fetch(`${this.baseUrl}/serve/user/choose`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Choose Variations failed: ${response.status}`);
    return response.json();
  }

  async trackPageviews(
    body: DYTrackPageviewsRequest
  ): Promise<DYTrackPageviewsResponse> {
    const response = await fetch(`${this.baseUrl}/collect/user/pageview`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Track Pageviews failed: ${response.status}`);
    return response.json();
  }

  async trackEngagement(
    body: DYTrackEngagementRequest
  ): Promise<DYTrackEngagementResponse> {
    const response = await fetch(`${this.baseUrl}/collect/user/engagement`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Track Engagement failed: ${response.status}`);
    return response.json();
  }

  async search(body: DYSearchRequest): Promise<DYSearchResponse> {
    const response = await fetch(`${this.baseUrl}/serve/user/search`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error(`Search failed: ${response.status}`);
    return response.json();
  }

  async trackEvents(
    body: DYTrackEventsRequest
  ): Promise<DYTrackEventsResponse> {
    const response = await fetch(`${this.baseUrl}/collect/user/event`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Track Events failed: ${response.status}`);
    return response.json();
  }

  async updateProductFeed(
    feedId: string,
    body: DYUpdateProductFeedRequest
  ): Promise<DYUpdateProductFeedResponse> {
    const response = await fetch(`${this.baseUrl}/feeds/${feedId}/bulk`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Update Product Feed failed: ${response.status}`);
    return response.json();
  }

  async trackTransactionStatusSpecificItem(
    feedId: string,
    transactionId: string,
    itemId: string
  ): Promise<DYTrackTransactionStatusSpecificItemResponse> {
    const response = await fetch(
      `${this.baseUrl}/feeds/${feedId}/transaction/${transactionId}/item/${itemId}`,
      {
        method: "GET",
        headers: this.getHeaders(false),
      }
    );
    if (!response.ok)
      throw new Error(
        `Track Transaction Status (Specific Item) failed: ${response.status}`
      );
    return response.json();
  }

  async trackTransactionStatusWholeTransaction(
    feedId: string,
    transactionId: string
  ): Promise<DYTrackTransactionStatusWholeTransactionResponse> {
    const response = await fetch(
      `${this.baseUrl}/feeds/${feedId}/transaction/${transactionId}`,
      {
        method: "GET",
        headers: this.getHeaders(false),
      }
    );
    if (!response.ok)
      throw new Error(
        `Track Transaction Status (Whole Transaction) failed: ${response.status}`
      );
    return response.json();
  }

  async updateBranchFeed(
    branchId: string,
    body: DYUpdateBranchFeedRequest
  ): Promise<DYUpdateBranchFeedResponse> {
    const response = await fetch(
      `${this.baseUrl}/feeds/branch/${branchId}/inventory`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }
    );
    if (!response.ok)
      throw new Error(`Update Branch Feed failed: ${response.status}`);
    return response.json();
  }

  async reportOutages(
    body: DYReportOutagesRequest
  ): Promise<DYReportOutagesResponse> {
    const response = await fetch(`${this.baseUrl}/feeds/branch/outage/bulk`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`Report Outages failed: ${response.status}`);
    return response.json();
  }

  async userDataApi(
    feedKey: string,
    body: DYUserDataApiRequest
  ): Promise<DYUserDataApiResponse> {
    const response = await fetch(`${this.baseUrl}/userdata/${feedKey}/bulk`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`User Data API failed: ${response.status}`);
    return response.json();
  }

  async externalEventsApi(
    body: DYExternalEventsApiRequest
  ): Promise<DYExternalEventsApiResponse> {
    // NOTE: The endpoint for External Events API is assumed as '/collect/user/external'. Please verify with official documentation.
    const response = await fetch(`${this.baseUrl}/collect/user/external`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });
    if (!response.ok)
      throw new Error(`External Events API failed: ${response.status}`);
    return response.json();
  }

  async profileAnywhere(userId: string): Promise<DYProfileAnywhereResponse> {
    // NOTE: The endpoint for Profile Anywhere API is assumed as '/profile/anywhere/{userId}'. Please verify with official documentation.
    const response = await fetch(`${this.baseUrl}/profile/anywhere/${userId}`, {
      method: "GET",
      headers: this.getHeaders(false),
    });
    if (!response.ok)
      throw new Error(`Profile Anywhere failed: ${response.status}`);
    return response.json();
  }
}
