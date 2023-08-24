import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
} from "@chakra-ui/react";
import { IPokemon } from "@kyohealth/app-backend/src/common/types";
import PokemonCard from "./PokemonCard";

interface Props {
  onClose: () => void;
  pokemonList: IPokemon[];
  isOpen: boolean;
  onPokemonCatchClick: (data: IPokemon) => void;
}

function FoundPokemonModal({
  onClose,
  isOpen,
  pokemonList,
  onPokemonCatchClick,
}: Props) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Found Pokemons</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          sx={{ overflowY: "scroll", maxHeight: "calc(100vh - 50vh)" }}
        >
          <SimpleGrid columns={2} spacing={3}>
            {pokemonList.map((pokemon) => (
              <PokemonCard
                key={pokemon.id}
                pokemonData={pokemon}
                onCatchClick={onPokemonCatchClick}
              />
            ))}
          </SimpleGrid>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default FoundPokemonModal;
