import { useEffect, useState } from "react"
import { Client } from "../../types/Clients"; 
import { ClientService } from "../../services/ClientsService"
import { Button, Table } from "react-bootstrap";
import Loader from "../Loader/Loader";
import { ModalType } from '../../types/ModalTypes';
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import ClientModal from "../ClientModal/ClientModal";

const ClientTable = () => {
    //var q va a contener los datos recibidos x la API
    const[clients, setClients]= useState<Client[]>([]);
    //var q muestra el componente Loader hasta q se reciban los datos de la API
    const[isLoading, setIsLoading]=useState(true);
    
    //var q va a actualizar los datos de la tabla luego de c/operacion exitosa
    const[refreshData, setRefreshData]=useState(false);

    //hook q se va a ejecutar c/vez q se renderice el componente
    //o refresData cambie de estado
    useEffect(()=> {
        //llamada a la fc para obtener todos los productos declarados en ProductService
        const fetchClients=async () => {
            const clients = await ClientService.getClients();
            setClients(clients);
            setIsLoading(false);
        };

        fetchClients();
    }, [refreshData]);
    //Test, log modificado parta mostrar datos de manera mas legible
    console.log(JSON.stringify(clients, null, 2));
    
    //CONST para inicializar un producto x defecto y evitar 'undefined'
//cuando vayamos a crear un producto nuevo
    const initializableNewClient = (): Client =>{
      return{
        id: 0,
        nombre: "",
        apellido: "",
        email: "",
        telefono: "",
      };
    };
    //Prod seleccionado q se va a pasar como prop al Modal
    const  [client, setClient]= useState<Client>(initializableNewClient);
    //const para manejar el estado del modal
    const[showModal, setShowModal]= useState(false);
    const[modalType, setModalType]= useState<ModalType>(ModalType.NONE);
    const[name, setName]= useState("");

    //logica del modal
    const handleClick= (newName: string, clie: Client, modal:ModalType)=> {
      setName(newName);
      setModalType(modal);
      setClient(clie);
      setShowModal(true);
    };

  return (
    <>
    <Button onClick={()=> handleClick("Nuevo Client", initializableNewClient(),
    ModalType.CREATE)}> Nuevo Cliente </Button>
      {isLoading ? <Loader/>: (
        <Table hover>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Email</th>
              <th>Telefono</th>
              <th>Editar</th>
              <th>Borrar</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client =>(
              <tr key={client.id}>
                <td>{client.nombre}</td>
                <td>{client.apellido}</td>
                <td>{client.email}</td>
                <td>{client.telefono}</td>

                <td><EditButton onClick={() => handleClick("Editar Cliente", client, ModalType.UPDATE)}/></td>
                <td><DeleteButton onClick={() => handleClick("Borrar Cliente", client, ModalType.DELETE)}/></td>


              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {showModal && (
        <ClientModal
        show={showModal} 
        onHide={()=> setShowModal(false)}
        title={name}
        modalType={modalType}
        clie={client}
        refreshData={setRefreshData}
        />
      )}

    </>
  )
}

export default ClientTable