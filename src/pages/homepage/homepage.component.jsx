import { useContext, useEffect, useState } from "react";
import Error from "../../components/error/error";
import FilterSelect from "../../components/filter-select/filter-select";
import MovieCard from "../../components/movie-card/movie-card";
import SearchBar from "../../components/search-bar/search-bar";
import Spinner from "../../components/spin-loader/loader.component";
import SearchContext from "../../contexts/searchContext";
import {
  dateFilter,
  genreFilter,
  searchFilter,
} from "../../utilities/searchFilter";
import useFetch from "../../utilities/useFetch";

import "./homepage.styles.scss";

const Homepage = () => {
  const [page, setPage] = useState(1);
  const { searchKey, genreFilterKey, releaseDate } = useContext(SearchContext);
  const apiKey = process.env.REACT_APP_MOVIE_API_KEY;
  //change to movie api
  const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}`;

  const { loading, error, data } = useFetch(url);

  let newData = data?.results;

  if (searchKey) {
    newData = searchFilter(searchKey, newData);
  }
  if (genreFilterKey) {
    newData = genreFilter(genreFilterKey, newData);
  }
  if (releaseDate) {
    newData = dateFilter(releaseDate, newData);
  }
  // setPage(newData?.length)

  //paging system
  const PER_PAGE = 4;
  const total = newData?.length;
  const pages = Math.ceil(total / PER_PAGE);
  const skip = page * PER_PAGE - PER_PAGE;

  const Movies = newData?.slice(skip, skip + PER_PAGE).map((movie, index) => {
    return <MovieCard movie={movie} key={movie.id} />;
  });

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [page]);

  if (!loading && error) {
    return (
      <div className="homepage">
        <Error/>
      </div>
    );
  }
  return (
    <div className="homepage">
      <div className="header">
        <h1>
          Welcome to{" "}
          <span>
            <em>Uptick</em>
          </span>{" "}
          Movies
        </h1>
        <p>Full Access to your favourite movies and lots more...</p>
      </div>
      <div className="search_filter">
        <SearchBar />
        <FilterSelect />
      </div>
      {error && (
        <>
          <h2>Failed to fetch</h2>
          <p>Kindly reload the page or check your internet connection</p>
        </>
      )}
      {loading ? (
        <Spinner />
      ) : (
        <>
          <div className="movies-section">{Movies}</div>

          {/* pagination */}
          <>
            <h3 className="pagination">
              Pages: {newData?.length > 0 ? page : 0} of {pages}
            </h3>
            <div className="page-btns">
              <button
                disabled={page <= 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Prev
              </button>
              {Array.from({ length: pages }, (_, index) => index + 1).map(
                (each) => (
                  <span
                    onClick={() => setPage(each)}
                    key={each}
                    style={page === each ? { backgroundColor: "#011ff3" } : {}}
                  >
                    {/* {each} */}
                  </span>
                )
              )}
              <button
                disabled={page >= pages}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </>
        </>
      )}
    </div>
  );
};

export default Homepage;
