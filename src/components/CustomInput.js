import { Box, Typography, FormHelperText, Textarea } from '@mui/joy'
import React from 'react'

export default function CustomInput({ title, name, type, size, hint, onChange}) {
    hint = false;
    return (
        <Box sx={{ margin: '10px', width: '50%' }}>
            <Typography sx={{ margin: '0 10px' }}>{title}</Typography>
            <Textarea placeholder={name} variant='soft' type={type} size={size} onChange={onChange} name={name}>
                CustomInput
            </Textarea>
            {hint === false ?
                <>{hint}</> 
                :
                <>
                    <FormHelperText sx={{ margin: '5px 10px', color: 'black' }}>{hint}</FormHelperText>
                </>}
        </Box>
    )
}
