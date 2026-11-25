export class CreateUserDTO{
    private name: string;
    private puntaje: string;

    private constructor(name: string, puntaje: string){
        this.name = name;
        this.puntaje = puntaje;
    }

    public static create(obj: unknown): CreateUserDTO{
        if (!obj) {
            throw new Error('user cannot be empty');
        }
        if (typeof obj !== 'object') {
            throw new Error('user must be an object');
        }

        const { name, email } = obj as Record<string, unknown>;

        if (!name || typeof name !== 'string' || !name.trim()){
            throw new Error('name is required');
        }

        if (
            !email ||
            typeof email !== 'string' ||
            !email.trim() ||
            !/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(
                email.trim()
            )
        ){
            throw new Error('email is required');
        }

        return new ResponseUserDTO(name.trim(), email.trim());
    }
}