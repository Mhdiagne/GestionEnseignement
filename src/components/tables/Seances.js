import React from 'react';
import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailRepartirions from './DetailRepartirions';

const Seances = () => {
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'id_Seance', headerName: 'ID', width: 90 },
            {
                field: 'jour',
                headerName: 'Jour',
                width: 150,
                editable: true,
            },
            {
                field: 'duree',
                headerName: 'Duree',
                width: 150,
                editable: true,
            },
            {
                field: 'heureDebut',
                headerName: 'Heure de Fin',
                width: 150,
                editable: true,
            },
            {
                field: 'heureFin',
                headerName: 'Heure de Fin',
                width: 150,
                editable: true,
            },
            {
                field: 'dateCreation',
                headerName: 'Date de Creation',
                width: 250,
                editable: true,
            },
            {
                field: 'btn1',
                headerName: "",
                sortable: false,
                filterable: false,
                renderCell: row => (
                    <CButton color="primary" onClick={() => {
                        //getDetails(row.id);
                        setShow(true)
                        console.log(show);    
                    }} >
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
                        getOneSeance(row.id)
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
                    <CButton   color="danger" onClick={()=>{deleteSeance(row.id)}} variant="outline" >
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                ),
            },
        ];
      useEffect(()=>{
        getSeances();
      },[]);
        
        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [newSeance, setNewSeances] = useState(
            {
                jour: "",
                duree: "",
                heureDebut: "",
                heureFin: "",
            });
        const [seance, setSeances] = useState(
            {
                jour: "",
                duree: "",
                heureDebut: "",
                heureFin: "",
            });
        
        const getSeances = () => {
            fetch(SERVER_URL+"seancesrest")
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
    
        const getOneSeance = (id) => {
            fetch(SERVER_URL+`seancesrest/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                      return null;
                    }
                })
                .then( donne =>
                  {
                    setSeances(donne);
                    console.log(donne);
                  }
                )
                .catch(err=>console.error(err));
        }
    
        const creteSeance = (sea) => {
            fetch(SERVER_URL+`seancesrest/create`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getSeances();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const editSeance = (id,sea) => {
            fetch(SERVER_URL+`seancesrest/edit/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getSeances();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const handleChange = (e) => {
            const value = e.target.value;
            setSeances({
              ...seance,
              [e.target.name]: value
            });
        }
    
        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewSeances({
              ...newSeance,
              [e.target.name]: value
            });
        }
    
        const deleteSeance = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer la seance ? :(")) {
                fetch(SERVER_URL+`seancesrest/delete/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getSeances();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }
    
        // const getDetails = (id) => {
        //     fetch(SERVER_URL+`Seancesrest/${id}/seances`,{
        //         method: "GET"
        //     })
        //     .then( answer=>{
        //         if (answer.status===200) {
        //             return answer.json();
        //         }else {
        //             return null;
        //         }
        //     })
        //     .then(data=>{
        //             setRowDetail(data);
        //     })
        //     .catch(err=>console.error(err));
        // }
    
    
        return (
        (show) ? ( <DetailRepartirions rowdetail={rowdetail} />) : (
          <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Seances</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.id_Seance}
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
            <CModal
            alignment="center"
            scrollable
            visible={visible}
            onClose={() => setVisible(false)}
            aria-labelledby="VerticallyCenteredScrollableExample"
            >
            <CModalHeader>
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier une Seance</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={seance.jour} name='jour' floatingLabel="Jour" placeholder="Jour" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={seance.duree} name='duree' floatingLabel="Duree" placeholder="Duree" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={seance.heureDebut} name='heureDebut' floatingLabel="Heure de Debut" placeholder="Heure de Debut" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={seance.heureFin} name='heureFin' floatingLabel="Heure de Fin" placeholder="Heure de Fin" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editSeance(idSelected,seance)}><CIcon icon={cilSave} /> Enregistrer</CButton>
            </CModalFooter>
            </CModal>
            <CModal
            alignment="center"
            scrollable
            visible={visible1}
            onClose={() => setVisible1(false)}
            aria-labelledby="VerticallyCenteredScrollableExample"
            >
            <CModalHeader>
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer une Seance</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3"  name='jour' floatingLabel="Jour" placeholder="Jour" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3"  name='duree' floatingLabel="Duree" placeholder="Duree" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3"  name='heureDebut' floatingLabel="Heure de Debut" placeholder="Heure de Debut" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3"  name='heureFin' floatingLabel="Heure de Fin" placeholder="Heure de Fin" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteSeance(newSeance); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
          </div>
        ));
    };
    
export default Seances;