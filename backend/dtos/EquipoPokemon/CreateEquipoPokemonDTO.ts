export class CreateEquipoPokemonDTO{
    private idEquipo: number;
    private pokemonid: number;
    private slot: number;

    private constructor(idEquipo: number, pokemonid: number, slot: number){
        this.idEquipo = idEquipo;
        this.pokemonid = pokemonid;
        this.slot = slot;
    }

    public static create(obj: unknown): CreateEquipoPokemonDTO{
        if (!obj) {
            throw new Error('equipoPokemon cannot be empty');
        }
        if (typeof obj !== 'object') {
            throw new Error('equipoPokemon must be an object');
        }

        const { idEquipo, pokemonid, slot } = obj as Record<string, unknown>;

        if (typeof idEquipo !== 'number' || Number.isNaN(idEquipo) || idEquipo <= 0){
            throw new Error('idEquipo is required');
        }
        if (typeof pokemonid !== 'number' || Number.isNaN(pokemonid) || pokemonid <= 0){
            throw new Error('pokemonid is required');
        }
        if (typeof slot !== 'number' || Number.isNaN(slot) || slot < 1 || slot > 6){
            throw new Error('slot must be a number between 1 and 6');
        }

        return new CreateEquipoPokemonDTO(idEquipo, pokemonid, slot);
    }
}