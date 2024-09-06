import React from 'react'
import { Box, Input, Button } from '@mui/joy'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBar({ text }) {
    return (
        <div>
            <Box>
                <Input
                placeholder='Github..'
                sx={{minHeight: '50px'}}    
                    startDecorator={<FontAwesomeIcon icon={faMagnifyingGlass}  />}
                    endDecorator={<Button variant='soft' size='lg'><FontAwesomeIcon icon={faMagnifyingGlass} /></Button>} />
            </Box>
        </div>
    )
}
