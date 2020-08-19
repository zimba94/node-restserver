//================
//Verificar token
//================
const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token inválido"
                }
            });
        }
        req.usuario = decoded.usuario;
    });
    next();
};


let verificaRolAdmin = (req, res, next) => {
    let usuario = req.usuario; //authorization


    // if (usuario.rol != 'ADMIN_ROL') {
    //     return res.status(401).json({
    //         ok: false,
    //         err: {
    //             message: "El usuario no es administrador"
    //         }
    //     });
    // }
    // next();

    if (usuario.rol === 'ADMIN_ROL') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; //authorization

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: "Token inválido"
                }
            });
        }
        req.usuario = decoded.usuario;
    });
    next();
};

module.exports = {
    verificaToken,
    verificaRolAdmin,
    verificaTokenImg
}