import React, { useState, useEffect } from 'react';
import './App.scss';
import Header from './components/Header';
import CreateNoteForm from './components/CreateNoteForm';
import Notes from './components/Notes';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ArchiveIcon from '@material-ui/icons/Archive';
import EditIcon from '@material-ui/icons/Edit';
import NotificationsIcon from '@material-ui/icons/Notifications';
import EmojiObjectsIcon from '@material-ui/icons/EmojiObjects';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import { db } from "./Firebase";



function App() {
  const [notes, setNotes] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [grid, setGrid] = useState("col-md-3");

  const [menuOpen, setMenuOpen] = useState(false);
  const handleClickMenuOpen = () => {
    setMenuOpen(!menuOpen);
  }

  useEffect(() => {
    fetNotesData();
  }, [fetchAgain, refresh]);


  function fetNotesData() {
    setIsLoading(true);
    const notesData = []
    db.collection("notes").get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {

        let currentID = doc.id;
        let noteOBJ = { ...doc.data(), ['id']: currentID };
        notesData.push(noteOBJ);
      });
      setNotes(notesData);
      setIsLoading(false);
    });
  }


  const handleSubmitFromApp = (data) => {
    setNotes((prevData) => (
      [data, ...prevData]
    ));
  }
  const handleEdit = (data) => {
    fetNotesData();
  }

  const handleRefresh = () => {

    setRefresh(true);
  }
  const handleDelete = (id) => {
    db.collection("notes").doc(id).delete().then(() => {
      console.log("Document successfully deleted!" + id);
      setFetchAgain(true);
      fetNotesData();
    }).catch((error) => {
    });

  }

  return (
    <div className="App">
      <Header handleClickMenuOpen={handleClickMenuOpen} handleRefresh={handleRefresh} setGrid={setGrid} grid={grid} />
      <div className={`sideBar text-white ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><span className="icon"><EmojiObjectsIcon /></span><span className="linkText">All Tasks</span></li>
          <li><span className="icon"><NotificationsIcon /></span><span className="linkText">Important</span></li>
          <li><span className="icon"><EditIcon /></span><span className="linkText">Edit lables</span></li>
          <li><span className="icon"><ArchiveIcon /></span><span className="linkText">Pending</span></li>
          <li><span className="icon"><DeleteOutlineIcon /></span><span className="linkText">Completed</span></li>
        </ul>
      </div>
      <div className={`mainContent ${menuOpen ? "open" : ""}`}>
        <CreateNoteForm handleSubmitFromApp={handleSubmitFromApp} />
        <div className="container">
          <div className="row">
            {isLoading ? <h3 className='col-md-12 text-white text-center'><AutorenewIcon className="loader" /></h3> : ""}
            {!isLoading && notes && notes.map(({ noteTitle, noteContent, id }) =>
              <Notes id={id} noteTitle={noteTitle} noteContent={noteContent} handleEdit={handleEdit} handleDelete={handleDelete} grid={grid} />
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
