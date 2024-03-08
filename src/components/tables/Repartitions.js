import { cilPencil, cilPlus, cilSave, cilTrash, cilX } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CFormInput, CFormSelect, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';
import DetailRepartirions from './DetailRepartirions';

const Repartitions = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [ensSelected, setEnsSelected] = useState({
        id: 0,
        prenom: "",
        nom: "",
        type: ""
    });
    const columns = [
        { field: 'id_Repartition', headerName: 'ID', width: 90 },
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
                getOneRepartition(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteRepartition(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];
  useEffect(()=>{
    getRepartitions();
  },[]);
    
    const [rows, setRows] = useState([]);
    const [ensOption, setEnsOptions] = useState([
        {
            id: 0,
            prenom: "",
            nom: "",
            type: ""
        }
    ]);
    const [rowdetail, setRowDetail] = useState([]);
    const [repartition, setRepartition] = useState(
        {
            description: ""
        });
    const [newRepartition, setNewRepartition] = useState(
        {
            description: "",
            enseignant: {}
        });
    
    const getRepartitions = () => {
        fetch(SERVER_URL+"repartitionsrest")
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

    const getOneRepartition = (id) => {
        fetch(SERVER_URL+`repartitionsrest/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setRepartition(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteRepartition = (vac) => {
        vac.enseignant = ensSelected;
        fetch(SERVER_URL+`repartitionsrest/create`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getRepartitions();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editRepartition = (id,vac) => {
        fetch(SERVER_URL+`repartitionsrest/edit/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getRepartitions();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setRepartition({
          ...repartition,
          [e.target.name]: value
        });
        setEnsSelected({[e.target.name]: value});
        console.log(ensSelected);
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewRepartition({
          ...newRepartition,
          [e.target.name]: value
        });
    }

    const deleteRepartition = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le repartition ? :(")) {
            fetch(SERVER_URL+`repartitionsrest/delete/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getRepartitions();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`repartitionsrest/${id}/seances`,{
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

    const getEnseignants = () => {
        fetch(SERVER_URL+`enseignantsrest`,{
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
            const donnes = data.map(opt=>{return {
                id: opt.id_Enseignant,
                prenom: opt.prenom,
                nom: opt.nom,
                type: opt.type
        }})
            setEnsOptions(donnes);
            console.log(ensOption);
        })
        .catch(err=>console.error(err));
    }


    return (
    (show) ? ( <DetailRepartirions rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Repartitions</h3>
            </center>
            <CButton onClick={() => {setVisible1(!visible1); getEnseignants()}} className='mb-3 btn-right' color='success'>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.id_Repartition}
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
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un repartition</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" value={repartition.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editRepartition(idSelected,repartition)}><CIcon icon={cilSave} /> Enregistrer</CButton>
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
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un repartition</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            <CFormSelect aria-label="Default select example" options={ensOption.map(opt=>
                opt.id+" "+opt.prenom+" "+opt.nom+" "+opt.type
                )}  name='enseignant' onChange={handleChange}/>
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteRepartition(newRepartition); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Repartitions;