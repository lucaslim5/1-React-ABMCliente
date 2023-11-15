import { Client } from "../types/Clients";

/* const BASE_URL= 'https://fakestoreapi.com'; */
const BASE_URL= 'https://example-service-thrid.onrender.com/api/v1';

export const ClientService= {
    //declaramos nuestros metodos

    //fetch permite realizar solicitudes HTTP a un servidor
    //Async/Await para manejar promesas
    //Async para declarar una fc asincrona,devuelve una promesa
    //Await lo uso dentro una fc asincrona para pausar la ejecucion de la fc y espera promesa(resuelta/rechazada)

    getClients:async (): Promise<Client[]> => {
        const response= await fetch(`${BASE_URL}/cliente`);
        const data= await response.json();

        return data;
    },
    
    getClient:async (id:number): Promise<Client> => {
        const response= await fetch(`${BASE_URL}/cliente${id}`);
        const data= await response.json();
        return data;
    },

    createClient:async (client:Client):Promise<Client> => {
        const response= await fetch(`${BASE_URL}/cliente`,{
            method: "POST",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(client)
        });
        const data= await response.json();
        return data;
    },

    updateClient:async (id:number, cliente:Client):Promise<Client> => {
        const response= await fetch(`${BASE_URL}/cliente/${id}` ,{
            method: "PUT",
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(cliente)
        });
        const data= await response.json();
        return data;
    },

    deleteClient:async (id:number):Promise<void> => {
        await fetch(`${BASE_URL}/cliente/${id}` ,{
            method: "DELETE"
        });

    }
}