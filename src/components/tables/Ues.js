import React from 'react';
import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
//import DetailRepartirions from './DetailRepartirions';
import DetailUes_EC from './DetailUes_EC';

const Ues = () => {
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'idUE', headerName: 'ID', width: 90 },
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
                field: 'code',
                headerName: 'Code',
                width: 100,
                editable: true,
            },
            {
                field: 'credit',
                headerName: 'Credit',
                width: 100,
                editable: true,
            },
            {
                field: 'coefficient',
                headerName: 'Coefficient',
                width: 100,
                editable: true,
            },
            {
                field: 'dateCreation',
                headerName: 'Date de Creation',
                width: 100,
                editable: true,
            },
            {
                field: 'btn1',
                headerName: "",
                sortable: false,
                filterable: false,
                renderCell: row => (
                    <CButton color="primary" onClick={() => {
                        getDetails(row.id);
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
                        getOneUe(row.id)
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
                    <CButton   color="danger" onClick={()=>{deleteUe(row.id)}} variant="outline" >
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                ),
            },
        ];
        useEffect(()=>{
        getUes();
        },[]);

        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [newUe, setNewUes] = useState(
            {
                libelle: "",
                code: "",
                description: "",
                credit: "",
                coefficient: "",
                dateCreation: ""
            });
        const [ue, setUes] = useState(
            {
                libelle: "",
                code: "",
                description: "",
                credit: "",
                coefficient: "",
                dateCreation: ""
            });

        const getUes = () => {
            fetch(SERVER_URL+"maquette/ue/all")
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

        const getOneUe = (id) => {
            fetch(SERVER_URL+`maquette/ue/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                        return null;
                    }
                })
                .then( donne =>
                    {
                    setUes(donne);
                    console.log(donne);
                    }
                )
                .catch(err=>console.error(err));
        }

        const creteUe = (sea) => {
            fetch(SERVER_URL+`maquette/ue/add`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getUes();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }

        const editUe = (id,sea) => {
            fetch(SERVER_URL+`maquette/ue/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getUes();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }

        const handleChange = (e) => {
            const value = e.target.value;
            setUes({
                ...ue,
                [e.target.name]: value
            });
            setIdSelected({[e.target.name]: value});
            console.log(idSelected);
        }

        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewUes({
                ...newUe,
                [e.target.name]: value
            });
        }

        const deleteUe = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer le Ue ? :(")) {
                fetch(SERVER_URL+`maquette/ue/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getUes();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }

        const getDetails = (id) => {
            fetch(SERVER_URL+`maquette/ue/${id}/ecs`,{
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
        (show) ? ( <DetailUes_EC rowdetail={rowdetail} />) : (
            <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Ues</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.idUE}
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Ue</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.code} name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.credit} name='credit' floatingLabel="Credit" placeholder="Credit" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.coefficient} name='coefficient' floatingLabel="Coefficient" placeholder="Coefficient" onChange={handleChange} />
                <CFormInput type="date"  floatingClassName="mb-3" value={ue.dateCreation} name='dateCreation' floatingLabel="Coefficient" placeholder="Coefficient" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editUe(ue.idUE,ue)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Ue</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.code} name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.credit} name='credit' floatingLabel="Credit" placeholder="Credit" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" value={ue.coefficient} name='coefficient' floatingLabel="Coefficient" placeholder="Coefficient" onChange={handleChange1} />
                <CFormInput type="date"  floatingClassName="mb-3" value={ue.dateCreation} name='dateCreation' floatingLabel="Date de Creation" placeholder="Date de Creation" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteUe(newUe); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
            </div>
        ));
    };

export default Ues;
