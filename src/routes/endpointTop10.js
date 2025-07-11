const axios = require('axios'); 

const getTop10 = function(fastify){
    fastify.get('/chess/top10', async (request, reply) => {
        try {
            const response = await axios.get('https://lichess.org/api/player');
            reply.send(response.data);
        } catch (error) {
            reply.status(500).send({ error: 'Error al obtener datos de Lichess' });
        }
    });
    
}


module.exports = getTop10;