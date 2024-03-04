import React from 'react';
import { cilArrowLeft, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const detailRepartirions = (props) => {

    const columns = [
        { field: 'id_Seance', headerName: 'ID', width: 90 },
        {
        field: 'jour',
        headerName: 'Jour',
        width: 150,
        editable: true,
        },
        {
        field: 'duree',
        headerName: 'Duree',
        width: 150,
        editable: true,
        },
        {
        field: 'heureDebut',
        headerName: 'Heure de Fin',
        width: 150,
        editable: true,
        },
        {
        field: 'heureFin',
        headerName: 'Heure de Fin',
        width: 150,
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
        //     <CButton color="primary" >
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

    return (
        <div>
            <center>
                <h3 className="mb-3 mt-2 title-grid">Listes des Seances d`une repartition</h3>
            </center>
            <CButton onClick={()=>window.location.reload()} className='text-secondary m-2' variant='outlined'>
                <CIcon icon={cilArrowLeft}/>&nbsp;&nbsp;back
            </CButton>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={props.rowdetail}
                getRowId={row=>row.id_Seance}
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
        </div>
    );
};

export default detailRepartirions;