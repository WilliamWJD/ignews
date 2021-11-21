import { NextApiRequest, NextApiResponse } from "next";

export default (request:NextApiRequest, response:NextApiResponse) =>{
    const users = [
        {id: 1, name:'William'},
        {id: 2, name:'Marcos'},
        {id: 3, name:'Karolaine'},
    ]

    return response.json(users);
}