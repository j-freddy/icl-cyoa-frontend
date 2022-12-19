import { Button, createStyles, Group, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StatusCode from "status-code-enum";
import { reqSignup } from "../../api/rest/accountRequests";
import { GENERATOR_PAGE, LOGIN_PAGE } from "../../utils/pages";

const useStyles = createStyles((theme, _params) => ({
	box: {
		width: "100vw",
		height: "92vh",
		alignItems: "center",
	},
	stack: {
		backgroundColor: theme.white,
		height: 380,
		width: 320,
		borderRadius: 6,
		boxShadow: theme.shadows.md,
		padding: 20,
		margin: "auto",
		alignItems: "center"
	}
}))

const SignupView = () => {
	const { classes } = useStyles();
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [loginError, setLoginError] = useState(false);


	const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const response = await reqSignup(email, password);
		if (response.status === StatusCode.ClientErrorUnauthorized) {
			setLoginError(true);
			return;
		}
		navigate(GENERATOR_PAGE);
	};


	return (
		<Group
			className={classes.box}>
			<Stack className={classes.stack}>
				<Title order={2} c="black">Sign Up</Title>
				<form onSubmit={loginSubmit}>
					<TextInput
						label="Email"
						variant="filled"
						placeholder="your@email.com"
						value={email}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
						mb="lg"
					/>

					<PasswordInput
						placeholder="Password"
						label="Password"
						variant="filled"
						value={password}
						onChange={(event: React.ChangeEvent<HTMLInputElement>) => setPassword(event.target.value)}
					/>
					{loginError &&
						<Text fz="xs" c="red">Invalid credentials.</Text>
					}


					<Stack mt="md">
						<Button
							type="submit"
							variant="gradient"
							gradient={{ from: 'cyan', to: 'indigo' }}>
							Sign Up
						</Button>
						<Group position="center">
							<Link to={LOGIN_PAGE}>
								<Text fz="sm" c="blue" td="underline">
									Already a user? LOGIN.
								</Text>
							</Link>
						</Group>
					</Stack>
				</form>
			</Stack>
		</Group>
	);
};

export default SignupView;
