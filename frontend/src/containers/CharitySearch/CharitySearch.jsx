import React, { useState, useEffect } from "react";
import { ApolloClient, InMemoryCache, HttpLink, gql } from "@apollo/client";
import styles from "./CharitySearch.module.scss";
import Navbar from "../../components/NavBar/NavBar";
import Footer from "../../components/Footer/Footer";

const SEARCH_CHARITIES = gql`
  query SearchCharities($search: String!, $skip: Int!, $limit: PageLimit,  ) {
    CHC {
      getCharities(filters: { search: $search  }) {
        list(limit: $limit, skip: $skip) {
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
          website
        }
      }
    }
  }
`;

const CharitySearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [limit] = useState(30); // Set your desired limit here
  const [hasMore, setHasMore] = useState(true);
  const [selectedCause, setSelectedCause] = useState("");
  const [isSearched, setIsSearched] = useState(false); // State to track if search has been done

  const API_KEY = process.env.REACT_APP_CHARITY_BASE_API_KEY;

  const fetchCharities = (search, skip, limit) => {
    setLoading(true);
    const client = new ApolloClient({
      link: new HttpLink({
        uri: "https://charitybase.uk/api/graphql",
        headers: {
          Authorization: `Apikey ${API_KEY}`,
        },
      }),
      cache: new InMemoryCache(),
    });

    client
      .query({
        query: SEARCH_CHARITIES,
        variables: { search, skip, limit },
      })
      .then((result) => {
        if (result.data?.CHC?.getCharities?.list.length > 0) {
          setCharities((prevCharities) => [
            ...prevCharities,
            ...result.data.CHC.getCharities.list,
          ]);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        setError("Failed to fetch charities.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      setCharities([]);
      setSkip(0);
      setHasMore(true);
      fetchCharities(searchTerm, 0, limit);
    }
  }, [searchTerm, limit]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(e.target.search.value);
    setIsSearched(true);
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      const newSkip = skip + limit;
      fetchCharities(searchTerm, newSkip, limit);
      setSkip(newSkip);
    }
  };


  const handleCauseChange = (e) => {
    setSelectedCause(e.target.value);
  };

  const filterCharities = () => {
    return charities.filter((charity) => {
      const matches = charity.causes.some((cause) =>
        cause.name.toLowerCase().includes(selectedCause.toLowerCase())
      );
      return selectedCause ? matches : true;
    });
  };

  return (
    <div className={styles.mainWrapper}>
      <Navbar />
      <h2>Find a Charity to Support</h2>
    
      <div className={styles.container}>
        <div className={styles.mainContent}>
          <form onSubmit={handleSearch} className={styles.searchForm}>
            <input
              type="text"
              name="search"
              placeholder="Search by charity, cause, area..."
              className={styles.searchInput}
            />
            <button type="submit" disabled={loading} className={styles.searchButton}>
              Search
            </button>
          </form>
    
          {loading && <p className={styles.loading}>Loading...</p>}
          {error && <p className={styles.error}>{error}</p>}
     {/* Show the filter dropdown only after searching */}
    { searchTerm && (
      <div className={styles.filterContainer}>
                <label htmlFor="cause">Filter results by cause:</label>
                <select
                  id="cause"
                  value={selectedCause}
                  onChange={handleCauseChange}
                >
                  <option value="">All Causes</option>
                  <option value="Health">Health</option>
                  <option value="Education">Education</option>
                  <option value="Poverty">Poverty</option>
                  <option value="Environment">Environment</option>
                  <option value="Animal">Animals</option>
                </select>
              </div>
            )}
  
            <div className={styles.resultsContainer}>
            {filterCharities().length > 0 ? (
                filterCharities().map((charity) => (
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
                ))
              ) : (
                searchTerm ? (
                  <p>No charities found.</p>
                ) : (
                  // don't show anything
                  <></>
                )
              )}
            </div>
            {searchTerm && hasMore && (
              <button className={styles.loadMoreButton} onClick={loadMore} disabled={loading}>
                Load More
              </button>
            )}
          </div>
        </div>
        <Footer /> 
      </div>
    );
  }
export default CharitySearch;