export class CreateEquipoDTO{
    private idUser: number;

    private constructor(idUser: number){
        this.idUser = idUser;
    }

    public static create(obj: unknown): CreateEquipoDTO{
        if (!obj) {
            throw new Error('equipo cannot be empty');
        }
        if (typeof obj !== 'object') {
            throw new Error('equipo must be an object');
        }

        const { idUser } = obj as Record<string, unknown>;

        if (typeof idUser !== 'number' || Number.isNaN(idUser) || idUser <= 0){
            throw new Error('idUser is required');
        }

        return new CreateEquipoDTO(idUser);
    }
}