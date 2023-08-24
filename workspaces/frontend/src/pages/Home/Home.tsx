import { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
} from "@chakra-ui/react";
import AppMap from "../../components/Map";
import { trpc } from "../../trpc";
import FoundPokemonModal from "../../components/FoundPokemonModal";
import { IPokemon } from "@kyohealth/app-backend/src/common/types";
import PokemonCard from "../../components/PokemonCard";
import { UserContext } from "../../common/useUserContext";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../common/routes";

function HomePage() {
  const [userData] = useContext(UserContext);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTryingToCatchPokemon, setIsTryingToCatchPokemon] = useState(false);
  const [pokemonData, setPokemonData] = useState<IPokemon | null>(null);

  const {
    data: catchResultData,
    isLoading: isTryingToCatch,
    mutate,
  } = trpc.mapRouter.tryToCatchPokemon.useMutation();
  const { data, isFetching, refetch } =
    trpc.mapRouter.searchAreaForPokemons.useQuery(undefined, {
      refetchOnWindowFocus: false,
      enabled: false,
    });

  useEffect(() => {
    if (data?.length) setIsModalOpen(true);
  }, [data]);

  const handleMapClick = () => {
    refetch();
  };

  const handleTryToCatchPokemon = (pokemonData: IPokemon) => {
    if (!userData) {
      setIsModalOpen(false);
      setIsLoginModalOpen(true);
      return;
    }

    setIsModalOpen(false);
    setPokemonData(pokemonData);
    setIsTryingToCatchPokemon(true);
    mutate(
      { id: pokemonData.id },
      {
        onSuccess: () => {
          setTimeout(() => {
            setIsTryingToCatchPokemon(false);
            setPokemonData(null);
          }, 700);
        },
      }
    );
  };

  const isSearching = isFetching;

  return (
    <Box>
      <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
        <AppMap onMapClick={handleMapClick} />

        <Modal
          isCentered
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              <Text>Please log in or sign up</Text>
            </ModalHeader>
            <ModalBody>
              <Text>
                This action requires you to be authenticated please log in or
                sign up to the platform
              </Text>
            </ModalBody>
            <ModalFooter>
              <Button mr="2" onClick={() => setIsLoginModalOpen(false)}>
                Close
              </Button>
              <Link to={APP_ROUTES.PROFILE}>
                <Button colorScheme="green">Log in / Sign up</Button>
              </Link>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <FoundPokemonModal
          isOpen={isModalOpen}
          pokemonList={data ?? []}
          onClose={() => setIsModalOpen(false)}
          onPokemonCatchClick={handleTryToCatchPokemon}
        />

        {isTryingToCatchPokemon && (
          <Box
            p="4"
            borderRadius="md"
            backgroundColor="white"
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <PokemonCard pokemonData={pokemonData!} />
            {isTryingToCatch && (
              <>
                <Progress width="100%" my="2" size="xs" isIndeterminate />
                <Text mt="1">Trying to catch</Text>
              </>
            )}
            {!isTryingToCatch && (
              <Text
                color={catchResultData?.catched ? "green.400" : "red.400"}
                mt="2"
              >
                {catchResultData?.catched ? "Catched :)" : "Failed to catch :("}
              </Text>
            )}
          </Box>
        )}

        {isSearching && (
          <Box
            p="4"
            borderRadius="md"
            backgroundColor="white"
            position="absolute"
            bottom="50px"
            left="50%"
            transform="translateX(-50%)"
          >
            <Progress size="xs" isIndeterminate />
            <Text mt="1">Searching for Pokemons</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}

export default HomePage;
