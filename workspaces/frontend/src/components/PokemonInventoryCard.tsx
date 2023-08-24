import { Badge, Box, Card, CardBody, Image, Text } from "@chakra-ui/react";
import { InventoryPokemonType } from "../common/types";

interface Props {
  pokemonName: string;
  pokemonImg: string;
  type: InventoryPokemonType;
}

const POKEMON_TYPE: Record<
  InventoryPokemonType,
  { title: string; colorSchema: string }
> = {
  CATCHED: {
    title: "Catched",
    colorSchema: "green",
  },
  DISCOVERED: {
    title: "Discovered",
    colorSchema: "purple",
  },
};

function PokemonInventoryCard({ pokemonImg, pokemonName, type }: Props) {
  return (
    <Card p="2">
      <CardBody>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            opacity={type === "CATCHED" ? 1 : 0.3}
            width="100px"
            borderRadius="md"
            src={pokemonImg}
          />
          <Text fontWeight="bold">{pokemonName}</Text>
          <Badge
            borderRadius="md"
            colorScheme={POKEMON_TYPE[type].colorSchema}
            px="2"
            py="1"
            mt="4"
          >
            {POKEMON_TYPE[type].title}
          </Badge>
        </Box>
      </CardBody>
    </Card>
  );
}

export default PokemonInventoryCard;
