import '../../style/base.css';
import { MutableRefObject, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { generateStartParagraph, reset, setGraph, initStory, setGoToGenerator } from '../../features/storySlice';
import { useNavigate } from 'react-router-dom';
import { loginWithSession, selectLoggedIn, selectSessionLoginFail } from '../../features/accountSlice';
import { makeNarrativeNode } from '../../utils/graph/graphUtils';
import { NarrativeNode, Graph } from '../../utils/graph/types';
import { Popover, Stack, Title, Text, Flex, List } from '@mantine/core';
import GenreDropdown from '../../components/initialInput/GenreDropdown';
import InputTextForm from '../../components/initialInput/InputTextForm';
import gsap from 'gsap';
import { addEntry, generateInitialStory, removeEntry, setAttribute, setContent } from '../../features/initialInputSlice';
import AttributeTable from '../../components/initialInput/AttributeTable';
import GenerateButton from '../../components/initialInput/GenerateButton';
import { IconAlertOctagon, IconAlien, IconFlare, IconSearch, IconWand, IconWriting } from '@tabler/icons';

export enum GenreOption {
    Fantasy = "Fantasy",
    Mystery = "Mystery",
    ScienceFiction = "Science Fiction",
    Dystopian = "Dystopian",
    Custom = "Custom Paragraph",
    Advanced = "Advanced Specification",
}

const InitialInputView = () => {

    const [genre, setGenre] = useState("");

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const loggedIn = useAppSelector((state) => state.account.loggedIn);
    const sessionLoginFail = useAppSelector((state) => state.account.sessionLoginFail);
    const goToGenerator = useAppSelector((state) => state.story.goToGenerator);
    const storyId = useAppSelector((state) => state.story.id);
    const initialInputValues = useAppSelector((state) => state.initialInput.values);

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

    const genreOptionsData = [
        {
            value: GenreOption.Fantasy,
            label: GenreOption.Fantasy,
            icon: <IconWand color="black" />,
            group: "Pre-set genre options"
        },
        {
            value: GenreOption.Mystery,
            label: GenreOption.Mystery,
            icon: <IconSearch color="black" />,
            group: "Pre-set genre options"
        },
        {
            value: GenreOption.ScienceFiction,
            label: GenreOption.ScienceFiction,
            icon: <IconAlien color="black" />,
            group: "Pre-set genre options"
        },
        {
            value: GenreOption.Dystopian,
            label: GenreOption.Dystopian,
            icon: <IconFlare color="black" />,
            group: "Pre-set genre options"
        },
        {
            value: GenreOption.Custom,
            label: GenreOption.Custom,
            icon: <IconWriting color="red" />,
            description: "Start with your own custom paragraph.",
            group: "User customization options"
        },
        {
            value: GenreOption.Advanced,
            label: GenreOption.Advanced,
            icon: <IconAlertOctagon color="red" />,
            description: "Provide a theme, characters, story items, etc. ",
            group: "User customization options"
        }
    ]

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

    const handleGenerateInitialStory = () => {
        dispatch(initStory()).unwrap().then(() =>
            dispatch(generateInitialStory()));
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

    const handleConditionalRendering = () => {
        switch (genre) {
            case "":
                return (
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
                );
            case GenreOption.Custom:
                return (<InputTextForm
                    handleGenerateText={handleGenerateText}
                />);
            case GenreOption.Advanced:
                return (
                    <>
                        <Text fz="sm">
                            <Text fw={500}>
                                For Example:
                            </Text>
                            <List size="sm">
                                <List.Item> theme: fantasy, jolly</List.Item>
                                <List.Item> character: knight, dragon</List.Item>
                                <List.Item>items: green sword</List.Item>
                            </List>

                        </Text>
                        <AttributeTable
                            values={initialInputValues}
                            setAttribute={(position, data) => dispatch(setAttribute({ position, data }))}
                            setContent={(position, data) => dispatch(setContent({ position, data }))}
                            removeEntry={(position) => dispatch(removeEntry({ position }))}
                            addEntry={() => dispatch(addEntry())}
                        />

                        <GenerateButton onClick={() => { handleGenerateInitialStory() }} />
                    </>
                );
            default:
                return (
                    <GenerateButton
                        onClick={() => { handleGenerateGenreText(genre) }}
                    />);
        }
    }

    return (
        <Flex justify="center" id="page-body" className="flex-grow-1">
            <Stack
                justify="center"
                align="center"
                spacing="lg"
                className="container-base"
                mb={40}
                ref={stackRef}
            >
                <Title order={1} weight={600} className="initial-title">
                    Pick a genre to start...
                </Title>

                <div id="genre-dropdown">
                    <GenreDropdown
                        options={genreOptionsData}
                        genre={genre}
                        setGenre={setGenre}
                    />
                </div>
                {
                    handleConditionalRendering()
                }
            </Stack>
        </Flex>
    );
}

export default InitialInputView;
