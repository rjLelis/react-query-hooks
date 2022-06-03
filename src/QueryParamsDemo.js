import React, { useEffect, useState } from "react";
import { useQuery } from "./hooks";
import { useHistory } from "react-router-dom";
import { isEmpty } from "lodash";

export default function QueryParamsDemo() {
  let query = useQuery();
  const history = useHistory();

  const [availabilityFilter, setAvailabilityFilter] = useState(
    query.get("availability") || "all"
  );

  const [subjectFilters, setSubjectFilters] = useState(
    query.getAll("subject") || []
  );

  const [sortByFilter, setSortByFilter] = useState(
    query.get("sort-by") || "title"
  );

  const [searchBarValue, setSearchBarValue] = useState(
    query.get("search") || ""
  );

  const [queryString, setQueryString] = useState("");

  useEffect(() => {
    const availabilityQueryString = `availability=${availabilityFilter}`;

    const subjectQueryString = !isEmpty(subjectFilters)
      ? subjectFilters.map((subject) => `&subject=${subject}`).join("")
      : "";

    const sortByQueryString = `&sort-by=${sortByFilter}`;

    const searchBarQueryString = searchBarValue
      ? `&search=${searchBarValue}`
      : "";

    setQueryString(
      `?${availabilityQueryString}${subjectQueryString}${sortByQueryString}${searchBarQueryString}`
    );

    history.push(queryString);
  }, [
    availabilityFilter,
    subjectFilters,
    sortByFilter,
    searchBarValue,
    queryString,
    history,
  ]);

  const pushQueryStringToUrl = (queryString, type) => {
    switch (type) {
      case "availability":
        setAvailabilityFilter(queryString);
        return;
      case "sort-by":
        setSortByFilter(queryString);
        return;
      case "search":
        const { value } = queryString.target;
        setSearchBarValue(value);
        return;
      case "subject":
        if (subjectFilters.includes(queryString)) {
          const selectedSubjects = subjectFilters.filter(
            (subject) => subject !== queryString
          );
          setSubjectFilters(selectedSubjects);
        } else {
          setSubjectFilters((prevSubjectFilters) => [
            ...prevSubjectFilters,
            queryString,
          ]);
        }
        return;
      default:
        return;
    }
  };

  return (
    <div>
      <div>
        <h1>Filter By</h1>
        {/* <button onClick={test}>bla</button> */}
        <h2>Search</h2>
        <input
          type="text"
          name="search"
          onChange={(event) => pushQueryStringToUrl(event, "search")}
        />
        <h2>Availability</h2>
        <ul>
          <li>
            <button onClick={() => pushQueryStringToUrl("all", "availability")}>
              All
            </button>
          </li>
          <li>
            <button
              onClick={() => pushQueryStringToUrl("available", "availability")}
            >
              Available
            </button>
          </li>
          <li>
            <button
              onClick={() =>
                pushQueryStringToUrl("loaned-to-others", "availability")
              }
            >
              Loaned to others
            </button>
          </li>
        </ul>
        <h2>Subject</h2>
        <ul>
          <li>
            <button
              onClick={() => pushQueryStringToUrl("development", "subject")}
            >
              Development
            </button>
          </li>
          <li>
            <button onClick={() => pushQueryStringToUrl("design", "subject")}>
              Design
            </button>
          </li>
        </ul>
        <h2>Sort by</h2>
        <ul>
          <li>
            <button onClick={() => pushQueryStringToUrl("title", "sort-by")}>
              A to Z
            </button>
          </li>
          <li>
            <button onClick={() => pushQueryStringToUrl("-title", "sort-by")}>
              Z to A
            </button>
          </li>
          <li>
            <button
              onClick={() => pushQueryStringToUrl("return_date", "sort-by")}
            >
              Avaibility
            </button>
          </li>
        </ul>

        <FiltersResult
          availability={availabilityFilter}
          subject={subjectFilters}
          sortBy={sortByFilter}
          search={searchBarValue}
        />
      </div>
    </div>
  );
}

function FiltersResult({ availability, subject, sortBy, search }) {
  return (
    <>
      <div>
        {availability ? (
          <h3>
            The <code>availability</code> in the query string is &quot;
            {availability}
            &quot;
          </h3>
        ) : (
          <h3>There is no availability in the query string</h3>
        )}
      </div>
      <div>
        {!isEmpty(subject) ? (
          <h3>
            The <code>subjects</code> in the query string are &quot;
            {subject.join(", ")}
            &quot;
          </h3>
        ) : (
          <h3>There is no subject in the query string</h3>
        )}
      </div>
      <div>
        {sortBy ? (
          <h3>
            The <code>sortBy</code> in the query string is &quot;
            {sortBy}
            &quot;
          </h3>
        ) : (
          <h3>There is no sortBy in the query string</h3>
        )}
      </div>
      <div>
        {search ? (
          <h3>
            The <code>search</code> in the query string is &quot;
            {search}
            &quot;
          </h3>
        ) : (
          <h3>There is no search in the query string</h3>
        )}
      </div>
    </>
  );
}
