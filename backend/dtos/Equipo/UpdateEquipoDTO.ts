export class UpdateEquipoDTO {
    private idEquipo: number;
    private idUser?: number;

    private constructor(idEquipo: number, idUser?: number){
        this.idEquipo = idEquipo;
        this.idUser = idUser;
    }

    public static create(obj: unknown): UpdateEquipoDTO{
        if (!obj) {
            throw new Error('equipo cannot be empty');
        }
        if (typeof obj !== 'object') {
            throw new Error('equipo must be an object');
        }

        const { idEquipo, idUser } = obj as Record<string, unknown>;

        if (typeof idEquipo !== 'number' || Number.isNaN(idEquipo) || idEquipo <= 0){
            throw new Error('idEquipo is required');
        }
        if (
            idUser !== undefined &&
            (typeof idUser !== 'number' || Number.isNaN(idUser) || idUser <= 0)
        ) {
            throw new Error('idUser must be a valid number');
        }

        return new UpdateEquipoDTO(idEquipo, idUser);
    }
}