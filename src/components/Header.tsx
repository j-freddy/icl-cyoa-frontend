import {
	createStyles,
	Container,
	Group,
	Header,
	Button,
} from '@mantine/core';
import { Link } from 'react-router-dom';
import AppMenu from './header/AppMenu';

const useStyles = createStyles((theme) => ({
	header: {
		backgroundColor: theme.fn.rgba(theme.black, 0.08),
	},

	inner: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: "7vh",
	},

	links: {
		width: 260,
	},

	link: {
		backgroundColor: "transparent",
		color: 'black',

		'&:hover': {
			backgroundColor: theme.colors.gray[0],
		},
	},

}));


interface AppHeaderProps {
	links: { label: string, link: string; }[];
}
export default function AppHeader({ links }: AppHeaderProps) {

	const { classes } = useStyles();

	const linkButtons = links.map((link) => (
		<Link to={link.link} style={{ textDecoration: 'none' }}>
			<Button
				mr={15}
				className={classes.link}
			>
				{link.label}
			</Button>
		</Link >
	));

	return (
		<Header className={classes.header} height={56} mb={120}>
			<Container className={classes.inner}>
				<Group className={classes.links} spacing={5}>
					{linkButtons}
				</Group>
				<AppMenu />
			</Container>
		</Header>
	);
}
