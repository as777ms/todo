import { useEffect, useState } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Modal,
  Box,
  TextField,
  Checkbox
} from "@mui/material";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openComplete, setOpenComplete] = useState(false);
  const [currentTodo, setCurrentTodo] = useState(null);

  useEffect(() => {
    getTodos();
  }, []);

  const getTodos = async () => {
    try {
      let { data } = await axios.get("http://65.108.148.136:8080/ToDo/get-to-dos");
      setTodos(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenEdit = (todo) => {
    setCurrentTodo(todo);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => {
    setCurrentTodo(null);
    setOpenEdit(false);
  };

  const handleOpenDelete = (todo) => {
    setCurrentTodo(todo);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setCurrentTodo(null);
    setOpenDelete(false);
  };

  const handleOpenComplete = (todo) => {
    setCurrentTodo(todo);
    setOpenComplete(true);
  };
  const handleCloseComplete = () => {
    setCurrentTodo(null);
    setOpenComplete(false);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("Name", e.target.name.value);
    formData.append("Description", e.target.desc.value);
    const images = e.target.images.files;
    for (let i = 0; i < images.length; i++) {
      formData.append("Images", images[i]);
    }

    try {
      await axios.post("http://65.108.148.136:8080/ToDo/add-to-do", formData);
      getTodos();
      handleCloseAdd();
    } catch (error) {
      console.error('Add error:', error.response ? error.response.data : error.message);
    }
  };

  const handleEdit = async (e) => {
  e.preventDefault();
  const images = e.target.images.files;
  const imageFiles = [];
  for (let i = 0; i < images.length; i++) {
    imageFiles.push(images[i]);
  }

  const data = {
    Name: e.target.name.value,
    Description: e.target.desc.value,
    Images: imageFiles,
    id: currentTodo.id
  };

  try {
    await axios.put("http://65.108.148.136:8080/ToDo/update-to-do", data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    getTodos(); 
    handleCloseEdit(); 
  } catch (error) {
    console.error(error);
  }
};


  const handleDelete = async () => {
    try {
      await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do?id=${currentTodo.id}`);
      getTodos();
      handleCloseDelete();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteImage = async (imageId) => {
    try {
      await axios.delete(`http://65.108.148.136:8080/ToDo/delete-to-do-image?imageId=${imageId}`);
      getTodos(); // Refresh the todos list to reflect the deleted image
    } catch (error) {
      console.error('Delete Image error:', error.response ? error.response.data : error.message);
    }
  };

  const handleComplete = async () => {
    try {
      await axios.put(`http://65.108.148.136:8080/ToDo/is-completed?id=${currentTodo.id}`);
      getTodos();
      handleCloseComplete();
    } catch (error) {
      console.error('Complete Toggle error:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleOpenAdd}>
        Add Todo
      </Button>
      <div style={{ marginTop: 20 }}>
        {todos?.map((todo) => (
          <Card key={todo.id} style={{ marginBottom: 10 }}>
            <CardContent>
              <Checkbox checked={todo.isCompleted} onChange={() => handleOpenComplete(todo)} />
              <Typography variant="h6">{todo.name}</Typography>
              <Typography variant="body2">{todo.description}</Typography>
              {todo.images?.map((img) => (
                <div key={img.id} style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                  
                    src={`http://65.108.148.136:8080/images/${img.imageName}`}
                    alt=""
                    style={{ width: 100, height: 100, objectFit: "cover", marginRight: 10 }}
                  />
                  <Button variant="outlined" color="secondary" onClick={() => handleDeleteImage(img.id)}>
                    Delete Image
                  </Button>
                </div>
              ))}
              <Button variant="contained" onClick={() => handleOpenEdit(todo)} style={{ marginRight: 10 }}>
                Edit
              </Button>
              <Button variant="contained" color="error" onClick={() => handleOpenDelete(todo)}>
                Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Modal */}
      <Modal open={openAdd} onClose={handleCloseAdd}>
        <Box
          component="form"
          onSubmit={handleAdd}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6">Add Todo</Typography>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="desc"
            fullWidth
            margin="normal"
          />
          <input name="images" multiple type="file" />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }}>
            Add
          </Button>
        </Box>
      </Modal>

      {/* Edit Modal */}
      <Modal open={openEdit} onClose={handleCloseEdit}>
        <Box
          component="form"
          onSubmit={handleEdit}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6">Edit Todo</Typography>
          <TextField
            label="Name"
            name="name"
            defaultValue={currentTodo?.name}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            name="desc"
            defaultValue={currentTodo?.description}
            fullWidth
            margin="normal"
          />
          <input name="images" multiple type="file" />
          <Button type="submit" variant="contained" color="primary" style={{ marginTop: 10 }}>
            Update
          </Button>
        </Box>
      </Modal>

      {/* Delete Modal */}
      <Modal open={openDelete} onClose={handleCloseDelete}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6">Are you sure you want to delete this todo?</Typography>
          <Button variant="contained" color="secondary" onClick={handleDelete} style={{ marginTop: 10 }}>
            Delete
          </Button>
          <Button variant="contained" onClick={handleCloseDelete} style={{ marginLeft: 10, marginTop: 10 }}>
            Cancel
          </Button>
        </Box>
      </Modal>

      {/* Complete Toggle Modal */}
      <Modal open={openComplete} onClose={handleCloseComplete}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4
          }}
        >
          <Typography variant="h6">
            {currentTodo?.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete'}
          </Typography>
          <Button variant="contained" color="primary" onClick={handleComplete} style={{ marginTop: 10 }}>
            Confirm
          </Button>
          <Button variant="contained" onClick={handleCloseComplete} style={{ marginLeft: 10, marginTop: 10 }}>
            Cancel
          </Button>
        </Box>
      </Modal>
    </>
  );
}
