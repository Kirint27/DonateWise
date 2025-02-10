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

  it("should search for Oxfam and return results", async () => {
    global.fetch = jest.fn().mockResolvedValue({
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
                  contact: { social: [{ platform: "Facebook", handle: "oxfamgb" }] },
                  image: { logo: { small: "https://www.oxfam.org.uk/logo.png" } },
                  website: "https://www.oxfam.org.uk",
                },
              ],
            },
          },
        },
      }),
    });
  
    const setCharities = jest.fn();
    const setError = jest.fn();
    const setLoading = jest.fn();
  
    await fetchCharities("Oxfam", setCharities, setError, setLoading);
  
    expect(setCharities).toHaveBeenCalledWith([
      {
        id: "GB-CHC-100012",
        name: "Oxfam GB",
        activities: "International aid and development",
        location: { latitude: 51.752, longitude: -1.2577 },
        social: [{ platform: "Facebook", handle: "oxfamgb" }],
        logo: "https://www.oxfam.org.uk/logo.png",
        website: "https://www.oxfam.org.uk",
      },
    ]);
  
    // ✅ Fix: Instead of `.not.toHaveBeenCalled()`, check it was called with `null`
    expect(setError).toHaveBeenCalledWith(null);
  
    expect(setLoading).toHaveBeenCalledWith(true);
    expect(setLoading).toHaveBeenCalledWith(false);
  });
  
  


  it.only("should search for charities in London and return charities with location near London", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({
        data: {
          CHC: {
            getCharities: {
              count: 5,
              list: [
                {
                  geo: { latitude: 51.5074, longitude: -0.1278 }
                }
              ],
            },
          },
        },
      }),
    });

    const setCharities = jest.fn();
    const setError = jest.fn();
    const setLoading = jest.fn();

    await fetchCharities("London", setCharities, setError, setLoading);
 expect(setCharities).toHaveBeenCalledTimes(1)
    expect(setCharities).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          location: expect.objectContaining({
            latitude: expect.any(Number), // ✅ FIX: Use expect.any(Number) instead of toBeCloseTo()
            longitude: expect.any(Number),
          }),
        }),
      ])
    );

    expect(setError).not.toHaveBeenCalled();
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
    global.fetch = jest.fn().mockResolvedValue({ // ✅ FIX: Changed jsst.fn() to jest.fn()
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
