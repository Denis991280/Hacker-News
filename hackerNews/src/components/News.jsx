import axios from "axios";
import { useState, useEffect } from "react";
import { Spinner, Pagination, Heading, Pane, Link, Text } from 'evergreen-ui'



export default function News() {
  const [articles, setArticles] = useState(null);
  const [search, setSearch] = useState(null);
  const [page, setPage] = useState(1)
  const url = "https://hn.algolia.com/api/v1/search?query="

  useEffect(() => {
    getData();
  }, []); // brauchen wir nur initial ein einziges mal und nicht bei jedem State wechsel

  const getData = async () => {
    try {
      const response = await axios.get(
        `http://hn.algolia.com/api/v1/search?tags=front_page`
      );
      setArticles(response.data.hits);
    //   console.log(response.data.hits)
    } catch (error) {
      alert(error);
    }
  };

  const getSearchData = async () => {
    try {
      const response = await axios.get(
        `${url}${search}&page=${page}`
      );
      setArticles(response.data.hits);
    //   console.log(response.data.hits)
    } catch (error) {
      alert(error);
    }
  };


  const handleChange = (event) => {
    setSearch(event.target.value)
    // console.log(search)
  }

  const handleInput = (e) => {
    e.preventDefault(); // verhindert dass die Seite neu geladen wird, damit wir die Ergebnisse sehen
    // setInputSearch(search) brauchen wir nicht mehr, weil jetzt in der handleInput function die getData func genutzt wird
    console.log(search)
    console.log(page)
    setPage(1); 
    getSearchData();
  }

  const handlePage = (page) => {
    setPage(page)
    getSearchData();
  }

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
    getSearchData();
  }

  const handlePreviousPage = () => {
    setPage((prevPage) => prevPage - 1);
    getSearchData();
  }

  const convertDate = (date)  => {
    const parsedDate = new Date(date); // based on the weird date format which we get from the API a new Date is created
    const day = parsedDate.getUTCDate();
    const month = parsedDate.getUTCMonth(); 
    const year = parsedDate.getUTCFullYear();
  const monthNames = ["January", "February", "March", "April", "Mai", "Juni", "July", "August", "September", "Oktober", "November", "December"]

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
        articles.map((element) => {
        //   console.log(element); //element is one single object from articles array
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
     {!articles ? null :
      <Pagination page={page} totalPages={5} onPageChange={handlePage} onNextPage={handleNextPage} onPreviousPage={handlePreviousPage}></Pagination>}
    </div>
    </>
  );
}