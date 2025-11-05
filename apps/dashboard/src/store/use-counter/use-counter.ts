import { defineStore } from "pinia";

import { setPokemon } from "./set-pokemon";

export const usePokemon = defineStore("pokemon", {
  state: () => ({ pokemon: [] as Array<any> }),
  actions: { setPokemon },
});
