import './InitialInput.css'
import '../../style/base.css';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateStartParagraph, reset, setGraph, initStory, setGoToGenerator } from '../../features/storySlice';
import { useNavigate } from 'react-router-dom';
import { loginWithSession, selectLoggedIn, selectSessionLoginFail } from '../../features/accountSlice';
import { makeNarrativeNode } from '../../utils/graph/graphUtils';
import { NarrativeNode, Graph } from '../../utils/graph/types';
import { Popover, Stack, Title, Text, Flex } from '@mantine/core';
import GenreDropdown from '../../components/initialInput/GenreDropdown';
import InputTextForm from '../../components/initialInput/InputTextForm';
import GenerateButton from '../../components/initialInput/GenerateButton';
import gsap from 'gsap';

export enum GenreOption {
    Fantasy = "Fantasy",
    Mystery = "Mystery",
    ScienceFiction = "Science Fiction",
    Dystopian = "Dystopian",
    Custom = "Custom",
}

const InitialInputView = () => {
    const [genre, setGenre] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loggedIn = useAppSelector((state) => state.account.loggedIn);
    const sessionLoginFail = useAppSelector((state) => state.account.sessionLoginFail);
    const goToGenerator = useAppSelector((state) => state.story.goToGenerator);
    const storyId = useAppSelector((state) => state.story.id);

    useEffect(() => {
        if (goToGenerator) {
            dispatch(setGoToGenerator(false));
            navigate(`/generator/${storyId}`);
        }
    }, [goToGenerator, storyId, navigate, dispatch]);

    useEffect(() => {
        if (!loggedIn) dispatch(loginWithSession())
    }, [loggedIn, dispatch]);

    useEffect(() => {
        if (!loggedIn && sessionLoginFail) {
            navigate("/login");
        }
    }, [loggedIn, sessionLoginFail, navigate]);

    // Reset redux state on initial render
    useEffect(() => {
        dispatch(reset());
    }, [dispatch]);

    const genreOptions = [
        GenreOption.Fantasy,
        GenreOption.Mystery,
        GenreOption.ScienceFiction,
        GenreOption.Dystopian,
        GenreOption.Custom,
    ];

    const handleGenerateText = (text: string) => {
        dispatch(initStory());

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
        const generateGenrePrompt = `Write a ${genre} story from a second person perspective.`;

        dispatch(initStory()).unwrap().then(() =>
            dispatch(generateStartParagraph({ prompt: generateGenrePrompt })));
    };

    // Animations
    const stackRef = useRef() as MutableRefObject<HTMLInputElement>;
    // TODO Fix
    const timeline: any = useRef();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            timeline.current = gsap.timeline()
                .set(".initial-title", { opacity: 0, scale: 2 })
                .set("#genre-dropdown", { opacity: 0 })
                .set(".generate-button", { opacity: 0 })
                .to(".initial-title", { opacity: 1, delay: 0.2 })
                .to(".initial-title", { scale: 1.5, delay: 0.2 })
                .to(".initial-title", { y: -50 }, "<")
                .to("#genre-dropdown", { opacity: 1 })
                .to(".generate-button", { opacity: 1 });
        }, stackRef);

        return () => ctx.revert();
    }, []);

    return (
<Flex justify="center" id="page-body" className="flex-grow-1">
            <Stack
                justify="center"
                align="center"
                spacing="lg"
                className="container-base"
                ref={stackRef}
            >
                <Title order={1} weight={600} className="initial-title">
                    Pick a genre to start...
                </Title>

                <div id="genre-dropdown">
                    <GenreDropdown
                        options={genreOptions}
                        genre={genre}
                        setGenre={setGenre}
                    />
                </div>
                {
                    genre !== "" ? (
                        genre === GenreOption.Custom ? (
                            <InputTextForm
                                handleGenerateText={handleGenerateText}
                            />
                        ) : (
                            <GenerateButton
                                onClick={() => { handleGenerateGenreText(genre) }}
                            />
                        )
                    ) : (
                        <Popover width={200} position="bottom" withArrow shadow="md">
                            <Popover.Target>
                                <div>
                                    <GenerateButton
                                        color="gray"
                                        className="generate-button"
                                    />
                                </div>
                            </Popover.Target>
                            <Popover.Dropdown>
                                <Text size="sm">Select a genre first before starting story generation.</Text>
                            </Popover.Dropdown>

                        </Popover>
                    )
                }
            </Stack>
        </Flex>
    );
}

export default InitialInputView;
