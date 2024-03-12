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
import DetailEcs from './DetailEcs';


const Ecs = () => {

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const [idSelected, setIdSelected] = useState(0);
    const [show, setShow] = useState(false);
    const [rowdetail, setRowDetail] = useState([]);
    const columns = [
        { field: 'idEC', headerName: 'ID', width: 50 },
        {
        field: 'libelle',
        headerName: 'Libelle',
        width: 100,
        editable: true,
        },
        {
        field: 'code',
        headerName: 'Code',
        width: 100,
        editable: true,
        },
        {
        field: 'description',
        headerName: 'Description',
        width: 110,
        editable: true,
        },
        {
        field: 'cm',
        headerName: 'CM',
        editable: true,
        width: 50,
        },
        {
        field: 'td',
        headerName: 'TD',
        editable: true,
        width: 50,
        },
        {
        field: 'tp',
        headerName: 'TP',
        editable: true,
        width: 50,
        },
        {
        field: 'tpe',
        headerName: 'TPE',
        editable: true,
        width: 50,
        },
        {
        field: 'cumulcmtdtp',
        headerName: 'Cumul Credit',
        editable: true,
        width: 50,
        },
        {
        field: 'coefficient',
        headerName: 'Coefficient',
        editable: true,
        width: 50,
        },
        {
        field: 'volumeht',
        headerName: 'Volume Horaire',
        editable: true,
        width: 50,
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
                getOneEc(row.id)
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
            <CButton   color="danger" onClick={()=>{deleteEcs(row.id)}} variant="outline" >
                <CIcon icon={cilTrash} className="text-danger" />
            </CButton>
        ),
        },
    ];

    useEffect(()=>{
        getEcs();
    },[]);

    const [rows, setRows] = useState([]);
    const [ec, setEc] = useState(
        {
            libelle:"",
            code:"",
            description:"",
            cm:"",
            td:"",
            tp:"",
            tpe:"",
            cumulcmtdtp:"",
            coefficient:"",
            volumeht:""
        }
        );
    const [newEc, setNewEc] = useState(
        {
          libelle:"",
          code:"",
          description:"",
          cm:"",
          td:"",
          tp:"",
          tpe:"",
          cumulcmtdtp:"",
          coefficient:"",
          volumeht:""
        }
        );

    const getEcs = () => {
        fetch(SERVER_URL+"maquette/ec")
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

    const getOneEc = (id) => {
        fetch(SERVER_URL+`maquette/ec/${id}`)
            .then( answer=>{
                if (answer.status===200) {
                    return answer.json();
                }else {
                  return null;
                }
            })
            .then( donne =>
              {
                setEc(donne);
                console.log(donne);
              }
            )
            .catch(err=>console.error(err));
    }

    const creteEc = (vac) => {
        fetch(SERVER_URL+`maquette/ec`,{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible1(false);
                getEcs();
                alert("Votre ajout a ete un succes :)")
            } else {
                alert("Un probleme est survenu lors de la creation !")
            }
        })
        .catch(err => console.error(err))
    }

    const editEc = (id,vac) => {
        fetch(SERVER_URL+`maquette/ec/${id}`,{
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(vac)
        })
        .then(response => {
            if (response.ok) {
                setVisible(false)
                getEcs();
                alert("Les données ont été modifié avec succes :)")
            } else {
                alert("Un probleme est survenu lors de la modification !")
            }
        })
        .catch(err => console.error(err))
    }

    const handleChange = (e) => {
        const value = e.target.value;
        setEc({
          ...ec,
          [e.target.name]: value
        });
    }

    const handleChange1 = (e) => {
        const value = e.target.value;
        setNewEc({
          ...newEc,
          [e.target.name]: value
        });
    }

    const deleteEcs = (id) => {
        if (window.confirm("Etes vous sur de vouloir supprimer le ec ? :(")) {
            fetch(SERVER_URL+`maquette/ec/${id}`,{
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    getEcs();
                } else {
                    alert("Un probleme est survenu lors de la suppression !")
                }
            })
            .catch(err => console.error(err))
        }
    }

    const getDetails = (id) => {
        fetch(SERVER_URL+`maquette/ec/${id}/modules`,{
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
    (show) ? ( <DetailEcs rowdetail={rowdetail} />) : (
      <div>
        <div className='same-line'>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Ecs</h3>
            </center>
            <CButton onClick={() => setVisible1(!visible1)} className='mb-3' color='success' style={{textAlign:'right'}}>
                <b><CIcon icon={cilPlus}/>Nouveau &nbsp;</b>
            </CButton>
        </div>
        <Box sx={{ height: 500, width: '100%' }}>
            <DataGrid
            rows={rows}
            getRowId={row=>row.idEC}
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
        {/* Voici le modal qui gere la modification des ecs */}
        <CModal
        alignment="center"
        scrollable
        visible={visible}
        onClose={() => setVisible(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Modifier un Ec</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text"  floatingClassName="mb-3" value={ec.libelle} name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.code} name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.description} name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.cm} name='cm' floatingLabel="CM" placeholder="CM" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.td} name='td' floatingLabel="TD" placeholder="TD" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.tp} name='tp' floatingLabel="TP" placeholder="TP" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.tpe} name='tpe' floatingLabel="TPE" placeholder="TPE" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.cumulcmtdtp} name='cumulcmtdtp' floatingLabel="Cumul CM/TD/TP" placeholder="Cumul CM/TD/TP" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.coefficient} name='coefficient' floatingLabel="Coefficient" placeholder="Coefficient" onChange={handleChange} />
            <CFormInput type="text" floatingClassName="mb-3" value={ec.volumeht} name='volumeht' floatingLabel="Volume HT" placeholder="Volume HT" onChange={handleChange} />
            </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={() => editEc(idSelected,ec)}><CIcon icon={cilSave} /> Enregistrer</CButton>
        </CModalFooter>
        </CModal>

        {/* Voici le modal qui gere la creation des ecs */}
        <CModal
        alignment="center"
        scrollable
        visible={visible1}
        onClose={() => setVisible1(false)}
        aria-labelledby="VerticallyCenteredScrollableExample"
        >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2" >Créer un Ec</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <CFormInput type="text" floatingClassName="mb-3" name='libelle' floatingLabel="Libelle" placeholder="Libelle" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='code' floatingLabel="Code" placeholder="Code" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='description' floatingLabel="Description" placeholder="Description" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='cm' floatingLabel="CM" placeholder="CM" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='td' floatingLabel="TD" placeholder="TD" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='tp' floatingLabel="TP" placeholder="TP" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='tpe' floatingLabel="TPE" placeholder="TPE" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='cumulcmtdtp' floatingLabel="Cumul CM/TD/TP" placeholder="Cumul CM/TD/TP" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='coefficient' floatingLabel="Coefficient" placeholder="Coefficient" onChange={handleChange1} />
            <CFormInput type="text" floatingClassName="mb-3" name='volumeht' floatingLabel="Volume HT" placeholder="Volume HT" onChange={handleChange1} />
        </CModalBody>
        <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible1(false)}>
            <CIcon icon={cilX} />Fermer
            </CButton>
            <CButton color="primary" onClick={()=> {creteEc(newEc); setVisible1(false)}} >
                <CIcon icon={cilSave} /> Ajouter
            </CButton>
        </CModalFooter>
        </CModal>
      </div>
    ));
};

export default Ecs;
