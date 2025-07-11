import axios, { get } from 'axios';

const getTopPlayerHistory = function( fastify: any ){
    fastify.get('/chess/topPlayerHistory', {
        schema: {
            response: {
                200: {
                    type: "object",
                    
                    properties: {
                        username: { type: "string" },
                        history: {
                            type: "array",
                            items: {
                                type: "object",
                                properties: {
                                    date: { type: "string" },
                                    rating: { type: "number" }
                                }
                            }
                        }
                    }
                },
                400: {
                    type: "object",
                    properties: {
                      error: { type: "string" }
                    },
                    required: ["error"]
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
        
    }, async (request: any, reply: any) => {
        try {
            const { mode , top} = request.query;
            if (!mode || !top) {
                return reply
                .status(400)
                .send({ error: 'Invalid or missing top or mode parameter' });
            }

            const topResponse = await axios.get(`https://lichess.org/api/player/top/200/${mode}`);

            const usersData = topResponse.data as { users?: any[] };
            const players = usersData.users ?? [];
            
            if (!Array.isArray(players) || players.length < top) {
                return reply.status(404).send({ error: "Player not found." });
            }
            const player = players[top - 1];
           
            const historyResponse = await axios.get(`https://lichess.org/api/user/${player.username}/rating-history`);
            const history = historyResponse.data as any;
            

            const modeHistory = Array.isArray(history) ? history.find((h: any) => h.name.toLowerCase() === mode.toLowerCase()) : null;

            if (!modeHistory || !Array.isArray(modeHistory.points)) {
                return reply.status(404).send({ error: "Game Mode not found." });
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
                return reply
                    .status(404)
                    .send({ error: 'Game mode not found' });
            }
            if (error.response && error.response.status === 400) {
                return reply
                    .status(400)
                    .send({ error: 'Invalid or missing top or mode parameter' });
            }
            reply.status(500).send({ error: 'Internal server error' });
        }
    })
}

export default getTopPlayerHistory;