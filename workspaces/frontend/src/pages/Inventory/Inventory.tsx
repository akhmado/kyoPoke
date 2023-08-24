import {
  Box,
  Button,
  Center,
  Progress,
  Radio,
  RadioGroup,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { trpc } from "../../common/trpc";
import PokemonInventoryCard from "../../components/PokemonInventoryCard";
import { InventoryPokemonType } from "../../common/types";
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { APP_ROUTES } from "../../common/routes";
import { UserContext } from "../../common/useUserContext";

type FilterTypes = InventoryPokemonType | "ALL";

function InventoryPage() {
  const [userData] = useContext(UserContext);
  const [filterBy, setFilterBy] = useState<FilterTypes>("ALL");

  const { data, isLoading } = trpc.inventoryRouter.getMyInventory.useQuery({
    filterBy: filterBy === "ALL" ? undefined : filterBy,
  }, { enabled: !!userData });

  return (
    <Box p="4">
      <Text fontWeight="bold" fontSize="2xl">
        Your pokemon inventory
      </Text>

      {!userData && (
        <Center mt="10" flexDirection="column">
          <Text>Please log in to view your inventory</Text>
          <Link to={APP_ROUTES.PROFILE}>
            <Button variant="outline" mt="2">Log in</Button>
          </Link>
        </Center>
      )}

      {!!userData && (
        <Box>
          <Box p="2">
            <Text>Filters</Text>
            <RadioGroup
              onChange={(v) => setFilterBy(v as FilterTypes)}
              value={filterBy}
            >
              <Stack direction="row">
                <Radio value={"ALL"}>All</Radio>
                <Radio value={"CATCHED"}>Catched</Radio>
                <Radio value={"DISCOVERED"}>Discovered</Radio>
              </Stack>
            </RadioGroup>
          </Box>
          <Box>
            {!isLoading && !!data?.length && (
              <SimpleGrid mt="4" columns={5} spacing={4}>
                {data.map((item) => (
                  <PokemonInventoryCard
                    key={item.id}
                    pokemonName={item.name!}
                    pokemonImg={item.img!}
                    type={item.type as InventoryPokemonType}
                  />
                ))}
              </SimpleGrid>
            )}

            {!isLoading && !data?.length && (
              <Center mt="4" flexDirection="column">
                <Text mt="2" fontSize="md" colorScheme="blackAlpha">
                  You have no pokemon's yet
                </Text>
                <Link to={APP_ROUTES.HOME}>
                  <Button mt="2" variant="outline">
                    Find pokemon's
                  </Button>
                </Link>
              </Center>
            )}

            {isLoading && (
              <Progress width="100%" mt="4" size="xs" isIndeterminate />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default InventoryPage;
