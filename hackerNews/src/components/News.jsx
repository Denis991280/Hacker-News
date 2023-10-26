import axios from "axios";
import { useState, useEffect } from "react";
import { Spinner, Pagination, Heading, Pane, Link, Text } from 'evergreen-ui'
import Footer from "./Footer";



export default function News() {
  const [articles, setArticles] = useState(null);
  const [search, setSearch] = useState(null);
  const [inputSearch, setInputSearch] = useState(null);
  const [page, setPage] = useState(1);
  const url = "https://hn.algolia.com/api/v1/search?query=";

  useEffect(() => {
    getData();
  }, [inputSearch, page]); // every time the State of these changes the page is refreshed

  const getData = async () => {
    try {
      const response = await axios.get(
        `${url}${inputSearch}&page=${page}` // request URL is based on the search parameter and the page Number
      );
      setArticles(response.data.hits);
    //   console.log(response.data.hits)
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value) // whatever is written in the input gets set as the new search value
    // console.log(search)
  }

  const handleInput = (e) => {
    e.preventDefault(); // verhindert dass die Seite neu geladen wird, damit wir die Ergebnisse sehen
    setInputSearch(search); // the inputSearch which is send as a request is updated to the final text in the input
    setPage(1);  // page is set to 1 because after each new search we want to start at 1

  }

  const handlePage = (page) => {
    setPage(page) // page is a parameter here which is based on the function in the pagination
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1); // this takes the previous page value and adds one to it
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
  }

  return (
    <>
    <Pane
    className="hero">
      <Heading size={900} className="heading" marginTop={40} marginBottom={20} color="#E6E8F0
      ">Hacker News</Heading>
    </Pane>
    <div className="articleContainer">
        <div className="searchContainer">
            <input onChange={handleChange} type="text" placeholder="Search..."/>
            <button onClick={handleInput}><i className="fa-solid fa-magnifying-glass fa-lg"></i></button>
        </div>
        {/* <form onSubmit={handleInput} className="searchContainer">
            <input onChange={handleChange} type="text" placeholder="Search..."/>
            <button type="submit"><i className="fa-solid fa-magnifying-glass fa-lg"></i></button>
        </form> */}
      {!articles ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        articles.map((element) => {
        //   console.log(element); //element is one single object from articles array
          return (
            <div className="articleElement" key={element.objectID}>
                <div className="author-date">
                  <Text><span className="posted">Posted by: </span>{element.author}</Text>
                  <Text>{element.created_at}</Text>
                </div>
                  <Heading size={700} className="titleHeading">{element.title}</Heading>
                  <Link className="articleURL" href={element.url}>{element.url}</Link>
            </div>
          );
        })
        
      )}
     {!articles ? null :
      <Pagination page={page} totalPages={5} onPageChange={handlePage} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage}></Pagination>}
    </div>
    </>
  );
}