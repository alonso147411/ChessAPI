import { userByIdSchema } from '../utils/schemas';
import { userByIdEndpointCall } from '../utils/lichessApiCalls';
import { sendError400, sendError404, sendError500 } from '../utils/errors';

const getUserById = function (fastify:any) {
    fastify.get('/chess/user',userByIdSchema, async (request: any, reply: any) => {
        try {
            const { id } = request.query as {id?:string};

            if (!id) {
                sendError400(reply);
                return;
            }

            const response = await userByIdEndpointCall(id);
            if (Array.isArray(response.data)) {
                const mapped = response.data.map((user: any) => {
                    const { perfs, ...rest } = user;
                    return {
                        ...rest,
                        modes: perfs
                    };
                });
                reply.send(mapped);
            } else {
                sendError400(reply);
            }
        } catch (error:any) {
            if (error.response && error.response.status === 404) {
                sendError404(reply);
            }
            if (error.response && error.response.status === 400) {
                sendError400(reply);
            }
            sendError500(reply);
        }
    });
}

export default getUserById;
