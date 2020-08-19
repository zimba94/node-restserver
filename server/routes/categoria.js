const express = require("express");
let { verificaToken, verificaRolAdmin } = require("../middlewares/autenticacion");
let app = express();

let Categoria = require("../models/categoria");
let Usuario = require("../models/usuario");


//============================
//Mostrar Todas las categorias
//============================

app.get('/categoria', (req, res) => {

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count((err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    registros: conteo
                });

            });
        });

});

//============================
//Mostrar una categoria por ID
//============================

app.get('/categoria/:id', (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada (id incorrecto)'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


//============================
//Crear nueva categoria
//============================

app.post('/categoria', verificaToken, (req, res) => {
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================
//Actualiza categoria por id
//============================

app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    //let body = _.pick(req.body, ['descripcion', 'nombre', 'email', 'img', 'rol', 'estado']);
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//============================
//Eliminar la categoria por ID
//============================

app.delete('/categoria/:id', [verificaToken, verificaRolAdmin], (req, res) => {
    //solo un adm puede eliminar una 
    //Categoria.findById

    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            message: "Categoria Borrada",
            categoria: categoriaDB
        });
    });
});
module.exports = app;