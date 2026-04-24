import Jokes from "../components/jokes/jokes";

export default function JokesPage() {
  return (
    <>
      <h3>Jokes List</h3>
      <Jokes content="jokes" page="yes" />;
    </>
    )
}