import React, { useState } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from '@apollo/client';
import styles from "./CharitySearch.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";
import { useQuery } from "@apollo/client";

// GraphQL Query to Search Charities by Name or Location
const SEARCH_CHARITIES = gql`
  query SearchCharities($search: String!) {
    CHC {
      searchCharities(search: $search, exactMatch: true) {
        id
        names {
          value
        }
        activities
        geo {
          latitude
          longitude
        }
      causes {
            id
            name
          }
        contact {
          social {
            handle
            platform
          }
        }
        image {
          logo {
            small
          }
        }
      }
    }
  }
`;

const AGG_GEOHASH_CHARITIES = gql`
  query CBWEB_AGG_GEOHASH_CHARITIES(
    $filters: FilterCHCInput!
    $top: Float
    $left: Float
    $bottom: Float
    $right: Float
  ) {
    CHC {
      getCharities(filters: $filters) {
        aggregate {
          geo(
            top: $top
            left: $left
            bottom: $bottom
            right: $right
          ) {
            geohash {
              buckets {
                key
                name
                count
              }
            }
          }
        }
      }
    }
  }
`;

const CharitySearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search term input (charity name or location)
  const [charities, setCharities] = useState([]); // Charity data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const API_KEY = process.env.REACT_APP_CHARITY_BASE_API_KEY;
  const GRAPHQL_URL = process.env.REACT_APP_GRAPHQL_URL;
  
  // Fetch charities when a search term is set
  const { loading: queryLoading, error: queryError, data } = useQuery(SEARCH_CHARITIES, {
    variables: { search: searchTerm },
    skip: !searchTerm,
    context: {
      headers: {
        Authorization: `Apikey ${API_KEY}`, // API Key
      },
    },
  });

  // Fetch geohash charities when location is provided
  const { loading: geoLoading, error: geoError, data: geoData } = useQuery(AGG_GEOHASH_CHARITIES, {
    variables: { filters: { search: searchTerm }, top: 90, left: -180, bottom: -90, right: 180 }, // Example bounding box for search area
    skip: !searchTerm,
    context: {
      headers: {
        Authorization: `Apikey ${API_KEY}`, // API Key
      },
    },
  });

  // Handles selection from CharityBaseSearch (optional)
  const onSelect = (item) => {
    console.log(item);
  };

  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm && searchTerm.trim() !== "") {
      setLoading(true);
      // Fetch charities for search term
      fetchCharities(searchTerm);
    } else {
      console.log("Please enter a search term");
    }
  };

  const fetchCharities = (search) => {
    const query = `
      query CBWEB_LIST_CHARITIES($filters: FilterCHCInput!, $skip: Int, $sort: SortCHC) {
        CHC {
          getCharities(filters: $filters) {
            count
            list(limit: 30 skip: $skip, sort: $sort) {
              id
              names(all: true) {
                value
                primary
              }
              activities
              geo {
                latitude
                longitude
              }
                     causes {
            id
            name
          }
              contact {
                social {
                  platform
                  handle
                }
              }
              image {
                logo {
                  small
                }
              }
              website
            }
          }
        }
      }
    `;
    const variables = {
      filters: { search: search },
      skip: 0,
      sort: "default",
    };
  
    fetch("https://charitybase.uk/api/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Apikey ${API_KEY}`, // API Key
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        const allCharities = result.data?.CHC?.getCharities?.list || [];
        setCharities(allCharities); // Update charities state with all results
      })
      .catch((err) => {
        setError("Failed to fetch charities.");
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  return (
    <div className="main-wrapper">
      <Navbar />
      <h2>Find a Charity to Support</h2>
  
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by charity, cause, area..."
              className={styles.searchInput}
            />
            <button type="submit" disabled={loading} className={styles.searchButton}>
              Search
            </button>
          </form>
  
          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
  
          <div className={styles.resultsContainer}>
            {charities.length > 0 &&
              charities.map((charity) => (
                <div key={charity.id} className={styles.charityCard}>
                  <h3 className={styles.charityName}>{charity.names[0].value}</h3>
                  {charity.image?.logo?.small && (
                    <img
                      src={charity.image.logo.small}
                      alt={charity.names[0].value}
                      className={styles.charityLogo}
                    />
                  )}
                  <p className={styles.charityDescription}>{charity.activities}</p>
                  <a href={charity.website} target="_blank" rel="noopener noreferrer">
                    <button className={styles.websiteButton}>Website</button>
                  </a>
                </div>
              ))}
          </div>
  
          {/* Handle geolocation search results if available */}
         
        </div>
      </div>
  
      <Footer />
    </div>
  );
  
};

export default CharitySearch;
