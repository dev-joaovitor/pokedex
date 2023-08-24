import { Pokemon } from "./pokemon.model.js";


const createPokemonByDetails = (pokemonDetails) => {
    const pokemon = new Pokemon();

    pokemon.id =  pokemonDetails.id;
    pokemon.name = pokemonDetails.name
    pokemon.height = pokemonDetails.height;
    pokemon.weight = pokemonDetails.weight;
    pokemon.stats = {}

    for (const stat of pokemonDetails.stats){
        pokemon.stats[stat.stat.name] = stat.base_stat;
    }

    const types = pokemonDetails.types.map(typeSlot => typeSlot.type.name);
    const [ type ] = types;

    pokemon.types = types;
    pokemon.mainType = type;

    pokemon.image = pokemonDetails.sprites.other.dream_world.front_default;

    return pokemon;
}

const getPokemonDetails = async (pokemon) => {
    const url = pokemon.url;
    const response = await fetch(url);
    const pokemonDetails = await response.json();

    return createPokemonByDetails(pokemonDetails)
}

const loadPokemon = async (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`;

    const response = await fetch(url);
    const pokemons = await response.json();
    const pokemonPromiseList = pokemons.results.map(getPokemonDetails)
    const pokemonList = await Promise.all(pokemonPromiseList)

    console.log(pokemonList);
}

export {
    loadPokemon
}