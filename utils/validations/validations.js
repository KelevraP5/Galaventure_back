exports.emailCheck = (email) => {
    const emailCheck = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailCheck.test(email)) {
        throw new Error("Veuillez rentrer une adresse mail valide");
    }
}

exports.pseudoCheck = (pseudo) => {
    const pseudoCheck = /^(?=.*[a-zA-Z])[a-zA-Z0-9!@#$%^&*()_+{}\[\]:;"'<>,.?/|`~-]+$/;
    const onlyDigitsCheck = /^\d+$/;

    if (pseudo.length < 3){
        throw new Error('Le pseudo doit faire au moins 3 caractères');
    } else if (pseudo.length > 15) {
        throw new Error('Le pseudo doit faire moins de 15 caractères')
    }

    if (onlyDigitsCheck.test(pseudo)) {
        throw new Error("Le pseudo ne peut pas être composé que de chiffres ou caractères spéciaux");
    }

    if (!pseudoCheck.test(pseudo)) {
        throw new Error("Le pseudo doit contenir au moins un caractère alphabétique");
    }
}

exports.passwordCheck = (password) => {
    const passwordCheck = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/;

    if (password.length < 8) {
        throw new Error('Le mot de passe doit faire au moins 8 caractères');
    }

    if (!passwordCheck.test(password)) {
        throw new Error('Le mot de passe doit contenir une lettre minuscule, majuscule, un chiffre et un caractère spécial');
    }
}



