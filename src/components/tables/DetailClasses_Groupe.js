import React from 'react';
import { cilArrowLeft, cilPencil, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton } from '@coreui/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { PropTypes } from 'prop-types';

const DetailClasses_Groupe = (props) => {

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
                    <h3 className="mb-3 mt-2 title-grid">Listes des groupes de la classe</h3>
                </center>
            </div>
            <Box sx={{ height: 500, width: '100%' }}>
                <DataGrid
                rows={props.rowdetail}
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
        </div>
    );
};
DetailClasses_Groupe.propTypes = {
    rowdetail: PropTypes.object.isRequired, // Ajoutez cette ligne pour valider la prop rowdetail
};

export default DetailClasses_Groupe;
