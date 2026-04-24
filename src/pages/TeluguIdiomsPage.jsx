import KannadaIdioms from "../features/IdiomsAndPhrases/kannada/KannadaIdioms";
import TeluguIdioms from "../features/IdiomsAndPhrases/telugu/TeluguIdioms";

export default function TeluguIdiomsPage() {
    return (
        <>
            <h1>Telugu Proverbs</h1>
            <div style={styles.teIdiomsContainer}><TeluguIdioms /></div>
        </>
    );
}

const styles = {
    teIdiomsContainer: {
        height: "80vh",
        overflowY: "auto",
        padding: "10px"
    },
};

