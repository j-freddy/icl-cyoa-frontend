import { Container, Loader, TextInput } from "@mantine/core";
import { useEffect } from "react";
import GPT3KeyForm from "../../components/account/GPT3KeyForm";
import { getApiKey, selectApiKey, selectEmail } from "../../store/features/accountSlice";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

function AccountView() {

  const dispatch = useAppDispatch();

  const email = useAppSelector(selectEmail);
  const apiKey = useAppSelector(selectApiKey);


  useEffect(() => {
    dispatch(getApiKey());
  }, [dispatch]);


  const AccountData = () => {
    if (apiKey === undefined) {
      return (
        <div className={"loader"}>
          <Loader />
        </div>
      );
    }

    return (
      <>
        <TextInput label="Email" variant="filled" disabled={true} mb="lg"
          value={email}
        />
        <GPT3KeyForm apiKey={apiKey} />
      </>
    )
  }


  return (
    <Container className="wrapper">
      <AccountData />
    </Container>
  );
}

export default AccountView;

