import fastify from 'fastify';
import getTop10 from './routes/endpointTop10';
import getUserById from './routes/endpointUserById';
import getEnrichedUser from './routes/endpointEnrichedUser';
import getTopPlayerHistory from './routes/endpointTopPlayerHistory';

const app = fastify({ logger: true });
const PORT = 5555;

getTop10(app);
getUserById(app);
getEnrichedUser(app);
getTopPlayerHistory(app);


const start = async () => {
    try{
        await app.listen({port:PORT});
    }catch(error){
        app.log.error(error);
        process.exit();
    }
}

start();