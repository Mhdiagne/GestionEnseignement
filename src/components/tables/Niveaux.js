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
import DetailNiveaux from './DetailNiveaux';


const Niveaux = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState({});
    const columns = [
        { field: 'idNiveau', headerName: 'ID', width: 90 },
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
                getOneNiveau(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteNiveaux(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];

    useEffect(()=>{
        getNiveaux();
    },[]);

    const [rows, setRows] = useState([]);
    const [niveau, setNiveau] = useState(
        {
            libelle:"",
            description:""
          }
        );
    const [newNiveau, setNewNiveau] = useState(
        {
          libelle:"",
          description:""
        }
        );

    const getNiveaux = () => {
        fetch(SERVER_URL+"maquette/niveau")
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

    const getOneNiveau = (id) => {
        fetch(SERVER_URL+`maquette/niveau/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setNiveau(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteNiveau = (vac) => {
        fetch(SERVER_URL+`maquette/niveau`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getNiveaux();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editNiveau = (id,vac) => {
        fetch(SERVER_URL+`maquette/niveau/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getNiveaux();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setNiveau({
          ...niveau,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewNiveau({
          ...newNiveau,
          [e.target.name]: value
        });
    }

    const deleteNiveaux = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le niveau ? :(")) {
            fetch(SERVER_URL+`maquette/niveau/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getNiveaux();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`maquette/niveau/${id}/formations`,{
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
    (show) ? ( <DetailNiveaux rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Niveaux</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.idNiveau}
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
        {/* Voici le modal qui gere la modification des niveaux */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Niveau</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" value={niveau.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
            <CFormInput type="text"  floatingClassName="mb-3" value={niveau.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
          </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editNiveau(idSelected,niveau)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des niveaux */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Niveau</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
            <CFormInput type="text"  floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteNiveau(newNiveau); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Niveaux;
