import Card from "../components/book/book";
import { useLocation } from "react-router-dom";


export default function Story() {
    const location = useLocation();
    const book = location.state?.book;
    console.log("book",book);
     const data = [
    {
      id: 1,
      author: book?.author,
      pages: book?.pages
    }
  ];
  return (
    <div style={styles.container}>
        <div className="card-global">
      <h2>{book?.title}</h2>
      {data.map((item) => (
        <Card key={item.id} item={item} />
      ))}
      </div>
    </div>
  );

}

const styles = {
  container: {
    fontFamily: "Arial",
    textAlign: "center",
    marginTop: "50px",
  }
};