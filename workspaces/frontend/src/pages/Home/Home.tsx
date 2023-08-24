import { useContext, useEffect, useState } from "react";
import { Box, Card, CardBody, Progress, Text } from "@chakra-ui/react";
import AppMap from "../../components/Map";
import { trpc } from "../../common/trpc";
import FoundPokemonModal from "../../components/FoundPokemonModal";
import { IPokemon } from "@kyohealth/app-backend/src/common/types";
import PokemonCard from "../../components/PokemonCard";
import { UserContext } from "../../common/useUserContext";
import PleaseLoginModal from "../../components/PleaseLoginModal";

function HomePage() {
  const [userData] = useContext(UserContext);

  const [isUserClick, setIsUserClick] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTryingToCatchPokemon, setIsTryingToCatchPokemon] = useState(false);
  const [pokemonData, setPokemonData] = useState<IPokemon | null>(null);

  const {
    data: catchResultData,
    isLoading: isTryingToCatch,
    mutate,
  } = trpc.mapRouter.tryToCatchPokemon.useMutation();
  const {
    data,
    isFetching: isSearching,
    refetch,
  } = trpc.mapRouter.searchAreaForPokemons.useQuery(undefined, {
    refetchOnWindowFocus: false,
    enabled: false,
  });

  useEffect(() => {
    if (data?.length && isUserClick) setIsModalOpen(true);
  }, [data]);

  const handleMapClick = () => {
    setIsUserClick(true);
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

  return (
    <Box>
      <Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
        <AppMap onMapClick={handleMapClick} />

        <Card
          position="absolute"
          top="20px"
          left="50%"
          transform="translateX(-50%)"
        >
          <CardBody py="2" px="4">
            <Text fontWeight="bold">Click on a map to start searching for Pokemon's in that area</Text>
          </CardBody>
        </Card>

        <PleaseLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
        />

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
