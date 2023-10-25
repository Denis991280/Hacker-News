import axios from "axios";
import { useState, useEffect } from "react";

export default function News() {
  const [articles, setArticles] = useState(null);
  const [search, setSearch] = useState(null);
  const url = "https://hn.algolia.com/api/v1/search?query="

  useEffect(() => {
    getData();
  }, [search]);

  const getData = async () => {
    try {
      const response = await axios.get(
        `${url}${search}`
      );
      setArticles(response.data.hits);
    //   console.log(response.data.hits)
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value)
    console.log(search)
  }


  return (
    <div className="articleContainer">
        <div className="searchContainer">
            <input onChange={handleChange} type="text" placeholder="Search..."/>
            <button><i class="fa-solid fa-magnifying-glass fa-lg"></i></button>
        </div>
      {!articles ? (
        <p>Loading</p>
      ) : (
        articles.map((element) => {
        //   console.log(element); //element is one single object from articles array
          return (
            <div className="articleElement">
                <div className="author-date">
                    <p><span>Posted by: </span>{element.author}</p>
                    <p>{element.created_at}</p>
                </div>
              <h2 className="titleHeading">{element.title}</h2>
              <a className="articleURL" href={element.url}>{element.url}</a>
            </div>
          );
        })
      )}
    </div>
  );
}