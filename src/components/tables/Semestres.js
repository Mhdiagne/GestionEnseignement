import React from 'react';
import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
//import DetailRepartirions from './DetailRepartirions';
import DetailSemestre_Module from './DetailSemestre_Module';
import DetailSemestre_Classe from './DetailSemestre_Classe';

const Semestres = () => {
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'idSemestre', headerName: 'ID', width: 90 },
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
                field: 'nbreGroupe',
                headerName: 'Nombre de groupes',
                width: 150,
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
                        getDetails1(row.id);
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
                        getOneSemestre(row.id)
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
                    <CButton   color="danger" onClick={()=>{deleteSemestre(row.id)}} variant="outline" >
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                ),
            },
        ];
        useEffect(()=>{
        getSemestre();
        },[]);

        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [rowdetail1, setRowDetail1] = useState([]);
        const [newSemestre, setNewSemestre] = useState(
            {
                libelle: "",
                description: "",
                nbreGroupe: ""
            });
        const [semestre, setSemestre] = useState(
            {
                libelle: "",
                description: "",
                nbreGroupe: ""
            });

        const getSemestre = () => {
            fetch(SERVER_URL+"maquette/semestre")
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

        const getOneSemestre = (id) => {
            fetch(SERVER_URL+`maquette/semestre/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                        return null;
                    }
                })
                .then( donne =>
                    {
                    setSemestre(donne);
                    console.log(donne);
                    }
                )
                .catch(err=>console.error(err));
        }

        const creteSemestre = (sea) => {
            fetch(SERVER_URL+`maquette/semestre`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getSemestre();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }

        const editSemestre = (id,sea) => {
            fetch(SERVER_URL+`maquette/semestre/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getSemestre();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }

        const handleChange = (e) => {
            const value = e.target.value;
            setSemestre({
                ...semestre,
                [e.target.name]: value
            });
        }

        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewSemestre({
                ...newSemestre,
                [e.target.name]: value
            });
        }

        const deleteSemestre = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer le Semestre ? :(")) {
                fetch(SERVER_URL+`maquette/semestre/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getSemestre();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }

        const getDetails = (id) => {
            fetch(SERVER_URL+`maquette/semestre/${id}/modules`,{
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
        const getDetails1 = (id) => {
            fetch(SERVER_URL+`maquette/semestre/${id}/classes`,{
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
                    setRowDetail1(data);
            })
            .catch(err=>console.error(err));
        }


        return (
        (show) ?
        ( <>
            <DetailSemestre_Module rowdetail={rowdetail} />
            <DetailSemestre_Classe rowdetail={rowdetail1} />
          </>
        ) :

        (
            <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Semestres</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.idSemestre}
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Semestre</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={semestre.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={semestre.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editSemestre(idSelected,semestre)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Semestre</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteSemestre(newSemestre); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
            </div>
        ));
    };

export default Semestres;
