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
    } catch (error) {
      alert(error);
    }
  };

  const handleChange = (event) => {
    setSearch(event.target.value)
    console.log(search)
  }


  return (
    <div>
        <input onChange={handleChange} type="text" placeholder="Search..."/><button>Search</button>
      {!articles ? (
        <p>Loading</p>
      ) : (
        articles.map((element) => {
        //   console.log(element); //element is one single object from articles array
          return (
            <div>
              <h2>{element.title}</h2>
              <p>{element.url}</p>
              <p>{element.author}</p>
              <p>{element.created_at}</p>
            </div>
          );
        })
      )}
    </div>
  );
}
