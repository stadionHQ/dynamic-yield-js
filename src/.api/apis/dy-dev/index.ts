import type * as types from './types';
import type { ConfigOptions, FetchResponse } from 'api/dist/core'
import Oas from 'oas';
import APICore from 'api/dist/core';
import definition from './openapi.json';

class SDK {
  spec: Oas;
  core: APICore;

  constructor() {
    this.spec = Oas.init(definition);
    this.core = new APICore(this.spec, 'dy-dev/2.2 (api/6.1.3)');
  }

  /**
   * Optionally configure various options that the SDK allows.
   *
   * @param config Object of supported SDK options and toggles.
   * @param config.timeout Override the default `fetch` request timeout of 30 seconds. This number
   * should be represented in milliseconds.
   */
  config(config: ConfigOptions) {
    this.core.setConfig(config);
  }

  /**
   * If the API you're using requires authentication you can supply the required credentials
   * through this method and the library will magically determine how they should be used
   * within your API request.
   *
   * With the exception of OpenID and MutualTLS, it supports all forms of authentication
   * supported by the OpenAPI specification.
   *
   * @example <caption>HTTP Basic auth</caption>
   * sdk.auth('username', 'password');
   *
   * @example <caption>Bearer tokens (HTTP or OAuth 2)</caption>
   * sdk.auth('myBearerToken');
   *
   * @example <caption>API Keys</caption>
   * sdk.auth('myApiKey');
   *
   * @see {@link https://spec.openapis.org/oas/v3.0.3#fixed-fields-22}
   * @see {@link https://spec.openapis.org/oas/v3.1.0#fixed-fields-22}
   * @param values Your auth credentials for the API; can specify up to two strings or numbers.
   */
  auth(...values: string[] | number[]) {
    this.core.setAuth(...values);
    return this;
  }

  /**
   * If the API you're using offers alternate server URLs, and server variables, you can tell
   * the SDK which one to use with this method. To use it you can supply either one of the
   * server URLs that are contained within the OpenAPI definition (along with any server
   * variables), or you can pass it a fully qualified URL to use (that may or may not exist
   * within the OpenAPI definition).
   *
   * @example <caption>Server URL with server variables</caption>
   * sdk.server('https://{region}.api.example.com/{basePath}', {
   *   name: 'eu',
   *   basePath: 'v14',
   * });
   *
   * @example <caption>Fully qualified server URL</caption>
   * sdk.server('https://eu.api.example.com/v14');
   *
   * @param url Server URL
   * @param variables An object of variables to replace into the server URL.
   */
  server(url: string, variables = {}) {
    this.core.setServer(url, variables);
  }

  /**
   * Report a pageview without choosing variations for any campaigns.<br>This endpoint has
   * the same effect as calling `choose` with an empty `selector` argument.<br>If you are not
   * sure which server URL you should use, [see
   * here](https://support.dynamicyield.com/hc/en-us/articles/360017534877-Experience-API-Basics).
   *
   * @summary Track Pageviews
   * @throws FetchError<401, types.TrackPageviewsResponse401> Unauthorized request.
   * @throws FetchError<422, types.TrackPageviewsResponse422> Invalid request.
   */
  trackPageviews(body: types.TrackPageviewsBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/collect/user/pageview', 'post', body);
  }

  /**
   * Report user engagement (clicks) with a variation or a recommended item.<br>If you are
   * not sure which server URL you should use, [see
   * here](https://support.dynamicyield.com/hc/en-us/articles/360017534877-Experience-API-Basics).
   *
   * @summary Track Engagement
   * @throws FetchError<400, types.TrackEngagementResponse400> Invalid request.
   * @throws FetchError<401, types.TrackEngagementResponse401> Unauthorized request.
   * @throws FetchError<422, types.TrackEngagementResponse422> Invalid request.
   */
  trackEngagement(body: types.TrackEngagementBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/collect/user/engagement', 'post', body);
  }

  /**
   * Report a predefined or custom event.<br>If you are not sure which server URL you should
   * use, [see
   * here](https://support.dynamicyield.com/hc/en-us/articles/360017534877-Experience-API-Basics).
   *
   * @summary Track Events
   * @throws FetchError<400, types.TrackEventsResponse400> Invalid request.
   * @throws FetchError<401, types.TrackEventsResponse401> Unauthorized request.
   * @throws FetchError<422, types.TrackEventsResponse422> Invalid request.
   */
  trackEvents(body: types.TrackEventsBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/collect/user/event', 'post', body);
  }

  /**
   * Usually, a product feed is updated periodically. However, if you have a large number of
   * products in your feed, updates can take some time. To avoid this, you can use an API to
   * update only the changes in your feed (remove or add specific items, change item
   * properties, and so on), and make changes to the feed more quickly.<br>**Support site
   * article:** [Creating and Syncing a Product Feed Using
   * APIs](https://support.dynamicyield.com/hc/en-us/articles/360038581394-Product-Feeds)
   *
   * @summary Update Product Feed
   */
  updateProductFeed(body: types.UpdateProductFeedBodyParam, metadata: types.UpdateProductFeedMetadataParam): Promise<FetchResponse<200, types.UpdateProductFeedResponse200>> {
    return this.core.fetch('/feeds/{feedId}/bulk', 'post', body, metadata);
  }

  /**
   * Use this API to receive the status of an API call.<br>**Support site article:**
   * [Creating and Syncing a Product Feed Using
   * APIs](https://support.dynamicyield.com/hc/en-us/articles/360038581394-Product-Feeds)
   *
   * @summary Track Transaction Status - Specific Item
   */
  trackTransactionStatusSpecificItem(metadata: types.TrackTransactionStatusSpecificItemMetadataParam): Promise<FetchResponse<200, types.TrackTransactionStatusSpecificItemResponse200>> {
    return this.core.fetch('/feeds/{feedId}/transaction/{transactionId}/item/{itemId}', 'get', metadata);
  }

  /**
   * Use this API to receive the status of an API call.<br>**Support site article:**
   * [Creating and Syncing a Product Feed Using
   * APIs](https://support.dynamicyield.com/hc/en-us/articles/360038581394-Product-Feeds)
   *
   * @summary Track Transaction Status - Whole Transaction
   */
  trackTransactionStatusWholeTransaction(metadata: types.TrackTransactionStatusWholeTransactionMetadataParam): Promise<FetchResponse<200, types.TrackTransactionStatusWholeTransactionResponse200>> {
    return this.core.fetch('/feeds/{feedId}/transaction/{transactionId}', 'get', metadata);
  }

  /**
   * Update the branch level feed state.<br>**USE ONLY FOR RESTAURANT SECTIONS**
   *
   * @summary Update Branch Feed
   * @throws FetchError<400, types.UpdateBranchFeedResponse400> Invalid request.
   */
  updateBranchFeed(body: types.UpdateBranchFeedBodyParam, metadata: types.UpdateBranchFeedMetadataParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/feeds/branch/{id}/inventory', 'post', body, metadata);
  }

  /**
   * Report an outage of products in one or more stores.<br>**USE ONLY FOR RESTAURANT
   * SECTIONS**
   *
   * @summary Report Outages
   */
  reportOutages(body: types.ReportOutagesBodyParam): Promise<FetchResponse<number, unknown>> {
    return this.core.fetch('/feeds/branch/outage/bulk', 'post', body);
  }

  /**
   * The User Data API enables you to update your user data on demand, including partial
   * updates.<br>**Support site article:** [User Data
   * Feed](https://support.dynamicyield.com/hc/en-us/articles/4409595248017-Update-Your-User-Data-Feed-by-API-?_ga=2.258389066.1730957539.1709454788-192163951.1671449880#update-your-user-data-feed-by-api-0-0)
   *
   * @summary User Data API
   * @throws FetchError<400, types.UserDataApiResponse400> Response with error.
   */
  userDataApi(body: types.UserDataApiBodyParam, metadata: types.UserDataApiMetadataParam): Promise<FetchResponse<202, types.UserDataApiResponse202>> {
    return this.core.fetch('/userdata/{feedKey}/bulk', 'post', body, metadata);
  }

  /**
   * Track user interaction event using the user's `cuid`. Use in cases where the user's
   * `dyid` is unavailable (e.g. offline activity).
   *
   * @summary External Events
   * @throws FetchError<400, types.ExternalEventsResponse400> Response with error.
   */
  externalEvents(body: types.ExternalEventsBodyParam): Promise<FetchResponse<202, types.ExternalEventsResponse202>> {
    return this.core.fetch('/userdata/events', 'post', body);
  }

  /**
   * Retrieve user affinity data generated by Dynamic Yield, enabling you to offer enhanced
   * personalized experiences to your customers across all your touchpoints, both online and
   * offline.<br>**Note:** Rate limit is 50 calls per second.<br>**Support site article:**
   * [Profile
   * Anywhere](https://support.dynamicyield.com/hc/en-us/articles/8126598211229-Profile-Anywhere?_ga=2.9198581.1730957539.1709454788-192163951.1671449880)
   *
   * @summary Profile Anywhere
   */
  profileAnywhere(metadata: types.ProfileAnywhereMetadataParam): Promise<FetchResponse<200, types.ProfileAnywhereResponse200>> {
    return this.core.fetch('/userprofile', 'get', metadata);
  }
}

const createSDK = (() => { return new SDK(); })()
;

export default createSDK;

export type { ExternalEventsBodyParam, ExternalEventsResponse202, ExternalEventsResponse400, ProfileAnywhereMetadataParam, ProfileAnywhereResponse200, ReportOutagesBodyParam, TrackEngagementBodyParam, TrackEngagementResponse400, TrackEngagementResponse401, TrackEngagementResponse422, TrackEventsBodyParam, TrackEventsResponse400, TrackEventsResponse401, TrackEventsResponse422, TrackPageviewsBodyParam, TrackPageviewsResponse401, TrackPageviewsResponse422, TrackTransactionStatusSpecificItemMetadataParam, TrackTransactionStatusSpecificItemResponse200, TrackTransactionStatusWholeTransactionMetadataParam, TrackTransactionStatusWholeTransactionResponse200, UpdateBranchFeedBodyParam, UpdateBranchFeedMetadataParam, UpdateBranchFeedResponse400, UpdateProductFeedBodyParam, UpdateProductFeedMetadataParam, UpdateProductFeedResponse200, UserDataApiBodyParam, UserDataApiMetadataParam, UserDataApiResponse202, UserDataApiResponse400 } from './types';
