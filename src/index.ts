import merge from "lodash.merge";
import ServeSDK, {
  ChooseVariationsBodyParam,
  SearchBodyParam,
} from "./.api/apis/dy-dev-serve";
import SDK, {
  ExternalEventsBodyParam,
  ProfileAnywhereMetadataParam,
  ReportOutagesBodyParam,
  TrackEngagementBodyParam,
  TrackEventsBodyParam,
  TrackPageviewsBodyParam,
  TrackTransactionStatusSpecificItemMetadataParam,
  TrackTransactionStatusWholeTransactionMetadataParam,
  UpdateBranchFeedBodyParam,
  UpdateBranchFeedMetadataParam,
  UpdateProductFeedBodyParam,
  UpdateProductFeedMetadataParam,
  UserDataApiBodyParam,
  UserDataApiMetadataParam,
} from "./.api/apis/dy-dev";

export type DyTypeWithOptionalSessionAndUser<T> = Omit<
  T,
  "session" | "user"
> & {
  session?: {
    id: string;
  };
  user?: {
    dyid: string;
    sharedDevice: boolean;
  };
};

export type DyTypeWithRequiredSessionAndUser<T> = T & {
  session: {
    id: string;
  };
  user: {
    dyid: string;
    sharedDevice: boolean;
  };
};

export class DynamicYieldClient {
  private serveSdk: typeof ServeSDK;
  private defaultSdk: typeof SDK;
  private sessionId: string | null;
  private userDyid: string | null;

  constructor(config: { apiKey: string; dataCenter: "us" | "eu" }) {
    const dataCenter = config.dataCenter ?? "us";
    this.serveSdk = ServeSDK.auth(config.apiKey);
    this.defaultSdk = SDK.auth(config.apiKey);
    this.serveSdk.server(
      dataCenter === "eu" ? "https://dy-api.eu/v2" : "https://dy-api.com/v2"
    );
    this.defaultSdk.server(
      dataCenter === "eu" ? "https://dy-api.eu/v2" : "https://dy-api.com/v2"
    );
    this.sessionId = null;
    this.userDyid = null;
  }

  setSessionAndUserDyId(sessionId: string, userDyId: string) {
    this.sessionId = sessionId;
    this.userDyid = userDyId;
  }

  private setBody<T>(
    body: DyTypeWithOptionalSessionAndUser<T>
  ): DyTypeWithRequiredSessionAndUser<T> {
    if (!this.sessionId || !this.userDyid) {
      throw new Error("Session ID and User DY ID are required");
    }
    return merge(body, {
      session: {
        id: this.sessionId,
      },
      user: {
        dyid: this.userDyid,
        sharedDevice: false,
      },
    }) as DyTypeWithRequiredSessionAndUser<T>;
  }

  async chooseVariations(
    body: DyTypeWithOptionalSessionAndUser<ChooseVariationsBodyParam>
  ): ReturnType<typeof ServeSDK.chooseVariations> {
    return this.serveSdk.chooseVariations(this.setBody(body));
  }

  async trackPageviews(
    body: DyTypeWithOptionalSessionAndUser<TrackPageviewsBodyParam>
  ): ReturnType<typeof SDK.trackPageviews> {
    return this.defaultSdk.trackPageviews(this.setBody(body));
  }

  async trackEngagement(
    body: DyTypeWithOptionalSessionAndUser<TrackEngagementBodyParam>
  ): ReturnType<typeof SDK.trackEngagement> {
    return this.defaultSdk.trackEngagement(this.setBody(body));
  }

  async search(
    body: DyTypeWithOptionalSessionAndUser<SearchBodyParam>
  ): ReturnType<typeof ServeSDK.search> {
    return this.serveSdk.search(this.setBody(body));
  }

  async trackEvents(
    body: DyTypeWithOptionalSessionAndUser<TrackEventsBodyParam>
  ): ReturnType<typeof SDK.trackEvents> {
    return this.defaultSdk.trackEvents(this.setBody(body));
  }

  async updateProductFeed(
    params: UpdateProductFeedBodyParam,
    metadata: UpdateProductFeedMetadataParam
  ): ReturnType<typeof SDK.updateProductFeed> {
    return this.defaultSdk.updateProductFeed(params, metadata);
  }

  async trackTransactionStatusSpecificItem(
    params: TrackTransactionStatusSpecificItemMetadataParam
  ): ReturnType<typeof SDK.trackTransactionStatusSpecificItem> {
    return this.defaultSdk.trackTransactionStatusSpecificItem(params);
  }

  async trackTransactionStatusWholeTransaction(
    params: TrackTransactionStatusWholeTransactionMetadataParam
  ): ReturnType<typeof SDK.trackTransactionStatusWholeTransaction> {
    return this.defaultSdk.trackTransactionStatusWholeTransaction(params);
  }

  async updateBranchFeed(
    params: UpdateBranchFeedBodyParam,
    metadata: UpdateBranchFeedMetadataParam
  ): ReturnType<typeof SDK.updateBranchFeed> {
    return this.defaultSdk.updateBranchFeed(params, metadata);
  }

  async reportOutages(
    body: ReportOutagesBodyParam
  ): ReturnType<typeof SDK.reportOutages> {
    return this.defaultSdk.reportOutages(body);
  }

  async userDataApi(
    params: UserDataApiBodyParam,
    metadata: UserDataApiMetadataParam
  ): ReturnType<typeof SDK.userDataApi> {
    return this.defaultSdk.userDataApi(params, metadata);
  }

  async externalEventsApi(
    body: DyTypeWithOptionalSessionAndUser<ExternalEventsBodyParam>
  ): ReturnType<typeof SDK.externalEvents> {
    return this.defaultSdk.externalEvents(this.setBody(body));
  }

  async profileAnywhere(
    params: ProfileAnywhereMetadataParam
  ): ReturnType<typeof SDK.profileAnywhere> {
    return this.defaultSdk.profileAnywhere(params);
  }
}
