import axios from "axios";
import { useState, useEffect } from "react";
import { Spinner, Pagination, Heading, Pane, Link, Text } from 'evergreen-ui';


export default function News() {
  const [articles, setArticles] = useState(null);
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    getData(`http://hn.algolia.com/api/v1/search?tags=front_page`);
  }, []); // When we first load the page we want to do getData for the frontpage articles

  const getData = async (url) => { 
    try {
      const response = await axios.get(
        url // url in this case is a parameter which can be writen into the function if we call it. Based on this the request is send to the API
      );
      setArticles(response.data);
     console.log(response.data)
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value) // whatever is written in the input gets set as the new search value
    // console.log(search)
  }

  const handleInput = (e) => {
    e.preventDefault(); // the page does not get rerendered so that we can still see the changes
    //console.log(search)
    //console.log(page)
    setPage(1); 
    getData(`https://hn.algolia.com/api/v1/search?query=${search}&page=${page}`);
  }

  const handlePage = (page) => {
    setPage(page)
    getData(`https://hn.algolia.com/api/v1/search?query=${search}&page=${page}`);
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    getData(`https://hn.algolia.com/api/v1/search?query=${search}&page=${page}`);
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
    getData(`https://hn.algolia.com/api/v1/search?query=${search}&page=${page}`);
  }

  const convertDate = (date)  => {
    const parsedDate = new Date(date); // based on the weird date format which we get from the API a new Date is created
    const day = parsedDate.getUTCDate();
    const month = parsedDate.getUTCMonth(); 
    const year = parsedDate.getUTCFullYear();
  const monthNames = ["January", "February", "March", "April", "Mai", "June", "July", "August", "September", "October", "November", "December"]

    return `${day}. ${monthNames[month]} ${year}`;
  }

  return (
    <>
    <Pane
    className="hero">
      <Heading size={900} className="heading" marginTop={40} marginBottom={20} color="#E6E8F0
      ">Hacker News</Heading>
    </Pane>
    <div className="articleContainer">
        <form onSubmit={handleInput} className="searchContainer">
            <input onChange={handleChange} type="text" placeholder="Search..."/>
            <button type="submit"><i className="fa-solid fa-magnifying-glass fa-lg"></i></button>
        </form>
      {!articles ? (
        <div className="spinner">
          <Spinner />
        </div>
      ) : (
        articles.hits.length === 0 ? <Text marginTop={80} marginBottom={80}>No Results found</Text> :
          // we want to check if the array is empty and if yes then get the No results found information
        articles.hits.map((element) => {
          return (
            <div className="articleElement" key={element.objectID}>
                <div className="author-date">
                  <Text><span className="posted">Posted by: </span>{element.author}</Text>
                  <Text>{convertDate(element.created_at)}</Text>
                </div>
                  <Heading size={700} className="titleHeading">{element.title}</Heading>
                  <Link className="articleURL" href={element.url}>{element.url}</Link>
            </div>
          );
        })
        
      )}
     {!articles || articles.hits.length === 0 ? null :
      <Pagination page={page} totalPages={articles.nbPages} onPageChange={handlePage} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage}></Pagination>}
    </div>
    </>
  );
}