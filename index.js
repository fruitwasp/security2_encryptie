
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    crypto = require('crypto'),
    algorithm = 'aes-256-ctr'

const PORT = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'ejs')

function encrypt(text, key) {
    const cipher = crypto.createCipher(algorithm, key)
    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return encrypted
}

function decrypt(text, key) {
    const decipher = crypto.createDecipher(algorithm, key)
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
}

const router = express.Router()

router.get('/', (req, res) => {
    res.render('index.ejs')
})

router.post('/', (req, res) => {
    const userName = req.body.userName
    const password = req.body.password
    let decrypted = req.body.decrypted
    let encrypted = req.body.encrypted

    if ( userName && password ) {
        if ( decrypted ) {
            encrypted = encrypt(decrypted, userName + password)
            decrypted = ''
        } else {
            decrypted = decrypt(encrypted, userName + password)
            encrypted = ''
        }
    }

    res.render('index.ejs', {
        userName,
        password,
        decrypted,
        encrypted
    })
})

app.use('/', router)

app.listen(PORT, function () {
    console.log('App listening on port ' + PORT)
})

module.exports = app
