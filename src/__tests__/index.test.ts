import { DynamicYieldClient } from "../index";
import { DYApiConfig } from "../types";

// Mock fetch
global.fetch = jest.fn();

describe("DynamicYieldClient", () => {
  let client: DynamicYieldClient;
  const mockConfig: DYApiConfig = {
    apiKey: "test-api-key",
  };

  beforeEach(() => {
    client = new DynamicYieldClient(mockConfig);
    (global.fetch as jest.Mock).mockClear();
    client.setSessionAndUserDyId("session-id", "user-dyid");
  });

  describe("chooseVariations", () => {
    it("should make a successful API call", async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.chooseVariations({
        user: { id: "123" },
        context: { page: "home" },
        options: {
          variations: [
            {
              id: "123",
            },
          ],
        },
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dy-api.com/v2/serve/user/choose",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "dy-api-key": "test-api-key",
          }),
        })
      );
    });

    it("should throw an error on failed API call", async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
      });

      await expect(
        client.chooseVariations({
          user: { id: "123" },
          context: { page: "home" },
          options: {
            variations: [
              {
                id: "123",
              },
            ],
          },
        })
      ).rejects.toThrow("Choose Variations failed: 400");
    });
  });

  describe("trackPageviews", () => {
    it("should make a successful API call", async () => {
      const mockResponse = { success: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await client.trackPageviews({
        user: { id: "123" },
        context: { page: "home" },
      });

      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        "https://dy-api.com/v2/collect/user/pageview",
        expect.objectContaining({
          method: "POST",
          headers: expect.objectContaining({
            "dy-api-key": "test-api-key",
          }),
        })
      );
    });
  });

  // Add more test suites for other methods...
});
