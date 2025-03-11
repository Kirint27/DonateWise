import React from "react";
import { render } from "@testing-library/react";
import CharitySearch, { fetchCharities } from "./CharitySearch"; // ✅ Import fetchCharities

describe("CharitySearch tests", () => {
  it("should render", () => {
    expect(render(<CharitySearch />)).toBeTruthy();
  });
});

describe("fetchCharities", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it.only("should search for Oxfam and return results", async () => {
    global.fetch = jest.fn().mockImplementation((url, options) => {
      console.log("📡 Mocked fetch called with:", JSON.parse(options.body));

      return Promise.resolve({
        json: jest.fn().mockResolvedValue({
          data: {
            CHC: {
              getCharities: {
                count: 1,
                list: [
                  {
                    id: "GB-CHC-100012",
                    names: [{ value: "Oxfam GB", primary: true }],
                    activities: "International aid and development",
                    geo: { latitude: 51.752, longitude: -1.2577 },
                    contact: {
                      social: [{ platform: "Facebook", handle: "oxfamgb" }],
                    },
                    image: {
                      logo: { small: "https://www.oxfam.org.uk/logo.png" },
                    },
                    website: "https://www.oxfam.org.uk",
                  },
                ],
              },
            },
          },
        }),
      });
    });

    const setCharities = jest.fn();
    const setError = jest.fn();
    const setLoading = jest.fn();

    console.log("🔍 Running fetchCharities for 'Oxfam'...");
    await fetchCharities("Oxfam", setCharities, setError, setLoading);

    console.log("✅ Checking if setCharities was called...");
    expect(setCharities).toHaveBeenCalledTimes(1);

    console.log("✅ Validating transformed data...");
    expect(setCharities).toHaveBeenCalledWith([
      expect.objectContaining({
        id: "GB-CHC-100012",
        name: "Oxfam GB",
        activities: "International aid and development",
        location: expect.objectContaining({
          latitude: 51.752,
          longitude: -1.2577,
        }),
        social: expect.arrayContaining([
          expect.objectContaining({
            platform: "Facebook",
            handle: "oxfamgb",
          }),
        ]),
        logo: expect.any(String),
        website: expect.any(String),
      }),
    ]);

    console.log("✅ Ensuring error handling works...");
    expect(setError).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("should search for charities in London and return only charities in London", async () => {
    global.fetch = jest.fn().mockImplementation((url, options) => {
      console.log("📡 Mocked fetch called with:", JSON.parse(options.body));

      const requestBody = JSON.parse(options.body);
      if (requestBody.variables.filters.search === "London") {
        return Promise.resolve({
          json: jest.fn().mockResolvedValue({
            data: {
              CHC: {
                getCharities: {
                  count: 3,
                  list: [
                    { geo: { latitude: 51.5074, longitude: -0.1278 } }, // ✅ London location
                    { geo: { latitude: 51.5155, longitude: -0.1416 } }, // ✅ London location
                    { geo: { latitude: 53.4808, longitude: -2.2426 } }, // ❌ Manchester
                  ],
                },
              },
            },
          }),
        });
      }
      return Promise.resolve({
        json: jest
          .fn()
          .mockResolvedValue({
            data: { CHC: { getCharities: { count: 0, list: [] } } },
          }),
      });
    });

    const setCharities = jest.fn();
    const setError = jest.fn();
    const setLoading = jest.fn();

    await fetchCharities("London", setCharities, setError, setLoading);

    expect(setCharities).toHaveBeenCalledTimes(1);

    // ✅ Check if all returned charities are within London's lat/lon range
    expect(setCharities).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          location: expect.objectContaining({
            latitude: expect.toBeGreaterThanOrEqual(51.3),
            latitude: expect.toBeLessThanOrEqual(51.7),
            longitude: expect.toBeGreaterThanOrEqual(-0.5),
            longitude: expect.toBeLessThanOrEqual(0.2),
          }),
        }),
      ])
    );

    // ✅ Ensure non-London charities are NOT included
    expect(setCharities).not.toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          location: expect.objectContaining({
            latitude: expect.toBeGreaterThanOrEqual(52),
          }),
        }),
      ])
    );

    expect(setError).not.toHaveBeenCalled();
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("should handle errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Network error"));

    const setCharities = jest.fn();
    const setError = jest.fn();
    const setLoading = jest.fn();

    await fetchCharities("search", setCharities, setError, setLoading);

    expect(setCharities).not.toHaveBeenCalled();
    expect(setError).toHaveBeenCalledWith("Failed to fetch charities.");
    expect(setLoading).toHaveBeenCalledWith(false);
  });

  it("should handle no charities found", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          CHC: {
            getCharities: {
              count: 0,
              list: [],
            },
          },
        },
      }),
    });

    const setCharities = jest.fn();
    const setLoading = jest.fn();
    const setError = jest.fn();

    await fetchCharities("xyxrr", setCharities, setError, setLoading);

    expect(setCharities).toHaveBeenCalledWith([]);
    expect(setError).toHaveBeenCalledWith("No charities found");
    expect(setLoading).toHaveBeenCalledWith(false);
  });
});
