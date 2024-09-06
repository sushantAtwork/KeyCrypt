import React, { useState, useEffect } from 'react';
import { Box, Button, Container, List, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
import KeyComponent from '../components/KeyComponent';
import { getKeys } from '../service/GetKeys';
import CustomSnackBar from '../components/CustomSnackBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';
import CustomInput from '../components/CustomInput';
import { createKey } from '../service/CreateKey';
import { deleteKey } from '../service/DeleteKey';
import Navbar from '../components/Navbar';
import SearchBar from '../components/SearchBar';
import ConfirmationDialog from '../components/ConfirmDialog';

const styles = {
  container: {
    position: "relative",
  },
  button: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
    zIndex: 1000,
  },
};

export default function Home() {
  const [data, setData] = useState([]);
  const [openModal, setModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [keyCreated, setKeyCreated] = useState(false);
  const [keyName, setKeyName] = useState('');
  const [keyId, setKeyId] = useState(null);
  const [snackBar, setSnackBar] = useState({
    open: false,
    message: "",
    color: "",
  });

  const [formData, setFormData] = useState({
    key_name: "",
    key_value: "",
    key_type: "",
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setKeyCreated(true);
    try {
      const result = await createKey(formData);
      if (result) {
        setSnackBar({
          open: true,
          message: result.message || 'Key Created!',
          color: "success",
        });
        const keys = await getKeys();
        setData(keys.response);
      } else {
        setSnackBar({
          open: true,
          message: result.message || 'Key Creation failed!',
          color: "danger",
        });
      }
    } catch (error) {
      setSnackBar({
        open: true,
        message: 'Key Creation failed!',
        color: "danger",
      });
    } finally {
      setKeyCreated(false);
      setModal(false);
      setIsDeleteModal(false);
    }
  };

  const handleDeleteKey = async () => {
    if (keyId === null) return;
    setKeyCreated(true);
    try {
      const result = await deleteKey(keyId);
      if (result) {
        setSnackBar({
          open: true,
          message: result.message || 'Key Deleted!',
          color: "success",
        });
        const keys = await getKeys();
        setData(keys.response);
      } else {
        setSnackBar({
          open: true,
          message: result.message || 'Key Deletion failed!',
          color: "danger",
        });
      }
    } catch (error) {
      setSnackBar({
        open: true,
        message: 'Key Deletion failed!',
        color: "danger",
      });
    } finally {
      setKeyCreated(false);
      setModal(false);
      setIsDeleteModal(false);
      setKeyId(null);
    }
  };

  const openDeleteModal = (id, name) => {
    setKeyId(id);
    setKeyName(name);
    setIsDeleteModal(true);
    setModal(true);
  };

  const openAddKeyModal = () => {
    setFormData({
      key_name: "",
      key_value: "",
      key_type: "",
    });
    setIsDeleteModal(false);
    setModal(true);
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Typography variant="plain" level='h1' sx={{margin: '10px 0 10px 0', color: 'white'}}>Entries</Typography>
        <SearchBar />
        <List>
          {data.length === 0 ? <Typography variant="h6">No keys present</Typography> : data.map((item) => (
            <KeyComponent
              key={item.id}
              keyData={item}
              key_id={item.id}
              key_name={item.name}
              key_value={item.value}
              onClick={() => openDeleteModal(item.id, item.name)}
            />
          ))}
        </List>

        <Box sx={styles.container}>
          <Button sx={styles.button} onClick={openAddKeyModal}>
            <FontAwesomeIcon icon={faAdd} />
          </Button>
        </Box>

        <Modal open={openModal} onClose={() => setModal(false)}>
          <ModalDialog color="neutral" layout="center" variant="plain">
            <ModalClose />
            {isDeleteModal ? (
              <ConfirmationDialog keyName={keyName} handleDeleteKey={handleDeleteKey} keyCreated={keyCreated} />
            ) : (
              <Box>
                <form onSubmit={handleSubmit}>
                  <List sx={{ display: 'flex', flexDirection: 'column', minWidth: '70%' }}>
                    <CustomInput
                      title={'Key Name'}
                      name={'key_name'}
                      type={'text'}
                      size={'md'}
                      hint={'Key Name'}
                      onChange={handleInputChange}
                    />
                    <CustomInput
                      title={'Key Value'}
                      name={'key_value'}
                      type={'text'}
                      size={'md'}
                      hint={'Key Value'}
                      onChange={handleInputChange}
                    />
                    <CustomInput
                      title={'Key Type'}
                      name={'key_type'}
                      type={'text'}
                      size={'md'}
                      hint={'Key Type'}
                      onChange={handleInputChange}
                    />
                    <Box mt={2}>
                      <Button variant="solid" type='submit' loading={keyCreated}>
                        {keyCreated ? 'Saving...' : 'Save'}
                      </Button>
                    </Box>
                  </List>
                </form>
              </Box>
            )}
          </ModalDialog>
        </Modal>

        {snackBar.open && (
          <CustomSnackBar
            message={snackBar.message}
            open={snackBar.open}
            color={snackBar.color}
            onClose={() => setSnackBar({ ...snackBar, open: false })}
          />
        )}
      </Container>
    </div>
  );
}
