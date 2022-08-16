const isAuth = (req, res, next) => {
    if (req.session.user) next();
    else next('route');
}

const isAdmin = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.role === 'admin') {
            next();
        } else {
            next('route');
        }
    }
    else next('route');
}


function hasLowerCase(str) {
    return (/[a-z]/.test(str));
}
function hasUpperCase(str) {
    return (/[A-Z]/.test(str));
}
function hasSpecialCharacters(str) {
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialChars.test(str);
}
function validator(password) {
    if(!hasLowerCase(password)){return false;}
    if(!hasUpperCase(password)){return false;}
    if(!hasSpecialCharacters(password)){return false;}
    if(password.length <=7){return false;}
    return true;
}

module.exports = {
    isAuth,
    validator,
    isAdmin
}