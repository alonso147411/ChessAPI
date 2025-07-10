const fastify = require('fastify')({ logger: true });
const axios = require('axios'); // node

const PORT = 5555;

fastify.get('/chess/top10', async (request, reply) => {
    try {
        const response = await axios.get('https://lichess.org/api/player');
        reply.send(response.data);
    } catch (error) {
        reply.status(500).send({ error: 'Error al obtener datos de Lichess' });
    }
});

const start = async () => {
    try{
        await fastify.listen({port:PORT});
    }catch(error){
        fastify.log.error(error);
        process.exit();
    }
}

start();