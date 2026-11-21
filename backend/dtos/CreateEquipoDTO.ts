/*export class CreateEquipoDTO{
    private Pkm1: string;
    private Pkm2: string;
    private Pkm3: string;
    private Pkm4: string;
    private Pkm5: string;
    private Pkm6: string;
    private idUser: number;

    private constructor(
        Pkm1: string,
        Pkm2: string,
        Pkm3: string,
        Pkm4: string,
        Pkm5: string,
        Pkm6: string,
        idUser: number
    ){
        this.Pkm1 = Pkm1;
        this.Pkm2 = Pkm2;
        this.Pkm3 = Pkm3;
        this.Pkm4 = Pkm4;
        this.Pkm5 = Pkm5;
        this.Pkm6 = Pkm6;
        this.idUser = idUser;
    }

    public static create(obj: unknown): CreateEquipoDTO{
        if (!obj){
            throw new Error('equipo cannot be empty');
        }
        if (typeof obj !== 'object'){
            throw new Error('equipo must be an object');
        }

        const { Pkm1, Pkm2, Pkm3, Pkm4, Pkm5, Pkm6, idUser } = obj as Record<string, unknown>;

        if (!Pkm1 || typeof Pkm1 !== 'string' || !Pkm1.trim()){
            throw new Error('Pkm1 is required');
        }
        if (!Pkm2 || typeof Pkm2 !== 'string' || !Pkm2.trim()){
            throw new Error('Pkm2 is required');
        }
        if (!Pkm3 || typeof Pkm3 !== 'string' || !Pkm3.trim()){
            throw new Error('Pkm3 is required');
        }
        if (!Pkm4 || typeof Pkm4 !== 'string' || !Pkm4.trim()){
            throw new Error('Pkm4 is required');
        }
        if (!Pkm5 || typeof Pkm5 !== 'string' || !Pkm5.trim()){
            throw new Error('Pkm5 is required');
        }
        if (!Pkm6 || typeof Pkm6 !== 'string' || !Pkm6.trim()){
            throw new Error('Pkm6 is required');
        }
        if (!idUser || typeof idUser !== 'number' || Number.isNaN(idUser) || idUser <= 0) {
            throw new Error('idUser is required');
        }

        return new CreateEquipoDTO(
            Pkm1.trim(),
            Pkm2.trim(),
            Pkm3.trim(),
            Pkm4.trim(),
            Pkm5.trim(),
            Pkm6.trim(),
            idUser
        );
    }
}

*/
