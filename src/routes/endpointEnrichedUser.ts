import axios, { get } from 'axios';
import getUserById from './endpointUserById';
import { profile } from 'console';

const getEnrichedUser = function (fastify: any) {
    fastify.get('/chess/user/enriched', {
        schema: {
            response: {
                200: {
                    type: "object",
                        properties: {
                            id: {type: "string" },
                            username: {type: "string" },
                            profile: { type: "object",additionalProperties: true  },
                            playTime: { type: "object",additionalProperties: true  },
                            rank: {type:"number"},
                            resultStreak: {type: "object",additionalProperties: true},
                        }
                    }
            }
        }
    } ,async (request: any, reply: any) => { 
        try {
            const { id, mode } = request.query;
            if (!id || !mode) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing id or mode parameter' });
            }

            const userResponse = await axios.get(`https://lichess.org/api/user/${id}`);
            const user = userResponse.data as any;;
            const performanceResponse = await axios.get(`https://lichess.org/api/user/${id}/perf/${mode}`);
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
                return reply
                    .status(404)
                    .send({ error: 'User or mode not found' });
            }
            if (error.response && error.response.status === 400) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing id or mode parameter' });
            }
            reply.status(500).send({ error: 'Internal server error' });
        }

    })

}


export default getEnrichedUser;