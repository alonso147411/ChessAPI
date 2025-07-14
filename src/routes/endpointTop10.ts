import { top10schema } from '../utils/schemas';
import { top10EndpointCall } from '../utils/lichessApiCalls';

const getTop10 = function(fastify:any){
    fastify.get('/chess/top10',top10schema,async ( reply:any) => {
        try {
            const response = await top10EndpointCall();
            if (!response.data || Object.keys(response.data).length === 0) {
                return reply.status(404).send({ error: 'No top players found.' });
            }

            reply.send(response.data);

        } catch (error) {
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
    
}


export default getTop10;