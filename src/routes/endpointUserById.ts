import axios from 'axios';

const getUserById = function (fastify:any) {
    fastify.get('/chess/user', {
        schema: {
            response: {
                200: {
                    type: "array",
                    items: {
                        type: "object",
                        required: ["id", "username", "modes"],
                        properties: {
                            id: { type: "string" },
                            username: { type: "string" },
                            modes: { type: "object" ,additionalProperties: true },
                            flair: { type: "string" },
                            patron: { type: "boolean" },
                            verified: { type: "boolean" },
                            createdAt: { type: "number" },
                            profile: { type: "object",additionalProperties: true  },
                            seenAt: { type: "number" },
                            playTime: { type: "object",additionalProperties: true  },
                        }
                    }
                }
            }
        }
    }, async (request: any, reply: any) => {
        try {
            const { id } = request.query;

            if (!id) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing id parameter' });
            }

            const response = await axios.post(
                'https://lichess.org/api/users',
                id,
                {
                    headers: {
                        "Content-Type": "text/plain",
                    }
                }
            );
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