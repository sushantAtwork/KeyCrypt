// import React, { useState, useEffect } from 'react';
// import { Box, Button, Container, List, Modal, ModalClose, ModalDialog, Typography } from '@mui/joy';
// import KeyComponent from '../components/KeyComponent';
// import { getKeys } from '../service/GetKeys';
// import CustomSnackBar from '../components/CustomSnackBar';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faAdd } from '@fortawesome/free-solid-svg-icons';
// import CustomInput from '../components/CustomInput';
// import { createKey } from '../service/CreateKey';
// import { deleteKey } from '../service/DeleteKey';

// const styles = {
//   container: {
//     position: "relative",
//     height: "80vh",
//   },
//   button: {
//     position: "fixed",
//     bottom: "20px",
//     right: "20px",
//     padding: "10px 20px",
//     backgroundColor: "#007bff",
//     color: "white",
//     border: "none",
//     borderRadius: "50%",
//     cursor: "pointer",
//     boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)", 
//     zIndex: 1000, 
//   },
// };


// export default function Home() {
//   const [data, setData] = useState([]);
//   const [openModal, setModal] = useState(false);
//   const [keyCreated, setKeyCreated] = useState(false);
//   const [keyId, setKeyId] = useState(0);
//   const [snackBar, setSnackBar] = useState({
//     open: false,
//     message: "",
//     color: "",
//   });

//   const [formData, setFormData] = useState({
//     key_name: "",
//     key_value: "",
//     key_type: "",
//   });

//   useEffect(() => {
//     const fetchKeys = async () => {
//       try {
//         const keys = await getKeys();
//         setData(keys.response);
//       } catch (error) {
//         console.error('Error fetching keys:', error);
//       }
//     };

//     fetchKeys();
//   }, []);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleSubmit = async (e) => {
//     setKeyCreated(true);
//     e.preventDefault();
//     try {
//       const result = await createKey(formData);
//       if (result) {
//         setSnackBar({
//           open: true,
//           message: result.message || 'Key Created!!!',
//           color: "success",
//         });
//         const keys = await getKeys();
//         setData(keys.response);
//       } else {
//         setSnackBar({
//           open: true,
//           message: result.message || 'Key Creation failed!',
//           color: "danger",
//         });
//       }
//     } catch (error) {
//       setSnackBar({
//         open: true,
//         message: 'Key Creation failed!',
//         color: "danger",
//       });
//     } finally {
//       setKeyCreated(false);
//       setModal(false);
//     }
//   };

//   const handleGetKeyId = (keyId) => {
//     setKeyId(keyId);
//   }

//   const handleDeleteKey = async(keyId) => {
//     setKeyCreated(true);
//     console.log("asdasd ",keyId)
//     try {
//       const result = await deleteKey(keyId);
//       if (result) {
//         setSnackBar({
//           open: true,
//           message: result.message || 'Key Deleted!!!',
//           color: "success",
//         });
//         const keys = await getKeys();
//         setData(keys.response);
//       } else {
//         setSnackBar({
//           open: true,
//           message: result.message || 'Key Delete failed!',
//           color: "danger",
//         });
//       }
//     } catch (error) {
//       setSnackBar({
//         open: true,
//         message: 'Key Delete failed!',
//         color: "danger",
//       });
//     } finally {
//       setKeyCreated(false);
//       setModal(false);
//     }
//   }

//   return (
//     <Container>
//       <Box mb={2}>
//         <Typography variant="h6">Entries</Typography>
//       </Box>
//       <Typography>Search Bar</Typography>
//       <List>
//         {data.length === 0 ? <h1>NO KEYS PRESENT</h1> : data.map((item) => (
//           <KeyComponent key={item.id} keyData={item} key_id={item.id} key_name={item.name} key_value={item.value} onClick={() => {handleGetKeyId(item.id); setModal(true); handleDeleteKey(keyId)}}/>
//         ))}
//       </List>

//       <Box sx={styles.container}>
//         <Button sx={styles.button} onClick={() => setModal(true)}>
//           <FontAwesomeIcon icon={faAdd} />
//         </Button>
//       </Box>

//       <Modal open={openModal} onClose={() => setModal(false)}>
//         <ModalDialog
//           color="neutral"
//           layout="center"
//           variant="plain"
//         >
//           <ModalClose />
//           {keyId ? <><h1>Delete</h1></> : <Box>
//             <form onSubmit={handleSubmit}>
//               <List sx={{ display: 'flex', minWidth: '70%' }}>
//                 <CustomInput title={'Key Name'} name={'key_name'} type={'text'} size={'md'} hint={'Key Name'} onChange={handleInputChange} />
//                 <CustomInput title={'Key Value'} name={'key_value'} type={'text'} size={'md'} hint={'Key Value'} onChange={handleInputChange} />
//                 <CustomInput title={'Key Type'} name={'key_type'} type={'text'} size={'md'} hint={'Key Type'} onChange={handleInputChange} />
//                 <Box>
//                   <Button variant="soft" type='submit' loading={keyCreated}>
//                     Save
//                   </Button>
//                 </Box>
//               </List>
//             </form>
//           </Box>}
//         </ModalDialog>
//       </Modal>

//       {snackBar.open && (
//         <CustomSnackBar
//           message={snackBar.message}
//           open={snackBar.open}
//           color={snackBar.color}
//           onClose={() => setSnackBar({ ...snackBar, open: false })}
//         />
//       )}
//     </Container>
//   );
// }
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

const styles = {
  container: {
    position: "relative",
    height: "80vh",
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
  const [keyCreated, setKeyCreated] = useState(false);
  const [keyId, setKeyId] = useState(null); // Changed initial value to null
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
          message: result.message || 'Key Created!!!',
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
    }
  };

  const handleDeleteKey = async () => {
    if (keyId === null) return; // Do nothing if no keyId is set
    setKeyCreated(true);
    try {
      const result = await deleteKey(keyId);
      if (result) {
        setSnackBar({
          open: true,
          message: result.message || 'Key Deleted!!!',
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
      setKeyId(null);
    }
  };

  const openDeleteModal = (id) => {
    setKeyId(id);
    setModal(true);
  };

  return (
    <Container>
      <Box mb={2}>
        <Typography variant="h6">Entries</Typography>
      </Box>
      <Typography>Search Bar</Typography>
      <List>
        {data.length === 0 ? <h1>NO KEYS PRESENT</h1> : data.map((item) => (
          <KeyComponent
            key={item.id}
            keyData={item}
            key_id={item.id}
            key_name={item.name}
            key_value={item.value}
            onClick={() => openDeleteModal(item.id)} // Updated onClick handler
          />
        ))}
      </List>

      <Box sx={styles.container}>
        <Button sx={styles.button} onClick={() => setModal(true)}>
          <FontAwesomeIcon icon={faAdd} />
        </Button>
      </Box>

      <Modal open={openModal} onClose={() => setModal(false)}>
        <ModalDialog color="neutral" layout="center" variant="plain">
          <ModalClose />
          {keyId ? (
            <Box>
              <Typography variant="h6">Delete Key</Typography>
              <Button variant="soft" onClick={handleDeleteKey} loading={keyCreated}>
                Confirm Delete
              </Button>
            </Box>
          ) : (
            <Box>
              <form onSubmit={handleSubmit}>
                <List sx={{ display: 'flex', minWidth: '70%' }}>
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
                  <Box>
                    <Button variant="soft" type='submit' loading={keyCreated}>
                      Save
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
  );
}
