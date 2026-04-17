import KannadaIdioms from "../features/IdiomsAndPhrases/kannada/KannadaIdioms";

export default function KannadaIdiomsPage() {
    return (
        <>
            <h1>Kannada Idioms</h1>
            <div style={styles.kIdiomsContainer}><KannadaIdioms /></div>
        </>
    );
}

const styles = {
    kIdiomsContainer: {
        height: "80vh",
        overflowY: "auto",
        padding: "10px"
    },
};

