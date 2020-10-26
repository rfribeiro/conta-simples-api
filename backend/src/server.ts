import 'dotenv/config'
import express from 'express'
import router from './routes'
import cors from 'cors'
import swaggerUi from 'swagger-ui-express'
import './database/connect'

var swaggerDocument = require('./swagger.json')

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api/v1', router)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//Capture All 404 errors
app.use(function (req,res,next){
	res.status(404).send({
        error: 'Unable to find the requested resource!'
    });
});

app.listen(process.env.SERVER_LISTEN_PORT || 3000, () => console.log('🔥 Server started'));

module.exports = app