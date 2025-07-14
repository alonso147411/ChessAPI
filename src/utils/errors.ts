export const sendError500 = function (reply:any) {
    return reply.status(500).send({ error: 'Internal server error' });
}

export const sendError400= function (reply: any) {
    return reply.status(400).send({ error: 'One or more required parameters are missing' });
}

export const sendError404 = function (reply: any) {
    return reply.status(404).send({ error: 'Resource not found' });
}