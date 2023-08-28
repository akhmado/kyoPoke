import { Box, Button, Card, CardBody, Input, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { trpc } from "../../common/trpc";
import { removeAuthToken, setAuthToken } from "../../common/utils";
import { UserContext } from "../../common/useUserContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

const validationSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password should be no less than 6 characters" }),
});

const defaultValues = {
  email: "",
  password: "",
};

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues,
  });

  const utils = trpc.useContext();
  const [userData, setUserData] = useContext(UserContext);
  const { mutate: logIn } = trpc.authRouter.logIn.useMutation();
  const { mutate: signUp } = trpc.authRouter.signUp.useMutation();

  const handleLogIn = (form: typeof defaultValues) => {
    logIn(form, {
      onSuccess: async (data) => {
        setAuthToken(data.token!);
        await utils.authRouter.getUser.reset();
      },
      onError: () => {
        alert("Error occurred");
        removeAuthToken();
        setUserData?.(null);
      },
    });
  };

  const handleSignUp = (form: typeof defaultValues) => {
    signUp(form, {
      onSuccess: (data) => {
        alert(data.msg);
      },
      onError: () => {
        alert("Error occurred");
        removeAuthToken();
        setUserData?.(null);
      },
    });
  };

  const handleLogout = async () => {
    removeAuthToken();
    setUserData?.(null);
    await utils.inventoryRouter.getMyInventory.reset();
  };

  return (
    <Box
      p="4"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
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
        <Card
          sx={{
            flex: 1,
            maxWidth: {
              md: "40%",
            },
          }}
        >
          <CardBody>
            <Text>Login or Sign up</Text>
            <Box>
              <Input
                isInvalid={!!errors.email}
                {...register("email")}
                placeholder="Email"
                mt="2"
              />
              <Text color="red" fontSize="sm">
                {errors.email?.message}
              </Text>
            </Box>
            <Box>
              <Input
                type="password"
                isInvalid={!!errors.password}
                {...register("password")}
                placeholder="Password"
                mt="2"
              />
              <Text color="red" fontSize="sm">
                {errors.password?.message}
              </Text>
            </Box>
            <Box mt="2">
              <Button onClick={handleSubmit(handleLogIn)}>Login</Button>
              <Button ml="1" onClick={handleSubmit(handleSignUp)}>
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
