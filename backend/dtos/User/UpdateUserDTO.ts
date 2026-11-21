export class UpdateUserDTO{
    private idUser: number;
    private name?: string;
    private email?: string;

    private constructor(idUser: number, name?: string, email?: string){
        this.idUser = idUser;
        this.name = name;
        this.email = email;
    }

    public static create(obj: unknown): UpdateUserDTO{
        if (!obj) {
            throw new Error('user cannot be empty');
        }
        if (typeof obj !== 'object') {
            throw new Error('user must be an object');
        }

        const { idUser, name, email } = obj as Record<string, unknown>;

        if (typeof idUser !== 'number' || Number.isNaN(idUser) || idUser <= 0){
            throw new Error('idUser is required');
        }
        if (name !== undefined && (typeof name !== 'string' || !name.trim())){
            throw new Error('name must be a valid string');
        }
        if (
            email !== undefined &&
            (typeof email !== 'string' ||
                !email.trim() ||
                !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
                    email.trim()
                ))
        ) {
            throw new Error('email must be a valid email');
        }

        return new UpdateUserDTO(idUser, name?.trim(), email?.trim());
    }
}