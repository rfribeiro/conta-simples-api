import express from 'express'
import router from './routes'
import './database/connect'

const app = express()

app.use(express.json())
app.use('/api/v1', router)

//Capture All 404 errors
app.use(function (req,res,next){
	res.status(404).send({
        error: 'Unable to find the requested resource!'
    });
});

app.listen(3000, () => console.log('🔥 Server started'));