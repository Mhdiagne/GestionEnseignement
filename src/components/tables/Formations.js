import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CModal } from '@coreui/react';
import { CInputGroup } from '@coreui/react';
import { CFormInput } from '@coreui/react';
import { CButton, CModalBody, CModalHeader, CModalTitle, CModalFooter } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailRepartirions from './DetailRepartirions';


const Formations = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState([]);
    const columns = [
        { field: 'idFormation', headerName: 'ID', width: 90 },
        {
        field: 'libelle',
        headerName: 'Libelle',
        width: 150,
        editable: true,
        },
        {
        field: 'description',
        headerName: 'Description',
        width: 150,
        editable: true,
        },
        {
        field: 'btn1',
        headerName: "",
        sortable: false,
        filterable: false,
        renderCell: row => (
            <CButton color="primary" onClick={()=>{getDetails(row.id); setShow(true)}} >
            details
            </CButton>
        )
        },
        {
        field: 'btn2',
        headerName: "",
        sortable: false,
        filterable: false,
        renderCell: row => (
            <CButton color="info"
            onClick={() => {
                setVisible(!visible);
                setIdSelected(row.id)
                getOneFormation(row.id)
            }} variant="outline">
            <CIcon icon={cilPencil} className="text-info"  />
            </CButton>
        )
        },
        {
        field: 'btn3',
        headerName: "",
        sortable:false,
        filterable: false,
        renderCell: row => (
            <CButton   color="danger" onClick={()=>{deleteFormations(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];

    useEffect(()=>{
        getFormations();
    },[]);

    const [rows, setRows] = useState([]);
    const [formation, setFormation] = useState(
        {
            libelle:"",
            description:""
        }
        );
    const [newFormation, setNewFormation] = useState(
        {
          libelle:"",
          description:""
        }
        );

    const getFormations = () => {
        fetch(SERVER_URL+"maquette/formation")
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donnes =>
              {
                setRows(donnes);
                console.log(donnes);
              }
            )
            .catch(err=>console.error(err));
    }

    const getOneFormation = (id) => {
        fetch(SERVER_URL+`maquette/formation/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setFormation(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteFormation = (vac) => {
        fetch(SERVER_URL+`maquette/formation`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getFormations();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editFormation = (id,vac) => {
        fetch(SERVER_URL+`maquette/formation/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getFormations();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setFormation({
          ...formation,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewFormation({
          ...newFormation,
          [e.target.name]: value
        });
    }

    const deleteFormations = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le formation ? :(")) {
            fetch(SERVER_URL+`maquette/formation/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getFormations();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`maquette/formation/${id}`,{
            method: "GET"
        })
        .then( answer=>{
            if (answer.status===200) {
                return answer.json();
            }else {
                return null;
            }
        })
        .then(data=>{
                setRowDetail(data);
        })
        .catch(err=>console.error(err));
    }

    return (
    (show) ? ( <DetailRepartirions rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Formations</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.idFormation}
            columns={columns}
            initialState={{
                pagination: {
                paginationModel: {
                    pageSize: 6,
                },
                },
            }}
            pageSizeOptions={[5]}
            />
        </Box>
        {/* Voici le modal qui gere la modification des formations */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Formation</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" value={formation.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={formation.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
            <CFormInput type="date" floatingClassName="mb-3" value={formation.dateCreation} name='dateCreation' floatingLabel="Date de Création" placeholder="Date de Création" onChange={handleChange} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editFormation(idSelected,formation)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des formations */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Formation</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            <CFormInput type="date" floatingClassName="mb-3" name='dateCreation' floatingLabel="Date de Création" placeholder="Date de Création" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteFormation(newFormation); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Formations;
