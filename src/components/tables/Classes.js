import React from 'react';
import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailClasses_Groupe from './DetailClasses_Groupe';
import DetailClasses_Formation from './DetailClasses_Formation';
import DetailClasses_Enseignement from './DetailClasses_Enseignement';

const Classe = () => {
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [idDetail, setIdDetail] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'idClasse', headerName: 'ID', width: 90 },
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
                        getDetails0(row.id);
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
                        getOneClasse(row.id)
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
                    <CButton   color="danger" onClick={()=>{deleteClasse(row.id)}} variant="outline" >
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                ),
            },
        ];
        useEffect(()=>{
        getClasse();
        },[]);

        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [rowdetail0, setRowDetail0] = useState([]);
        const [rowdetail1, setRowDetail1] = useState([]);
        const [renduDetail, setRenduDetail] = useState("detail1");
        const [newClasse, setNewClasse] = useState(
            {
                libelle: "",
                description: "",
                nbreGroupe: ""
            });
        const [classe, setClasse] = useState(
            {
                libelle: "",
                description: "",
                nbreGroupe: ""
            });

        const getClasse = () => {
            fetch(SERVER_URL+"maquette/classe")
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

        const getOneClasse = (id) => {
            fetch(SERVER_URL+`maquette/classe/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                        return null;
                    }
                })
                .then( donne =>
                    {
                    setClasse(donne);
                    console.log(donne);
                    }
                )
                .catch(err=>console.error(err));
        }

        const creteClasse = (sea) => {
            fetch(SERVER_URL+`maquette/classe`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getClasse();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }

        const editClasse = (id,sea) => {
            fetch(SERVER_URL+`maquette/classe/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getClasse();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }

        const handleChange = (e) => {
            const value = e.target.value;
            setClasse({
                ...classe,
                [e.target.name]: value
            });
        }

        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewClasse({
                ...newClasse,
                [e.target.name]: value
            });
        }

        const deleteClasse = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer le Classe ? :(")) {
                fetch(SERVER_URL+`maquette/classe/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getClasse();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }

        const getDetails = (id) => {
            fetch(SERVER_URL+`maquette/classe/${id}/groupes`,{
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
        const getDetails0 = (id) => {
            fetch(SERVER_URL+`maquette/classe/${id}/formations`,{
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
                    setRowDetail0(data);
            })
            .catch(err=>console.error(err));
        }
        const getDetails1 = (id) => {
            fetch(SERVER_URL+`maquette/classe/${id}/enseignements`,{
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
            ({renduDetail==="detail0"}) ? (<DetailClasses_Groupe rowdetail={rowdetail} />) :
            ({renduDetail==="detail1"}) ?
            (<DetailClasses_Formation rowdetail={rowdetail0} /> ) :
            (<DetailClasses_Enseignement rowdetail={rowdetail1} />)
          </>
        ) : (
            <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Classes</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.idClasse}
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Classe</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={classe.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={classe.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={classe.nbreGroupe} name='nbreGroupe' floatingLabel="Nombre de groupe" placeholder="Nombre de groupe" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editClasse(idSelected,classe)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Classe</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3" name='nbreGroupe' floatingLabel="Nombre de groupes" placeholder="Nombre de groupes" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteClasse(newClasse); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
            </div>
        ));
    };

export default Classe;
