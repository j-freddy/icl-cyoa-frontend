import { Group, Stack, PasswordInput, Text, Button, Title, TextInput, createStyles } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  login,
  loginWithSession,
  selectCredentialLoginFail,
  selectLoggedIn
} from "../../store/features/accountSlice";
import { DASHBOARD_PAGE, SIGNUP_PAGE } from "../../utils/pages";

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

const LoginView = () => {
  const { classes } = useStyles();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const loggedIn = useAppSelector(selectLoggedIn);
  const credentialsLoginFail = useAppSelector(selectCredentialLoginFail);

  useEffect(() => {
    if (!loggedIn) dispatch(loginWithSession());
  }, [dispatch, loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      navigate(DASHBOARD_PAGE);
    }
  }, [loggedIn, navigate]);

  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const loginSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatch(login({ email, password }));
  }

  return (
    <Group
      className={classes.box}>
      <Stack className={classes.stack} >
        <Title order={2}>Log In</Title>


        <form onSubmit={loginSubmit}>
          <TextInput
            label="Email"
            variant="filled"
            placeholder="your@email.com"
            value={email}
            onChange={(event: any) => setEmail(event.target.value)}
            mb="lg"
          />

          <PasswordInput
            placeholder="Password"
            label="Password"
            variant="filled"
            value={password}
            onChange={(event: any) => setPassword(event.target.value)}
          />
          {
            credentialsLoginFail
            &&
            <Text fz="xs" c="red">Invalid credentials.</Text>
          }


          <Stack mt="md">
            <Button
              type="submit"
              variant="gradient"
              gradient={{ from: 'violet', to: 'blue' }}>
              Login
            </Button>
            <Group position="center">
              <Link to={SIGNUP_PAGE}>
                <Text fz="sm" c="blue" td="underline">
                  Register here.
                </Text>
              </Link>
            </Group>
          </Stack>
        </form>
      </Stack>
    </Group>
  )

}

export default LoginView;
