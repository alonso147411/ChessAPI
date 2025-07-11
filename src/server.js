const fastify = require('fastify')({ logger: true });
const getTop10 = require('./routes/endpointTop10');

const PORT = 5555;

getTop10(fastify);

const start = async () => {
    try{
        await fastify.listen({port:PORT});
    }catch(error){
        fastify.log.error(error);
        process.exit();
    }
}

start();