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


const Enseignements = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState([]);
    const columns = [
        { field: 'idEnseignement', headerName: 'ID', width: 90 },
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
        field: 'objectifs',
        headerName: 'Objectifs',
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
                getOneEnseignement(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteEnseignements(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];

    useEffect(()=>{
        getEnseignements();
    },[]);

    const [rows, setRows] = useState([]);
    const [enseignement, setEnseignement] = useState(
        {
            libelle:"",
            description:"",
            objectifs:""
        }
        );
    const [newEnseignement, setNewEnseignement] = useState(
        {
          libelle:"",
          description:"",
          objectifs:""
        }
        );

    const getEnseignements = () => {
        fetch(SERVER_URL+"maquette/enseignements")
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

    const getOneEnseignement = (id) => {
        fetch(SERVER_URL+`maquette/enseignement/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setEnseignement(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteEnseignement = (vac) => {
        fetch(SERVER_URL+`maquette/enseignement`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getEnseignements();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editEnseignement = (id,vac) => {
        fetch(SERVER_URL+`maquette/enseignement/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getEnseignements();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setEnseignement({
          ...enseignement,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewEnseignement({
          ...newEnseignement,
          [e.target.name]: value
        });
    }

    const deleteEnseignements = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le enseignement ? :(")) {
            fetch(SERVER_URL+`maquette/enseignement/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getEnseignements();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`maquette/enseignement/${id}/repartitions`,{
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
                <h3 className="mb-3 mt-2 title-grid">Listes des Enseignements</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.idEnseignement}
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
        {/* Voici le modal qui gere la modification des enseignements */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Enseignement</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" value={enseignement.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={enseignement.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={enseignement.objectifs} name='objectifs' floatingLabel="Objectifs" placeholder="Objectifs" onChange={handleChange} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editEnseignement(idSelected,enseignement)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des enseignements */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Enseignement</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='objectifs' floatingLabel="Objectifs" placeholder="Objectifs" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteEnseignement(newEnseignement); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Enseignements;
