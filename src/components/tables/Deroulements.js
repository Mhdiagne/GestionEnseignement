import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailRepartirions from './DetailRepartirions';

const Deroulements = () => {
    
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'id_Deroulement', headerName: 'ID', width: 90 },
            {
                field: 'objectifs',
                headerName: 'Objectifs',
                width: 250,
                editable: true,
            },
            {
            field: 'description',
            headerName: 'Description',
            width: 250,
            editable: true,
            },
            {
            field: 'dateCreation',
            headerName: 'Date de Creation',
            width: 250,
            editable: true,
            },
            // {
            // field: 'btn1',
            // headerName: "",
            // sortable: false,
            // filterable: false,
            // renderCell: row => (
            //     <CButton color="primary" onClick={() => {
            //         getDetails(row.id);
            //         setShow(true)
            //         console.log(show);    
            //     }} >
            //     details
            //     </CButton>
            // )
            // },
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
                    getOneDeroulement(row.id)
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
                <CButton   color="danger" onClick={()=>{deleteDeroulement(row.id)}} variant="outline" >
                    <CIcon icon={cilTrash} className="text-danger" />
                </CButton>
            ),
            },
        ];
      useEffect(()=>{
        getDeroulements();
      },[]);
        
        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [deroulement, setDeroulement] = useState(
            {
                objectifs: "",
                description: ""
            });
        const [newDeroulement, setNewDeroulement] = useState(
            {
                objectifs: "",
                description: ""
            });
        
        const getDeroulements = () => {
            fetch(SERVER_URL+"deroulementsrest")
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
    
        const getOneDeroulement = (id) => {
            fetch(SERVER_URL+`deroulementsrest/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                      return null;
                    }
                })
                .then( donne =>
                  {
                    setDeroulement(donne);
                    console.log(donne);
                  }
                )
                .catch(err=>console.error(err));
        }
    
        const creteDeroulement = (vac) => {
            fetch(SERVER_URL+`deroulementsrest/create`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(vac)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getDeroulements();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const editDeroulement = (id,vac) => {
            fetch(SERVER_URL+`deroulementsrest/edit/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(vac)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getDeroulements();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }
    
        const handleChange = (e) => {
            const value = e.target.value;
            setDeroulement({
              ...deroulement,
              [e.target.name]: value
            });
        }
    
        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewDeroulement({
              ...newDeroulement,
              [e.target.name]: value
            });
        }
    
        const deleteDeroulement = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer le Deroulement ? :(")) {
                fetch(SERVER_URL+`deroulementsrest/delete/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getDeroulements();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }
    
        // const getDetails = (id) => {
        //     fetch(SERVER_URL+`deroulementsrest/${id}/seances`,{
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
                    <h3 className="mb-3 mt-2 title-grid">Listes des Deroulements</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.id_Deroulement}
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Deroulement</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={deroulement.objectifs} name='objectifs' floatingLabel="Objectifs" placeholder="Objectifs" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={deroulement.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editDeroulement(idSelected,deroulement)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Deroulement</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" name='objectifs' floatingLabel="Objectifs" placeholder="Objectifs" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteDeroulement(newDeroulement); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
          </div>
        ));
    };

export default Deroulements;