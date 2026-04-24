import { useEffect, useState } from "react";
import IdiomCard from "../../../components/idiomCard/IdiomCard";

export default function HindiIdioms() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("/data/hindi-idioms.json")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      {data.map((item) => (
        <IdiomCard key={item.id} item={item} language={"hindi"} />
      ))}
    </div>
  );
}