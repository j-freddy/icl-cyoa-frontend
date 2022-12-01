import { TextInput, } from "@mantine/core";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ApiKeyForm from "../../components/account/ApiKeyForm";
import { getApiKey, loginWithSession, selectEmail, selectLoggedIn, selectSessionLoginFail } from "../../features/accountSlice";
import { LOGIN_PAGE } from "../../utils/links";

const AccountView = () => {

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const loggedIn = useAppSelector(selectLoggedIn);
  const sessionLoginFail = useAppSelector(selectSessionLoginFail);
  const email = useAppSelector(selectEmail);


  useEffect(
    () => {
      if (!loggedIn) {
        dispatch(loginWithSession());
      }
    },
    [dispatch, loggedIn]
  );

  useEffect(
    () => {
      if (!loggedIn && sessionLoginFail) {
        navigate(LOGIN_PAGE);
      }
    },
    [loggedIn, sessionLoginFail, navigate]
  );

  useEffect(() => {
    if (loggedIn) {
      dispatch(getApiKey);
    }
  })


  return (
    <Container>

      <TextInput
        label="Email"
        variant="filled"
        value={email}
        disabled={true}
        mb="lg"
      />

      <ApiKeyForm />

    </Container>
  );

}

export default AccountView;
