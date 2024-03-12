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
import DetailGroupes from './DetailGroupes';


const Groupes = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState([]);
    const columns = [
        { field: 'idGroupe', headerName: 'ID', width: 90 },
        {
        field: 'libelle',
        headerName: 'Libelle',
        width: 110,
        editable: true,
        },
        {
        field: 'description',
        headerName: 'Description',
        editable: true,
        width: 160,
        },
        {
        field: 'numero',
        headerName: 'Numero',
        editable: true,
        width: 160,
        },
        {
        field: 'effectif',
        headerName: 'Effectif',
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
                getOneGroupe(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteGroupes(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];

    useEffect(()=>{
        getGroupes();
    },[]);

    const [rows, setRows] = useState([]);
    const [groupe, setGroupe] = useState(
        {
            libelle:"",
            description:"",
            numero:"",
            effectif:""
          }
        );
    const [newGroupe, setNewGroupe] = useState(
        {
          libelle:"",
          description:"",
          numero:"",
          effectif:""
        }
        );

    const getGroupes = () => {
        fetch(SERVER_URL+"maquette/groupe")
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

    const getOneGroupe = (id) => {
        fetch(SERVER_URL+`maquette/groupe/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setGroupe(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteGroupe = (vac) => {
        fetch(SERVER_URL+`maquette/groupe`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getGroupes();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editGroupe = (id,vac) => {
        fetch(SERVER_URL+`maquette/groupe/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getGroupes();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setGroupe({
          ...groupe,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewGroupe({
          ...newGroupe,
          [e.target.name]: value
        });
    }

    const deleteGroupes = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le groupe ? :(")) {
            fetch(SERVER_URL+`maquette/groupe/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getGroupes();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`maquette/groupe/${id}/enseignements`,{
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
    (show) ? ( <DetailGroupes rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Groupes</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.idGroupe}
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
        {/* Voici le modal qui gere la modification des groupes */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Groupe</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" value={groupe.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={groupe.numero} name='numero' floatingLabel="Numero" placeholder="Numero" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={groupe.effectif} name='effectif' floatingLabel="Effectif" placeholder="Effectif" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={groupe.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editGroupe(idSelected,groupe)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des groupes */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Groupe</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='numero' floatingLabel="Numero" placeholder="Numero" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='effectif' floatingLabel="Effectif" placeholder="Effectif" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteGroupe(newGroupe); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Groupes;
