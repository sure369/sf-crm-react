import React ,{useEffect} from 'react'
import { Button,Grid,Paper,Avatar,TextField,Typography,
    FormControlLabel , Checkbox,Link,Box} from "@mui/material"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FormikLogin from './FormikLogin';

export default function LoginIndex() {

    const paperStyle={padding :20,height:'70vh',width:280, margin:"20px auto"}
    const avatarStyle={backgroundColor:'#1bbd7e'}
    const btnstyle={margin:'8px 0'}
    return(
        <Grid>
            <Paper elevation={10} style={paperStyle}>
                <Grid align='center'>
                     <Avatar style={avatarStyle}><LockOpenIcon/></Avatar>
                    <h2>Sign In</h2>
                </Grid>
                <FormikLogin/>

{/* <Grid 
        spacing={2}
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
>
  <Grid item >
  <TextField label='Username' placeholder='Enter username' type='email' fullWidth required/>
  </Grid>
  <Grid item>
    <TextField label='Password' placeholder='Enter password' type='password' fullWidth required/>
  </Grid>
        
  <Grid item >
                  <Button type='submit' color='primary' variant="contained" style={btnstyle} fullWidth>Sign in</Button>
                  </Grid>    
                  </Grid>               */}

                {/* </Box> */}
                <FormControlLabel
                    control={
                    <Checkbox
                        name="checkedB"
                        color="primary"
                    />
                    }
                    label="Remember me"
                 />
                 
                
                <Typography >
                     <Link href="#" >
                        Forgot password ?
                </Link>
                </Typography>
                <Typography > Do you have an account ?
                     <Link href="#" >
                        Sign Up 
                </Link>
                </Typography>

                 
            </Paper>
        </Grid>
    )

}
