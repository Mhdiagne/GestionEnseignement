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
import DetailVacataires from './DetailVacataires';


const Vacataires = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState([]);
    const columns = [
        { field: 'id_Enseignant', headerName: 'ID', width: 90 },
        {
        field: 'prenom',
        headerName: 'Prenom',
        width: 150,
        editable: true,
        },
        {
        field: 'nom',
        headerName: 'Nom',
        width: 150,
        editable: true,
        },
        {
        field: 'grade',
        headerName: 'Grade',
        width: 110,
        editable: true,
        },
        {
        field: 'specialite',
        headerName: 'Specialite',
        editable: true,
        width: 160,
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
                getOneVacataire(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteVacataires(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];
    
    useEffect(()=>{
        getVacataires();
    },[]);
    
    const [rows, setRows] = useState([]);
    const [vacataire, setVacataire] = useState(
        {
            prenom:"",
            nom:"",
            grade:"",
            specialite:""}
        );
    const [newVacataire, setNewVacataire] = useState(
        {
            type: "VAC",
            prenom:"",
            nom:"",
            grade:"",
            specialite:""}
        );
    
    const getVacataires = () => {
        fetch(SERVER_URL+"vacatairesrest")
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

    const getOneVacataire = (id) => {
        fetch(SERVER_URL+`vacatairesrest/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setVacataire(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteVacataire = (vac) => {
        fetch(SERVER_URL+`vacatairesrest/create`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getVacataires();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editVacataire = (id,vac) => {
        fetch(SERVER_URL+`vacatairesrest/edit/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getVacataires();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setVacataire({
          ...vacataire,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewVacataire({
          ...newVacataire,
          [e.target.name]: value
        });
    }

    const deleteVacataires = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le vacataire ? :(")) {
            fetch(SERVER_URL+`vacatairesrest/delete/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getVacataires();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`vacatairesrest/${id}/repartitions`,{
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
    (show) ? ( <DetailVacataires rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Vacataires</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.id_Enseignant}
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
        {/* Voici le modal qui gere la modification des vacataires */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Vacataire</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" value={vacataire.prenom} name='prenom' floatingLabel="Prénom" placeholder="Prénom" onChange={handleChange} />
            <CFormInput type="text"  floatingClassName="mb-3" value={vacataire.nom} name='nom' floatingLabel="Nom" placeholder="Nom" onChange={handleChange} />
            <CFormInput type="text"  floatingClassName="mb-3" value={vacataire.grade} name='grade' floatingLabel="Grade" placeholder="Grade" onChange={handleChange} />
            <CFormInput type="text"  floatingClassName="mb-3" value={vacataire.specialite} name='specialite' floatingLabel="Specialité" placeholder="Specialité" onChange={handleChange} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editVacataire(idSelected,vacataire)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des vacataires */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Vacataire</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" name='prenom' floatingLabel="Prénom" placeholder="Prénom" onChange={handleChange1} />
            <CFormInput type="text"  floatingClassName="mb-3" name='nom' floatingLabel="Nom" placeholder="Nom" onChange={handleChange1} />
            <CFormInput type="text"  floatingClassName="mb-3" name='grade' floatingLabel="Grade" placeholder="Grade" onChange={handleChange1} />
            <CFormInput type="text"  floatingClassName="mb-3" name='specialite' floatingLabel="Specialité" placeholder="Specialité" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteVacataire(newVacataire); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Vacataires;