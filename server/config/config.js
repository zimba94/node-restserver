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
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//=============
//Vencimiento del token
//=============

process.env.CADUCIDAD_TOKEN = '48h';

//=============
//SEED de autenticación
//=============

process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo-secret';


//=============
//Google client
//=============

process.env.CLIENT_ID = process.env.CLIENT_ID || '389739681529-d7jcjlo6n0olm6c7302hqjcn6egt7qls.apps.googleusercontent.com';