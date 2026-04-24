import EnglishIdioms from "../features/IdiomsAndPhrases/english/EnglishIdioms";

export default function EnglishIdiomsPage() {
    return (
        <>
            <h1>English proverbs</h1>
            <div style={styles.eIdiomsContainer}><EnglishIdioms/></div>
        </>
    );
}

const styles = {
    eIdiomsContainer: {
        height: "80vh",
        overflowY: "auto",
        padding: "10px"
    },
};

