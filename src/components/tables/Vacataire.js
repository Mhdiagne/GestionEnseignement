import { cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CTable, CTableHead } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { SERVER_URL } from 'src/_constantes';


const Vacataires = () => {
  const columns = [
    { field: 'id_Enseignant', headerName: 'ID', width: 90 },
    {
      field: 'prenom',
      headerName: 'Prenom',
      width: 150,
      editable: true,
    },
    {
      field: 'nom',
      headerName: 'Nom',
      width: 150,
      editable: true,
    },
    {
      field: 'grade',
      headerName: 'Grade',
      width: 110,
      editable: true,
    },
    {
      field: 'specialite',
      headerName: 'Specialite',
      editable: true,
      width: 160,
    },
    {
      field: 'btn1',
      headerName: "",
      sortable: false,
      filterable: false,
      renderCell: row => (
        <CButton color="primary" >
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
        <CButton color="info" variant="outline">
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
        <CButton   color="danger" variant="outline" >
            <CIcon icon={cilTrash} className="text-danger" />
        </CButton>
      ),
    },
  ];
  useEffect(()=>{
    getVacataires();
  },[]);
    
      const [rows, setRows] = useState([]);
    
      const getVacataires = () => {
        fetch(SERVER_URL+"vacatairesrest")
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
    return (
      <div>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          getRowId={row=>row.id_Enseignant}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
        />
      </Box>
      </div>
    );
};

export default Vacataires;