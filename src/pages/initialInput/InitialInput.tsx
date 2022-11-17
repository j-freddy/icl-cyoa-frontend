import './InitialInput.css'
import '../../style/base.css';
import { useEffect, useState } from 'react';
import { Button, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useAppDispatch } from '../../app/hooks';
import { generateStartParagraph, reset, setGraph } from '../../features/storySlice';
import InputTextForm from '../../components/generator/InputTextForm';
import { Link } from 'react-router-dom';
import { makeNarrativeNode } from '../../utils/graph/graphUtils';
import { NarrativeNode, Graph } from '../../utils/graph/types';

const InitialInputView = () => {
    const [genre, setGenre] = useState("Genre Options ... ");

    const dispatch = useAppDispatch();

    // reset redux state on initial render
    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    const GenreOptions = (GenreOptionsProps: { genre: string }) => {
        const handleSelect = (e: string | null) => {
            if (e) {
                setGenre(e)
            }
        }
        return (
            <div id="genre-options">
                <h2 id="instruction">
                    Choose a genre...
                </h2>
                <Dropdown
                    onSelect={handleSelect}
                    id="dropdown">
                    <Dropdown.Toggle id="dropdown-button" variant="secondary">
                        {GenreOptionsProps.genre}
                    </Dropdown.Toggle>

                    <Dropdown.Menu variant="dark">
                        <Dropdown.Item eventKey="1. Fantasy">1. Fantasy</Dropdown.Item>
                        <Dropdown.Item eventKey="2. Mystery">2. Mystery</Dropdown.Item>
                        <Dropdown.Item eventKey="3. Science Fiction">
                            3. Science Fiction
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="4. Dystopian">4. Dystopian</Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item eventKey="5. Custom Paragraph">5. Custom Paragraph</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>
        )
    };

    const handleGenerateText = (text: string) => {
        const root: NarrativeNode = makeNarrativeNode({
            nodeId: 0,
            data: text,
            childrenIds: [],
            isEnding: false,
        });
        const graph: Graph = {
            nodeLookup: { 0: root },
        };

        dispatch(setGraph(graph));

    };

    const handleGenerateGenreText = (genre: string) => {
        let generateGenrePrompt = "";
        switch (genre) {
            case "1. Fantasy":
                generateGenrePrompt = "Write a fantasy story from a second person's perspective."
                break;
            case "2. Mystery":
                generateGenrePrompt = "Write a mystery story from a second person's perspective."
                break;
            case "3. Science Fiction":
                generateGenrePrompt = "Write a science fiction story from a second person's perspective."
                break;
            case "4. Dystopian":
                generateGenrePrompt = "Write a dystopian story from a second person's perspective."
                break;
        }

        dispatch(generateStartParagraph(generateGenrePrompt));
    };

    let submission;
    if (genre === "5. Custom Paragraph") {
        submission = <InputTextForm handleGenerateText={handleGenerateText} />
    } else if (genre !== "Genre Options ... ") {
        submission = <div id="submit-button">
            <span id="button">
                <Link to='/generator'>
                    <Button
                        variant="light"
                        onClick={() => { handleGenerateGenreText(genre) }}>
                        Generate
                    </Button>
                </Link>
            </span>
        </div>;
    }

    return (
        <Container
            id="input-section"
            className="wrapper d-flex flex-column justify-content-center">
            <div id="welcome-title">
                <h1><span className="fancy">Choose Your Own Adventure</span> Story Generator</h1>
                <p>
                    Quickly generate a complete, editable gamebook with a single prompt.
                </p>

            </div>
            <GenreOptions genre={genre} />
            {submission}
        </Container>
    );
}

export default InitialInputView;
