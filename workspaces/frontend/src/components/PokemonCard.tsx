import { Box, Button, Card, CardBody, Image, Text } from "@chakra-ui/react";
import { IPokemon } from "@kyohealth/app-backend/src/common/types";

interface Props {
  pokemonData: IPokemon;
  onClick?: (data: IPokemon) => void;
  onCatchClick?: (data: IPokemon) => void;
  hideCatchButton?: boolean;
}

function PokemonCard({ pokemonData, onClick, onCatchClick }: Props) {
  return (
    <Card onClick={() => onClick?.(pokemonData)} sx={{ cursor: "pointer" }}>
      <CardBody>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Image
            width="100px"
            borderRadius="md"
            src={pokemonData.sprites.front_default}
          />
          <Text fontWeight="bold">{pokemonData.name}</Text>
          {onCatchClick != undefined && (
            <Button onClick={() => onCatchClick?.(pokemonData)} mt="2">
              Try to catch
            </Button>
          )}
        </Box>
      </CardBody>
    </Card>
  );
}

export default PokemonCard;
