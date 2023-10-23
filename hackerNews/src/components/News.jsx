import hackernews from '../hackernews.json'

export default function News() {
    {hackernews.hits.map((item) => {
        return (
            console.log(item.author)
        )
    })
    }
}