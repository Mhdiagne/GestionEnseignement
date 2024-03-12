import React from 'react';
import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailMaquettes from './DetailMaquettes';

const Maquettes = () => {
        const [visible, setVisible] = useState(false)
        const [visible1, setVisible1] = useState(false)
        const [idSelected, setIdSelected] = useState(0);
        const [show, setShow] = useState(false);
        const columns = [
            { field: 'idMaquette', headerName: 'ID', width: 90 },
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
                        getOneMaquette(row.id)
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
                    <CButton   color="danger" onClick={()=>{deleteMaquette(row.id)}} variant="outline" >
                        <CIcon icon={cilTrash} className="text-danger" />
                    </CButton>
                ),
            },
        ];
      useEffect(()=>{
        getMaquettes();
      },[]);

        const [rows, setRows] = useState([]);
        const [rowdetail, setRowDetail] = useState([]);
        const [newMaquette, setNewMaquettes] = useState(
            {
                libelle: "",
                description: "",
                code: "",
            });
        const [maquette, setMaquettes] = useState(
            {
              libelle: "",
              description: "",
              code: "",
            });

        const getMaquettes = () => {
            fetch(SERVER_URL+"maquette/maquette")
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

        const getOneMaquette = (id) => {
            fetch(SERVER_URL+`maquette/maquette/${id}`)
                .then( answer=>{
                    if (answer.status===200) {
                        return answer.json();
                    }else {
                      return null;
                    }
                })
                .then( donne =>
                  {
                    setMaquettes(donne);
                    console.log(donne);
                  }
                )
                .catch(err=>console.error(err));
        }

        const creteMaquette = (sea) => {
            fetch(SERVER_URL+`maquette/maquette`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible1(false);
                    getMaquettes();
                    alert("Votre ajout a ete un succes :)")
                } else {
                    alert("Un probleme est survenu lors de la creation !")
                }
            })
            .catch(err => console.error(err))
        }

        const editMaquette = (id,sea) => {
            fetch(SERVER_URL+`maquette/maquette/${id}`,{
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(sea)
            })
            .then(response => {
                if (response.ok) {
                    setVisible(false)
                    getMaquettes();
                    alert("Les données ont été modifié avec succes :)")
                } else {
                    alert("Un probleme est survenu lors de la modification !")
                }
            })
            .catch(err => console.error(err))
        }

        const handleChange = (e) => {
            const value = e.target.value;
            setMaquettes({
              ...maquette,
              [e.target.name]: value
            });
        }

        const handleChange1 = (e) => {
            const value = e.target.value;
            setNewMaquettes({
              ...newMaquette,
              [e.target.name]: value
            });
        }

        const deleteMaquette = (id) => {
            if (window.confirm("Etes vous sur de vouloir supprimer la maquette ? :(")) {
                fetch(SERVER_URL+`maquette/maquette/${id}`,{
                    method: "DELETE"
                })
                .then(response => {
                    if (response.ok) {
                        getMaquettes();
                    } else {
                        alert("Un probleme est survenu lors de la suppression !")
                    }
                })
                .catch(err => console.error(err))
            }
        }

        const getDetails = (id) => {
            fetch(SERVER_URL+`maquette/maquette/${id}/modules`,{
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
        (show) ? ( <DetailMaquettes rowdetail={rowdetail} />) : (
          <div>
            <div className='same-line'>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Maquettes</h3>
                </center>
                <CButton onClick={() => setVisible1(!visible1)} className='mb-3 btn-right' color='success'>
                    <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
                </CButton>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={rows}
                getRowId={row=>row.idMaquette}
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier une Maquette</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3" value={maquette.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={maquette.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
                <CFormInput type="text"  floatingClassName="mb-3" value={maquette.code} name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={() => editMaquette(idSelected,maquette)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
                <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer une Maquette</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CFormInput type="text"  floatingClassName="mb-3"  name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3"  name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
                <CFormInput type="text"  floatingClassName="mb-3"  name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange1} />
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={() => setVisible1(false)}>
                <CIcon icon={cilX} />Fermer
                </CButton>
                <CButton color="primary" onClick={()=> {creteMaquette(newMaquette); setVisible1(false)}} >
                    <CIcon icon={cilSave} /> Ajouter
                </CButton>
            </CModalFooter>
            </CModal>
          </div>
        ));
    };

export default Maquettes;
