const express = require("express");
let { verificaToken } = require("../middlewares/autenticación");
const _ = require('underscore');
let app = express();

let Producto = require("../models/producto");



//============================
//Busqueda de producto
//============================

app.get('/producto/busqueda/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });


        });
});


//============================
//Mostrar todos los productos
//============================

app.get('/producto', (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registros: conteo
                });

            });
        });

});

//============================
//Mostrar una producto por ID
//============================

app.get('/producto/:id', (req, res) => {

    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado (id incorrecto)'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });

});


//============================
//Crear nueva producto
//============================

app.post('/producto', verificaToken, (req, res) => {
    //req.usuario._id

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });
    });
});

//============================
//Actualiza producto por id
//============================

app.put('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'categoria', 'disponible']);

    // let body = req.body;
    // let descCategoria = {
    //     descripcion: body.descripcion
    // };

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//============================
//Eliminar la producto por ID
//============================

app.delete('/producto/:id', verificaToken, (req, res) => {
    //Producto.findById


    //======Eliminado físico=====

    // let id = req.params.id;
    // Producto.findByIdAndRemove(id, (err, productoDB) => {
    //     if (err) {
    //         return res.status(500).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     if (!productoDB) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     }
    //     res.json({
    //         ok: true,
    //         message: "Producto Borrado",
    //         producto: productoDB
    //     });
    // });

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    };
    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        });

    });


});
module.exports = app;