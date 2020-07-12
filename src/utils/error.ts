type InputError = {
    path: string;
    message: string;
}

export const inputError = (errors: InputError | InputError[]) => {        
    return {
        invalidArgs: Array.isArray(errors) ? errors : [errors]
    }
}