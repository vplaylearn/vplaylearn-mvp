import HindiIdioms from "../features/IdiomsAndPhrases/hindi/HindiIdioms";
import KannadaIdioms from "../features/IdiomsAndPhrases/kannada/KannadaIdioms";
import TamilIdioms from "../features/IdiomsAndPhrases/tamil/TamilIdioms";

export default function HindiIdiomsPage() {
    return (
        <>
            <h1>Hindi Proverbs</h1>
            <div style={styles.hIdiomsContainer}><HindiIdioms/></div>
        </>
    );
}

const styles = {
    hIdiomsContainer: {
        height: "80vh",
        overflowY: "auto",
        padding: "10px"
    },
};

