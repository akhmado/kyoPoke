import { Box, Button, Card, CardBody, Input, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { trpc } from "../../trpc";
import { removeAuthToken, setAuthToken } from "../../common/utils";
import { UserContext } from "../../common/useUserContext";

function Profile() {
  const [form, setForm] = useState({
    email: "test@test.com",
    password: "123456",
  });

  const utils = trpc.useContext();
  const [userData, setUserData] = useContext(UserContext);
  const { mutate: logIn } = trpc.authRouter.logIn.useMutation();
  const { mutate: signUp } = trpc.authRouter.signUp.useMutation();

  const handleLogIn = () => {
    logIn(form, {
      onSuccess: async (data) => {
        setAuthToken(data.token!);
        await utils.authRouter.getUser.reset();
      }
    });
  };

  const handleSignUp = () => {
    signUp(form, {
      onSuccess: (data) => {
        alert(data.msg);
      },
    });
  };

  const handleLogout = () => {
    removeAuthToken();
    setUserData?.(null);
  };

  return (
    <Box
      p="4"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* {isFetching && <Progress width="100%" mt="4" size="xs" isIndeterminate />} */}

      {userData && (
        <Card p="2">
          <CardBody>
            <Text>Hello {userData.email}</Text>
            <Button mt="2" onClick={handleLogout}>
              Log out
            </Button>
          </CardBody>
        </Card>
      )}

      {!userData && (
        <Card width="30%" p="2">
          <CardBody>
            <Text>Login or Signup</Text>
            <Input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              mt="2"
              placeholder="Email"
            />
            <Input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              mt="2"
              placeholder="Password"
            />
            <Box mt="2">
              <Button onClick={handleLogIn}>Login</Button>
              <Button ml="1" onClick={handleSignUp}>
                Sign Up
              </Button>
            </Box>
          </CardBody>
        </Card>
      )}
    </Box>
  );
}

export default Profile;
