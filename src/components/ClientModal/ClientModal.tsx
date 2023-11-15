import { Client } from '../../types/Clients';
import { Button, Form, FormLabel, Modal } from 'react-bootstrap';
import { ModalType } from "../../types/ModalTypes";
//dependencias para validar formularios
import * as Yup from 'yup'
import { useFormik } from "formik";
import { ClientService }  from '../../services/ClientsService'
//notificaciones al usuario
import {toast} from 'react-toastify';


type ClientModalProps ={
    show: boolean;
    onHide: ()=> void;
    title: string;
    modalType: ModalType;
    clie: Client;
    refreshData: React.Dispatch<React.SetStateAction<boolean>>;
}



const ClientModal = ({show, onHide, title, modalType, clie, refreshData}:ClientModalProps ) => {

    //CREATE-UPDATE
  const handleSaveUpdate= async (cli:Client) => {
    try {
      const isNew = cli.id===0;
      if (isNew) {
        await ClientService.createClient(cli);
      } else{
        await ClientService.updateClient(cli.id, cli);
      }
      toast.success(isNew ? "Cliente creado": "Cliente actualizado",{
        position: "top-center",
      });

      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error")
    }
  };

  //DELETE
  const handleDelete=async () => {
    try {
      await ClientService.deleteClient(clie.id)
      toast.success("Cliente borrado",{
        position:"top-center",
      });

      onHide();
      refreshData(prevState => !prevState);
    } catch (error) {
      console.error(error);
      toast.error("Ha ocurrido un error")
    }
  }

  //Yup, esquema de validacion
  const validationSchema= () => {
    return Yup.object().shape({
      id: Yup.number().integer().min(0),
      nombre: Yup.string().required('El Nombre es requerido'),
      apellido: Yup.string().required('El Apellido es requerido'),
      email: Yup.string().required('El Email es requerido'),
      telefono: Yup.string().required('El Telefono es requerido'),
    });
  };

  //Formik,usa el esquema de validacion para crear un formulario dinamico y que lo bloquee
  //en caso de haber errores
  const formik = useFormik({
    initialValues: clie,
    validationSchema: validationSchema(),
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (obj: Client) => handleSaveUpdate(obj),
  });

  return (
    <>
    {modalType ===ModalType.DELETE ? (
      <>
      <Modal show={show} onHide={onHide} centered backdrop="static">

        <Modal.Header closeButton>
          <Modal.Title> {title} </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>¿Está seguro que desea eliminar al Cliente <br/>
          <strong> {clie.apellido&&clie.nombre} </strong>?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}> Cancelar </Button>
          <Button variant="danger" onClick={handleDelete}> Eliminar </Button>
        </Modal.Footer>

      </Modal>
      </>
    ):(
      <>
        <Modal show={show} onHide={onHide} centered backdrop="static" className="modal-xl">
          <Modal.Header>
            <Modal.Title> { title }</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={formik.handleSubmit}>
            {/* Form.Group x c/campo para dar de alta o modificar un producto */}
            {/* Nombre */}
              <Form.Group controlId='formNombre'>
                <FormLabel> Nombre </FormLabel>
                <Form.Control 
                name="nombre"
                type="text"
                value={formik.values.nombre || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.nombre && formik.touched.nombre)}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.nombre}
                </Form.Control.Feedback>
              </Form.Group>
            
            {/* Apellido */}
              <Form.Group controlId='formApellido'>
                <FormLabel> Apellido </FormLabel>
                <Form.Control 
                name="apellido"
                type="text"
                value={formik.values.apellido || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.apellido && formik.touched.apellido)}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.apellido}
                </Form.Control.Feedback>
              </Form.Group>
            
            {/* Email */}
              <Form.Group controlId='formEmail'>
                <FormLabel> Email </FormLabel>
                <Form.Control 
                name="email"
                type="text"
                value={formik.values.email || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.email && formik.touched.email)}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.email}
                </Form.Control.Feedback>
              </Form.Group>

            {/* Telefono */}
              <Form.Group controlId='formTelefono'>
                <FormLabel> Telefono </FormLabel>
                <Form.Control 
                name="telefono"
                type="text"
                value={formik.values.telefono || ''}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={Boolean(formik.errors.telefono && formik.touched.telefono)}
                />
                <Form.Control.Feedback type='invalid'>
                  {formik.errors.telefono}
                </Form.Control.Feedback>
              </Form.Group>
            

              <Modal.Footer className="mt-4">
                <Button variant="secondary" onClick={onHide}> Cancelar </Button>
                <Button variant="primary" type="submit" disabled={!formik.isValid}> Guardar </Button>
              </Modal.Footer>
            </Form>
          </Modal.Body>
        </Modal>
      </>
    )}
    </>
  )
}

export default ClientModal