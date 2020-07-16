//=============
//====Puerto===
//=============

process.env.PORT = process.env.PORT || 3000;


//=============
//==Entonrno===
//=============
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//=============
//Base de Datos
//=============

let urlDB;

if (process.env.NODE_ENV == 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://simba94:wYSqTJdA6uL1EnPL@cluster0.oifdj.mongodb.net/cafe';
}

process.env.URLDB = urlDB;