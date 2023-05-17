import React from 'react';
import { Grid, Typography,Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';
import { useState } from 'react';


const StyledButton = styled(Button)(({ theme, isActive }) => ({
    backgroundColor: isActive ? "#99A3A4" : '#A9CCE3',
    color: isActive ? theme.palette.secondary.contrastText : theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius,
    textTransform: 'none',
    '&:hover': {
      backgroundColor: isActive ? "#99A3A4" : '#A9CCE3',
      opacity: isActive ? 0.9 : 0.7,
    },
  }));
  
  const TimelineTrack = ({ stages, activeStage, onItemClick ,record}) => {
   
    console.log(record,"record")

    const [selectedStage,setSelectedState]=useState()

    const handleItemClick = (stage) => {
        setSelectedState(stage)
        onItemClick(stage);
    };

    const handleConvertClick=(stage)=>{
        const obj ={...stage,
        convert:true
    }
        onItemClick(obj);
    }
  
      return (
          <Grid container spacing={2} justifyContent="center">
              {stages.map((stage) => (
                  <Grid item key={stage.id}>
                      <StyledButton
                          isActive={stage.value === activeStage}
                          onClick={() => handleItemClick(stage)}
                      >
                          {stage.value}
                      </StyledButton>
                  </Grid>
              ))}
              <Grid>
                  <Button 
                  variant="contained"
                  onClick={() => handleConvertClick(selectedStage)}
              disabled={record.leadStatus=== activeStage}
                  >
                    Convert Stage
                    </Button>
              </Grid>
          </Grid>
      );
  };

export default TimelineTrack;

// import React from 'react';
// import { styled } from '@mui/material/styles';
// import { Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineSeparator } from '@mui/lab';

// const StyledTimelineSeparator = styled(TimelineSeparator)(({ theme }) => ({
//     '& .MuiTimelineSeparator-root': {
//       marginRight: theme.spacing(2),
//     },
//     '& .MuiTimelineItem-root': {
//       minHeight: 'auto',
//       '&:before': {
//         display: 'none',
//       },
//     },
//     '&:before': {
//       content: '""',
//       position: 'absolute',
//       top: 0,
//       bottom: 0,
//       left: 'calc(50% - 1px)',
//       width: 2,
//       backgroundColor: theme.palette.secondary.main,
//     },
//   }));
  

// const HorizontalTimeline = ({ items, onItemClick }) => {
//   const handleItemClick = (item) => {
//     onItemClick(item);
//   };

//   return (
//     <Timeline position="left">
//       {items.map((item, index) => (
//         <TimelineItem key={index}>
//           <TimelineSeparator>
//             <TimelineDot color="secondary" />
//             {index < items.length - 1 && <TimelineConnector />}
//           </TimelineSeparator>
//           <StyledTimelineSeparator onClick={() => handleItemClick(item)}>
//             {item.value}
//           </StyledTimelineSeparator>
//         </TimelineItem>
//       ))}
//     </Timeline>
//   );
// };

// export default HorizontalTimeline;
