import React from 'react'
import { Box, Stepper, Step, StepLabel, StepButton, Button } from '@mui/material';
import { LeadStatusPicklist } from '../../data/pickLists';
import { useState } from 'react';
import { useEffect } from 'react';
import "./ModalLeadConvertion.css"


function LeadStepper({ stages, activeStage, onItemClick, record }) {

    const [activeStep, setActiveStep] = useState();
    const [selectedstage, setSelectedStage] = useState();

    console.log(record, "record")
    console.log(stages, "picklist");
    console.log(activeStage, "activeStage");

    useEffect(() => {
        const activeIndex = stages.findIndex((i) => i.value === activeStage);
        setActiveStep(activeIndex);
    }, [activeStage, stages]);

    const handleItemClick = (i) => {
        console.log('inside handleItemClick ', i);
        // console.log('index is ', index);
        setSelectedStage(i);
        console.log('selectedstage is ', selectedstage);
        // setSelectedStage(i)
        onItemClick(i);
    };

    const handleConvertClick = (stage) => {
        console.log('stage is ', stage);
        const obj = {
            ...stage,
            convert: true
        }
        onItemClick(obj);
    }


    return (
        <Box sx={{ width: '100%', height: "100%" }}>


            <Stepper activeStep={activeStep} alternativeLabel>
                {stages.map((i) => (
                    <Step key={i.value}>
                        <StepLabel onClick={() => handleItemClick(i)}>{i.value}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                <Button
                    variant="contained"
                    onClick={() => handleConvertClick(selectedstage)}
                    disabled={record.leadStatus === activeStage}
                >
                    Convert Stage
                </Button>
            </div>

        </Box>
    )
}

export default LeadStepper