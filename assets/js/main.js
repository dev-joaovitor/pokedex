// const limit = 10,
//       offset = 0,
//       pokemonUrl = `https://pokeapi.co/api/v2/pokemon?offset=${offset}}&limit=${limit}`

import { loadPokemon } from "./pokemon.api.js";

const pokedexContent = document.getElementById("pokedexContent");
const pokemonList = document.getElementById("pokemonList");
const pokemonDetailCard = document.getElementById("pokemonDetailCard");
const loadMoreButton = document.getElementById("loadMoreButton");

const listedPokemons = [];
let offset = 0,
    limit = 5;
const maxCards = 32;

const displayPokemonDetails = (pokemonId) => {
    const {
        id,
        name,
        weight,
        height,
        image,
        mainType,
        types,
        stats,
    } = listedPokemons[pokemonId-1][pokemonId];

    const newHtml = `
        <article class="pokemonCard pokemonDetailCard ${mainType}">
            <span class="number">#${id}</span>
            <div class="details">
                <img src="${image}" alt="${name}">
                <span class="name ${mainType}">${name}</span>
            </div>
            ${types.map((type) => `<span class="types ${mainType}">${type}</span>`).join("")}
            <div class="stats ${mainType}">
                <span>Height
                    <span>${height}</span>
                </span>
                <span>Weight
                    <span>${weight}</span>
                </span>
                <span>HP
                    <span>${stats.hp}</span>
                </span>
                <span>Attack
                    <span>${stats.attack}</span>
                </span>
                <span>Defense
                    <span>${stats.defense}</span>
                </span>
                <span>Sp. Atk
                    <span>${stats["special-attack"]}</span>
                </span>
                <span>Sp. Def
                    <span>${stats["special-defense"]}</span>
                </span>
                <span>Speed
                    <span>${stats.speed}</span>
                </span>
                <span>Total
                    <span>${stats.total}</span>
                </span>
            </div>
            <button id="closeDetailCardButton" type="button">
                Close
            </button>
        </article>
    `

    pokemonDetailCard.innerHTML = newHtml;

    const closeDetailCardButton = document.getElementById("closeDetailCardButton");

    closeDetailCardButton.addEventListener("click", () => {
        pokemonDetailCard.classList.toggle("detailCardClosed");
        pokedexContent.classList.toggle("detailCardClosed");
    })
    
}

function displayPokemonCards(pokemonDataList){
    
    const newHtml = pokemonDataList.map((pokemon) => {
        const {
            id,
            name,
            image,
            mainType,
            types,
        } = pokemon;
        
        if (listedPokemons.length >= id) return;
        
        listedPokemons.push({ [id]: pokemon })
        console.log(listedPokemons);
        

        const li = `
        <li class="pokemonCard ${mainType}" id="pokemonNumber${id}">
        <span class="number">#${id}</span>
            <div class="details">
            <img src="${image}" alt="${name}">
            <span class="name ${mainType}">${name}</span>
            </div>
            ${types.map((type) => `<span class="types ${mainType}">${type}</span>`).join("")}
            <button class="moreInfoButton" type="button">
                More Info
            </button>
            </li>
            `

        return li;
    });
    
    pokemonList.innerHTML += newHtml.join("");
    
    const moreInfoButtons = document.querySelectorAll(".moreInfoButton");

    for (const moreInfoButton of moreInfoButtons){
        moreInfoButton.addEventListener("click", (e) => {
            const pokemonId = (e.target.parentElement.id).split("pokemonNumber")[1];
            console.log(pokemonId);
            displayPokemonDetails(pokemonId);

            pokemonDetailCard.classList.toggle("detailCardClosed");
            pokedexContent.classList.toggle("detailCardClosed");

        })
    }
}

displayPokemonCards(await loadPokemon(offset, limit))

loadMoreButton.addEventListener("click", async () => {
    offset += limit;
    const nextOffset = offset + limit;

    if (nextOffset >= maxCards){
        limit = maxCards - offset;
        loadMoreButton.parentElement.removeChild(loadMoreButton);
    }


    displayPokemonCards(await loadPokemon(offset, limit))
})