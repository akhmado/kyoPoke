import { protectedProcedure, publicProcedure, router } from "../trpc/trpc";
import axios from "axios";
import { IPokemon } from "../common/types";
import { generateRandomNumberInRange } from "../common/utils";
import z from "zod";
import { prismaClient } from "../common/prisma";

export const mapRouter = router({
  searchAreaForPokemons: publicProcedure.query(async () => {
    const { data } = await axios.get("https://pokeapi.co:443/api/v2/pokemon/", {
      params: {
        limit: generateRandomNumberInRange(0, 5),
        offset: generateRandomNumberInRange(1, 1010),
      },
    });

    const promises = data.results.map(async (item: any) => {
      const { data } = await axios.get(item.url);
      return data;
    });

    const pokemonsListData = await Promise.all(promises);
    return pokemonsListData as IPokemon[];
  }),

  tryToCatchPokemon: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const response = await axios.get(
        `https://pokeapi.co:443/api/v2/pokemon/${input.id}`
      );

      const pokemonData = response.data as IPokemon;
      const catched = generateRandomNumberInRange(0, 100) > 50;

      await prismaClient.pokemon.create({
        data: {
          name: pokemonData.name,
          img: pokemonData.sprites.front_default,
          userId: ctx.user?.id,
          pokemonID: pokemonData.id,
          type: catched ? "CATCHED" : "DISCOVERED"
        },
      });

      return { catched };
    }),
});
