import React, { useState, useEffect } from 'react'
import {Box, Container, List, Typography} from '@mui/joy'
import KeyComponent from '../components/KeyComponent'
import { getKeys } from '../service/GetKeys';
import CustomSnackBar from '../components/CustomSnackBar';

export default function Home() {
  const [data, setData] = useState([]);

  console.log(data);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const keys = await getKeys();
        setData(keys.response);
      } catch (error) {
        console.error('Error fetching keys:', error);
      }
    };
  
    fetchKeys();
  }, []);

  return (
    <Container>
      <Box mb={2}>
        <Typography variant="h6">Entries</Typography>
      </Box>
      <Typography>Search Bar</Typography>
      <List>
        {data.length === 0 ? <></> : data.map((item) => (
          <KeyComponent key={item.id} keyData={item} key_id={item.id} key_name={item.name} key_value={item.value} />
        ))}
      </List>
    </Container>
  );
}