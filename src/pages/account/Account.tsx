import { Container, TextInput } from "@mantine/core";
import GPT3KeyForm from "../../components/account/GPT3KeyForm";
import { selectEmail } from "../../store/features/accountSlice";
import { useAppSelector } from "../../store/hooks";

const AccountView = () => {

  const email = useAppSelector(selectEmail);

  return (
    <Container>
      <TextInput label="Email" variant="filled" disabled={true} mb="lg"
        value={email}
      />
      <GPT3KeyForm />
    </Container>
  );

}

export default AccountView;
