import { useEffect, useState } from "react";
import IdiomCard from "../../../components/idiomCard/IdiomCard";

export default function TeluguIdioms() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/telugu-proverbs.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {data.map((item) => (
        <IdiomCard key={item.id} item={item} language={"telugu"} />
      ))}
    </div>
  );
}