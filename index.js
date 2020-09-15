const fetch = require('node-fetch').default
const url = require('url')

require('dotenv').config()

function DoLoginLanzadera(redirect) {
    const urlParts = url.parse(redirect)
    const token = urlParts.query

    const bodyParts = {
        "4Tredir": 'http://www.msftconnecttest.com/redirect',
        magic: token,
        username: process.env.USER,
        password: process.env.PASS
    }

    const queryBodyString = new URLSearchParams(bodyParts).toString()

    console.log('Conectando a internet a través de Lanzadera con tu usuario "%s"', process.env.USER)

    return fetch(`http://${urlParts.host}`, {
        method: 'POST',
        body: queryBodyString
    }).then(() => {
        console.log('')
    }).catch(err => {
        console.log(err)
        console.log('ALGO SALIO MAL. ¿USUARIO Y CONTRASEÑA INCORRECTOS?')
    })

}

function IsLanzaderaLoginNeeded() {
    const reg = /^http:\/\/172./
    return fetch('http://www.msftconnecttest.com/redirect').then(res => {
        if (res.status === 200 && reg.exec(res.url)) {
            return DoLoginLanzadera(res.url)
        } else {
            console.log(res)
            console.log('ERROR: NO PUEDO COMPROBAR SI ESTÁS EN LANZADERA')
        }
    }).catch(err => {
        console.log(err)
        console.log('ERROR')
    })
}

function FirstConnectionAttempt() {
    if (!process.env.USER || !process.env.PASS) {
        return console.log('ERROR: NO ME HAS DICHO TU USUARIO/CONTRASEÑA DE LANZADERA. COMPRUEBA EL FICHERO .ENV')
    }

    return fetch('https://www.google.es/').then(res => {
        if (res.status === 200) {
            console.log('TU CONEXIÓN A INTERNET ES CORRECTA. NO NECESITAS HACER ESTO')
        } else {
            console.log(res)
        }
    }).catch(err => {
        if (err.code === 'ENOTFOUND') {
            console.log('NO HAY CONEXIÓN A LA RED. COMPRUEBA TU WIFI O CABLE')
        } else if (err.code === 'SELF_SIGNED_CERT_IN_CHAIN') {
            return IsLanzaderaLoginNeeded()
        } else {
            console.log(err)
            console.log('CATCH ERROR')
        }
    })
}

FirstConnectionAttempt()