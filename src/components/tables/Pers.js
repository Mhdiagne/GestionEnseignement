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
import DetailsPers from './DetailsPers';

const Pers = () => {

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
            field: 'matricule',
            headerName: 'Matricule',
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
                    getOnePer(row.id)
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
                <CButton   color="danger" onClick={()=>{deletePer(row.id)}} variant="outline" >
                    <CIcon icon={cilTrash} className="text-danger" />
                </CButton>
            ),
            },
        ];
        
        useEffect(()=>{
            getPers();
        },[]);
        
        const [rows, setRows] = useState([]);
        const [per, setPer] = useState(
            {
                prenom:"",
                nom:"",
                grade:"",
                matricule:""}
            );
         const [newPer, setNewPer] = useState(
            {
                type: "PER",
                prenom:"",
                nom:"",
                grade:"",
                matricule:""}
            );
        const getPers = () => {
            fetch(SERVER_URL+"persrest")
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
    
        const getOnePer = (id) => {
            fetch(SERVER_URL+`persrest/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                      return null;
                    }
                })
                .then( donne =>
                  {
                    setPer(donne);
                    console.log(donne);
                  }
                )
                .catch(err=>console.error(err));
        }
    
        const cretePer = (vac) => {
            fetch(SERVER_URL+`persrest/create`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(vac)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getPers();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const editPer = (id,vac) => {
            fetch(SERVER_URL+`persrest/edit/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(vac)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getPers();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const handleChange = (e) => {
            const value = e.target.value;
            setPer({
              ...per,
              [e.target.name]: value
            });
        }
    
        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewPer({
              ...newPer,
              [e.target.name]: value
            });
        }
    
        const deletePer = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer le vacataire ? :(")) {
                fetch(SERVER_URL+`persrest/delete/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getPers();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }
    
        const getDetails = (id) => {
            fetch(SERVER_URL+`persrest/${id}/repartitions`,{
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
        (show) ? ( <DetailsPers rowdetail={rowdetail} />) : (
          <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Pers</h3>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un PER</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={per.prenom} name='prenom' floatingLabel="Prénom" placeholder="Prénom" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={per.nom} name='nom' floatingLabel="Nom" placeholder="Nom" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={per.grade} name='grade' floatingLabel="Grade" placeholder="Grade" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={per.matricule} name='matricule' floatingLabel="Matricule" placeholder="Matricule" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editPer(idSelected,per)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un PER</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" name='prenom' floatingLabel="Prénom" placeholder="Prénom" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='nom' floatingLabel="Nom" placeholder="Nom" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='grade' floatingLabel="Grade" placeholder="Grade" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='matricule' floatingLabel="Matricule" placeholder="Matricule" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {cretePer(newPer); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
          </div>
        ));
    };

export default Pers;