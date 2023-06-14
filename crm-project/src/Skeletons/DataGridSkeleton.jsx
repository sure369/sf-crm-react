import React from 'react'
import { Box, Skeleton } from "@mui/material"
import DataGridSkeleton from './DataGrid'

function DataGridSkeletons() {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px', justifyContent: "center", marginTop: '325px' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'space-between', marginTop: '-40px', marginBottom: '30px' }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '10px' }}>
                    <Skeleton animation='pulse' variant="h3" width={180} height={35} />
                    <Skeleton animation='pulse' variant="caption" width={180} />
                </Box>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', gap: '10px', alignItems: 'flex-end', marginBottom: '-20px' }}>
                    <Skeleton animation='pulse' variant="caption" width={80} height={40} />
                    <Skeleton animation='pulse' variant="caption" width={80} height={40} />
                </Box>
            </Box>
            {/* <Skeleton animation='pulse' variant="rectangular" width={1240} height={380} /> */}
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={40} />
            <Skeleton animation='pulse' variant="rectangular" width={1240} height={60} />
            {/* <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '-370px' }}>
                <DataGridSkeleton />
            </Box> */}
        </Box>
    )
}

export default DataGridSkeletons