import { userByIdSchema } from '../utils/schemas';
import { userByIdEndpointCall } from '../utils/lichessApiCalls';

const getUserById = function (fastify:any) {
    fastify.get('/chess/user',userByIdSchema, async (request: any, reply: any) => {
        try {
            const { id } = request.query as {id?:string};

            if (!id) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing id parameter' });
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
                reply.status(404).send({ error: 'User(s) not found' });
            }
        } catch (error:any) {
            if (error.response && error.response.status === 404) {
                return reply
                    .status(404)
                    .send({ error: 'User not found' });
            }
            if (error.response && error.response.status === 400) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing id parameter' });
            }
            reply.status(500).send({ error: 'Internal server error' });
        }
    });
}

export default getUserById;
