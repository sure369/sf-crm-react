import { Card, CardContent, Typography } from '@mui/material';

const NoAccessCard = () => {
    return (
        <Card sx={{ bgcolor: "error.main", color: "error.contrastText" }}>
          <CardContent>
            <Typography variant="h4">You have no access</Typography>
          </CardContent>
        </Card>
       );
};

export default NoAccessCard;