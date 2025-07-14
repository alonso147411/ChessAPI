import { topPlayerHistorySchema } from '../utils/schemas';
import { ratingUserHistoryEndpointCall, top200PlayerEndpointCall } from '../utils/lichessApiCalls';
import { sendError400, sendError404, sendError500 } from '../utils/errors';

const getTopPlayerHistory = function( fastify: any ){
    fastify.get('/chess/topPlayerHistory',topPlayerHistorySchema , async (request: any, reply: any) => {
        try {
            const { mode , top} = request.query as {mode?:string, top?:number};
            if (!mode || !top) {
                sendError400(reply,"Invalid or missing 'top' or 'mode' parameter.");
                return;
            }

            const topResponse = await top200PlayerEndpointCall(mode);

            const usersData = topResponse.data as { users?: any[] };
            const players = usersData.users ?? [];
            
            if (!Array.isArray(players) || players.length < top) {
                sendError400(reply,"Invalid or missing player parameter.");
                return;
            }
            const player = players[top - 1];
           
            const historyResponse = await ratingUserHistoryEndpointCall(player.username);
            const history = historyResponse.data as any;
            

            const modeHistory = Array.isArray(history) ? history.find((h: any) => h.name.toLowerCase() === mode.toLowerCase()) : null;

            if (!modeHistory || !Array.isArray(modeHistory.points)) {
                sendError404(reply,"Game Mode not found.");
                return;
            }

            const historyFormated = modeHistory.points.map((point: any) => ({
                date: new Date(point[0], 0, 1 + point[1]).toISOString().slice(0, 10), 
                rating: point[3]
            }));

            const out = {
                username: player.username,
                history: historyFormated,
            }

            reply.send(out);
            
        } catch (error:any) {
            if (error.response && error.response.status === 404) {
                sendError404(reply,"Game Mode not found.");
                return;
            }
            if (error.response && error.response.status === 400) {
                sendError400(reply,"Invalid or missing 'top' or 'mode' parameter.");
                return;
            }
            sendError500(reply);
            return;
        }
    })
}

export default getTopPlayerHistory;