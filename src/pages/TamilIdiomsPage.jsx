import KannadaIdioms from "../features/IdiomsAndPhrases/kannada/KannadaIdioms";
import TamilIdioms from "../features/IdiomsAndPhrases/tamil/TamilIdioms";

export default function TamilIdiomsPage() {
    return (
        <>
            <h1>Tamil Proverbs</h1>
            <div style={styles.taIdiomsContainer}><TamilIdioms/></div>
        </>
    );
}

const styles = {
    taIdiomsContainer: {
        height: "80vh",
        overflowY: "auto",
        padding: "10px"
    },
};

