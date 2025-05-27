import merge from "lodash.merge";
import {
  operations as operationsServe,
  paths as pathsServe,
} from "./openapi/openapi-dev-serve";
import {
  operations as operationsDefault,
  paths as pathsDefault,
} from "./openapi/openapi-dev";
import createClient, { Middleware } from "openapi-fetch";
import { v4 as uuidv4 } from "uuid";

type WithOptionalSessionAndUser<T> = T & {
  session?: {
    dy: string;
  };
  user?: {
    dyid: string;
    dyid_server?: string;
  };
};

const getSessionAndUserMiddleware = (
  setter: (sessionId: string, userDyid: string) => void
): Middleware => ({
  async onResponse({ response }) {
    const { json } = response;
    const body = await json();
    const hasCookies = "cookies" in body && Array.isArray(body.cookies);
    if (!hasCookies) {
      return response;
    }
    const cookies = body.cookies as {
      name: string;
      value: string;
      maxAge: number;
    }[];
    const userDyid =
      cookies.find((cookie) => cookie.name === "_dyid_server")?.value ?? "";
    const sessionId =
      cookies.find((cookie) => cookie.name === "_dyjsession")?.value ?? "";
    setter(sessionId, userDyid);
    return response;
  },
});

export class DynamicYieldClient {
  private clientServe: ReturnType<typeof createClient<pathsServe>> | null =
    null;
  private clientDefault: ReturnType<typeof createClient<pathsDefault>> | null =
    null;
  private sessionId: string | null = null;
  private userDyid: string | null = null;

  constructor(config: { apiKey: string; dataCenter: "us" | "eu" }) {
    this.sessionId = uuidv4();
    this.userDyid = uuidv4();
    const dataCenter = config.dataCenter ?? "us";
    const baseUrl =
      dataCenter === "eu" ? "https://dy-api.eu/v2" : "https://dy-api.com/v2";
    this.clientServe = createClient<pathsServe>({
      baseUrl,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "dy-api-key": config.apiKey,
      },
    });
    this.clientServe.use(
      getSessionAndUserMiddleware((sessionId, userDyid) => {
        this.sessionId = sessionId;
        this.userDyid = userDyid;
      })
    );
    this.clientDefault = createClient<pathsDefault>({
      baseUrl,
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "dy-api-key": config.apiKey,
      },
    });
  }

  private setBody(body: any) {
    if (!this.sessionId || !this.userDyid) {
      throw new Error("Session ID and User DY ID are required");
    }
    return merge(
      {
        session: {
          dy: this.sessionId,
        },
        user: {
          dyid: this.userDyid,
        },
      },
      body
    );
  }

  async chooseVariations(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsServe["chooseVariations"]["requestBody"]["content"]["application/json"],
        "context" | "options" | "selector"
      >
    >
  ) {
    const bodyWithSessionAndUser = this.setBody(body);
    return this.clientServe?.POST("/serve/user/choose", {
      body: bodyWithSessionAndUser,
    });
  }

  async trackPageviews(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsDefault["trackPageviews"]["requestBody"]["content"]["application/json"],
        "options" | "context"
      >
    >
  ) {
    return this.clientDefault?.POST("/collect/user/pageview", {
      body: this.setBody(body),
    });
  }

  async trackEngagement(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsDefault["trackEngagement"]["requestBody"]["content"]["application/json"],
        "engagements" | "context"
      >
    >
  ) {
    return this.clientDefault?.POST("/collect/user/engagement", {
      body: this.setBody(body),
    });
  }

  async search(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsServe["search"]["requestBody"]["content"]["application/json"],
        "options" | "query"
      >
    >
  ) {
    return this.clientServe?.POST("/serve/user/search", {
      body: this.setBody(body),
    });
  }

  async trackEvents(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsDefault["trackEvents"]["requestBody"]["content"]["application/json"],
        "context" | "events"
      >
    >
  ) {
    return this.clientDefault?.POST("/collect/user/event", {
      body: this.setBody(body),
    });
  }

  async updateProductFeed({
    feedId,
    body,
  }: {
    feedId: string;
    body: operationsDefault["updateProductFeed"]["requestBody"]["content"]["application/json"];
  }) {
    return this.clientDefault?.POST("/feeds/{feedId}/bulk", {
      body: this.setBody(body),
      params: {
        path: {
          feedId,
        },
      },
    });
  }

  async trackTransactionStatusSpecificItem({
    feedId,
    transactionId,
    itemId,
  }: {
    feedId: string;
    transactionId: string;
    itemId: string;
  }) {
    return this.clientDefault?.GET(
      "/feeds/{feedId}/transaction/{transactionId}/item/{itemId}",
      {
        params: {
          path: {
            feedId,
            transactionId,
            itemId,
          },
        },
      }
    );
  }

  async trackTransactionStatusWholeTransaction({
    feedId,
    transactionId,
  }: {
    feedId: string;
    transactionId: string;
  }) {
    return this.clientDefault?.GET(
      "/feeds/{feedId}/transaction/{transactionId}",
      {
        params: {
          path: {
            feedId,
            transactionId,
          },
        },
      }
    );
  }

  async updateBranchFeed({
    id,
    body,
  }: {
    id: string;
    body: operationsDefault["updateBranchFeed"]["requestBody"]["content"]["application/json"];
  }) {
    return this.clientDefault?.POST("/feeds/branch/{id}/inventory", {
      body: this.setBody(body),
      params: {
        path: {
          id,
        },
      },
    });
  }

  async reportOutages({
    body,
  }: {
    body: operationsDefault["reportOutages"]["requestBody"]["content"]["application/json"];
  }) {
    return this.clientDefault?.POST("/feeds/branch/outage/bulk", {
      body: this.setBody(body),
    });
  }

  async userDataApi({
    feedKey,
    body,
  }: {
    feedKey: string;
    body: operationsDefault["userDataApi"]["requestBody"]["content"]["application/json"];
  }) {
    return this.clientDefault?.POST("/userdata/{feedKey}/bulk", {
      body: this.setBody(body),
      params: {
        path: {
          feedKey,
        },
      },
    });
  }

  async externalEventsApi(
    body: WithOptionalSessionAndUser<
      Pick<
        operationsDefault["externalEvents"]["requestBody"]["content"]["application/json"],
        "device" | "events"
      >
    >
  ) {
    return this.clientDefault?.POST("/userdata/events", {
      body: this.setBody(body),
    });
  }

  async profileAnywhere({
    cuid,
    cuidType,
    affinity,
  }: {
    cuid: string;
    cuidType: string;
    affinity: boolean;
  }) {
    return this.clientDefault?.GET("/userprofile", {
      params: {
        query: {
          cuid,
          cuidType,
          affinity,
        },
      },
    });
  }
}
