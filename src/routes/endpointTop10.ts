import { top10schema } from '../utils/schemas';
import { top10EndpointCall } from '../utils/lichessApiCalls';
import { sendError404, sendError500 } from '../utils/errors';

const getTop10 = function(fastify:any){
    fastify.get('/chess/top10',top10schema,async ( reply:any) => {
        try {
            const response = await top10EndpointCall();
            if (!response.data || Object.keys(response.data).length === 0) {
                sendError404(reply,"Not data found");
                return;
            }

            reply.send(response.data);

        } catch (error) {
            sendError500(reply);
        }
    });
    
}


export default getTop10;