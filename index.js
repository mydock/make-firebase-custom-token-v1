import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import express from 'express';

const config = {
    ciSecret: process.env.CI_SECRET?.trim(),

    allowedUids: (process.env.ALLOWED_UID_CSV?.trim() || '')
        .split(',')
        .map(x => x.trim())
        .filter(x => x),
}

const fbauth = getAuth(initializeApp())

const app = express()

app.use(express.json())

app.get('/', (req, res) => res.send('pong'))

app.post('/ci-token-1', async (req, res) => {
    const { uid, ciSecret } = req.body

    if (!ciSecret || ciSecret !== config.ciSecret) {
        return res.status(400).json({
            message: 'Invalid ci secret',
        })
    }

    if (!config.allowedUids.includes(uid)) {
        return res.status(400).json({
            message: `uid '${uid}' is not allowed in env.ALLOWED_UID_CSV`,
        })
    }

    const token = await fbauth.createCustomToken(uid)

    res.json({
        token,
    })
})

// listen to PORT
app.listen(Number(process.env.PORT || 3001))
