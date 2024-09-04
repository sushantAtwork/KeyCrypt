import React from 'react'
import Navbar from '../components/Navbar'
import { Container, Box } from '@mui/joy'
import '../assets/css/pages/Welcome.css'
import CustomCard from '../components/CustomCard'
import Welcome1 from '../assets/gifs/welcome1.gif'
import Welcome2 from '../assets/gifs/welcomeCard1.gif'
import Welcome3 from '../assets/gifs/welcomeCard2.gif'
import Welcome4 from '../assets/gifs/welcomeCard3.gif'
import Welcome5 from '../assets/gifs/welcomeCard4.gif'





export default function Welcome() {
    return (
        <div>
            <Navbar />
            <Container className="container">
                <Box className="box" sx={{ display: 'flex', flexDirection: 'row' }}>
                    <Container className="container" sx={{display: 'flex', justifyContent: 'space-around'}}>
                    <img src={Welcome1} alt="Welcome1" />
                    </Container>
                    <Container className="container">
                        <h1>You can import images in your React components using the import statement. Here's a basic example</h1>
                        <p>You can import images in your React components using the import statement</p>
                    </Container>
                </Box>
                <Box className="box">
                    <Box sx={{display:'flex', flexDirection: 'row', justifyContent: 'space-evenly', height: '100%'}}>
                        <CustomCard image={Welcome2} title={'Encryption'} content={'tttt'}/>
                        <CustomCard image={Welcome3} title={'Secured'} content={'tttt'}/>
                        <CustomCard image={Welcome4} title={'Cross Platform'} content={'tttt'}/>
                        <CustomCard image={Welcome5} title={'hashed_password Generator'} content={'tttt'}/>
                   </Box>
                </Box>
                <Box className="box">3</Box>
                <Box className="box">4</Box>
            </Container>
        </div>
    )
}
