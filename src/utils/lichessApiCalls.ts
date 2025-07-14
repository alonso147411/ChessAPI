import axios from 'axios';


export const top10EndpointCall = async function () {
    return  await axios.get('https://lichess.org/api/player');
}

export const userByIdEndpointCall = async function (id?:string) {
    return await axios.post(
        'https://lichess.org/api/users',
        id,
        {
            headers: {
                "Content-Type": "text/plain",
            }
        }
    );
}

export const performanceStatisticsEndpointCall = async function (id?:string,mode?:string) {
    return await axios.get(`https://lichess.org/api/user/${id}/perf/${mode}`);
}

export const top200PlayerEndpointCall = async function (mode?:string) {
    return await axios.get(`https://lichess.org/api/player/top/200/${mode}`);
}

export const ratingUserHistoryEndpointCall = async function (username?: string) {
    return await axios.get(`https://lichess.org/api/user/${username}/rating-history`);
}