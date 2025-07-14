import { enrichedUserSchema } from '../utils/schemas';
import { performanceStatisticsEndpointCall, userByIdEndpointCall } from '../utils/lichessApiCalls';
import { sendError400, sendError404, sendError500 } from '../utils/errors';


const getEnrichedUser = function (fastify: any) {
    fastify.get('/chess/user/enriched', enrichedUserSchema ,async (request: any, reply: any) => { 
        try {
            const { id, mode } = request.query as {id?:string,mode?:string};
            if (!id || !mode) {
                sendError400(reply,"Invalid or missing 'id' or 'mode' parameter.");
                return;
            }

            const userResponse = await userByIdEndpointCall(id);
            const users = userResponse.data as any[];
            const user = Array.isArray(users) && users.length > 0 ? users[0] : null;
            const performanceResponse = await performanceStatisticsEndpointCall(id,mode);
            const perf = performanceResponse.data as any;

            const out = {
                id: user.id,
                username: user.username,
                profile: user.profile,
                playTime: user.playTime,
                rank: typeof perf.stat.rank === "number" ? perf.stat.rank : 0,
                resultStreak: typeof perf.stat.resultStreak === "object" && perf.stat.resultStreak !== null ? perf.stat.resultStreak : {}
            }
            
            reply.send(out);

        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                sendError404(reply,"User or Game Mode not found.");
                return;
            }
            if (error.response && error.response.status === 400) {
                sendError400(reply,"Invalid or missing 'id' or 'mode' parameter.");
                return;
            }
            sendError500(reply);
            return;
        }

    })

}


export default getEnrichedUser;