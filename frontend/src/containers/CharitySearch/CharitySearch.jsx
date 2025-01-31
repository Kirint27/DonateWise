import React, { useState } from "react";
import styles from "./CharitySearch.module.scss";

const graphQl = "https://charitybase.uk/api/graphql";

const CharitySearch = () => {
  const [searchTerm, setSearchTerm] = useState(""); // For search term input (charity name or location)
  const [charities, setCharities] = useState([]); // Charity data
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const fetchCharities = async (search, skip = 0, charities = []) => {
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
              __typename
            }
            activities
            geo {
              latitude
              longitude
              __typename
            }
            
            contact {
              social {
                platform
                handle
                __typename
              }
              __typename
            }
            image {
              logo {
                small
                __typename
              }
              __typename
            }
            website
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `;
  const variables = {
    filters: {
      search: search
    },
    skip: 0,
    sort: "default"
  };
    try {
      const response = await fetch("https://charitybase.uk/api/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Apikey c2fa6fe8-e9b9-421a-b9de-37f4a12275da	`
        },
        body: JSON.stringify({
          query,
          variables
        }),
      });
  
      const result = await response.json();
      if (result.data?.CHC?.getCharities?.list.length > 0) {
        setCharities(result.data.CHC.getCharities.list);
      } else {
        console.warn("⚠️ No charities found for:", searchTerm);
        setCharities([]);
      }
    } catch (err) {
      setError("Failed to fetch charities.");
    } finally {
      setLoading(false);
    }
  };


  // Handle Search Trigger
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (searchTerm && searchTerm.trim() !== '') {
      fetchCharities(searchTerm); // Pass search term
    } else {
      console.log('Please enter a search term');
    }
  };
  return (
    <div>
      <p>charitySearch works</p>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a charity"
        />
        <button type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div> 
        {charities.length > 0 ? (
          charities.map((charity) => (
            <div key={charity.id}>
              <h3>{charity.names.value}</h3>
              {charity.image?.logo?.small && (
              <img
                src={charity.image.logo.small}
                alt={charity.names[0].value}
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            )}
            <p>{charity.activities}</p>
              <a href={charity.website} target="_blank" rel="noopener noreferrer">
{charity.website}              </a>
            </div>
          ))
        ) : (
          <p>No charities found</p>
        )}
      </div>
    </div>
  );
};

export default CharitySearch;