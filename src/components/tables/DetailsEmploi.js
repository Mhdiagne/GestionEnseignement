import React from 'react';
import { cilArrowLeft, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PropTypes } from 'prop-types';

const DetailsEmploi = (props) => {
    
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
            <div className='same-line'>
                <CButton onClick={()=>window.location.reload()} color='secondary' className='m-2'>
                    <CIcon icon={cilArrowLeft}/>&nbsp;&nbsp;back
                </CButton>
                <center>
                    <h3 className="mb-3 mt-2 title-grid">Listes des Seances d`un Emploi du Temps</h3>
                </center>
            </div>
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

DetailsEmploi.propTypes = {
    rowdetail: PropTypes.object.isRequired, // Ajoutez cette ligne pour valider la prop rowdetail
};


export default DetailsEmploi;