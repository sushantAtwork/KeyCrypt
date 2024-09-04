import { Card } from '@mui/joy'
import React from 'react'

export default function CustomCard({image, title, content}) {
  return (
    <Card sx={{margin: '10px',width:'100%'}}>
      <img src={image} alt={title} style={{ width: '100%', borderRadius: '4px' }} height={'140'} width={'140'}/>
      <h2 align="center">{title}</h2>
      {/* <p>{content}</p> */}
    </Card>
  )
}
