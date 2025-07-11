import axios from 'axios';

const getTop10 = function(fastify:any){
    fastify.get('/chess/top10', {
            schema: {
            response: {
                200: {
                    type: "object",
                    additionalProperties: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                id: { type: "string" },
                                username: { type: "string" },
                                perfs: { type: "object", additionalProperties: true }
                            },
                            required: ["id", "username", "perfs"]
                        }
                    }
                },
                    404: {
                        type: "object",
                        properties: {
                          error: { type: "string" }
                        },
                        required: ["error"]
                      },
                      500: {
                        type: "object",
                        properties: {
                          error: { type: "string" }
                        },
                        required: ["error"]
                      }
            }
        }
    },async ( reply:any) => {
        try {
            const response = await axios.get('https://lichess.org/api/player');
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