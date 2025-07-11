import axios from 'axios';

const getTop10 = function(fastify:any){
    fastify.get('/chess/top10', async (request:any, reply:any) => {
        try {
            const response = await axios.get('https://lichess.org/api/player');
            reply.send(response.data);
        } catch (error) {
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
    
}


export default getTop10;