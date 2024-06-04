const fragment = document.createDocumentFragment();
const formFbFs = document.querySelector('#form-firebase-firestore');
const tableContacts = document.querySelector('#table-contacts');
const tableContactsBody = document.querySelector('#table-contacts-body');
const buttonDeleteAll = document.querySelector('#button-delete-all');
const formDelete = document.querySelector('#form-delete');

const firebaseConfig = {
    apiKey: "AIzaSyAvxAQkWD18qDdaNy78Fh-HW-Cnpnm_mF4",
    authDomain: "demofirebase-f8fb9.firebaseapp.com",
    projectId: "demofirebase-f8fb9",
    storageBucket: "demofirebase-f8fb9.appspot.com",
    messagingSenderId: "292979044108",
    appId: "1:292979044108:web:317330129262bdbb82e329"
}

firebase.initializeApp(firebaseConfig); // Inicializar app Firebase

const db = firebase.firestore(); //db representa mi BBDD //Inicia Firestore

formFbFs.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = formFbFs.name.value;
    const email = formFbFs.email.value;
    const message = formFbFs.message.value;
    const image = formFbFs.image.value;

    createFormFbFs({ name, email, message, image });
    //formFbFs.reset();
});

buttonDeleteAll.addEventListener('click', () => {
    deleteAllContacts();
});

formDelete.addEventListener('submit', (event) => {
    event.preventDefault();

    const idContact = formDelete.idContact.value;

    deleteConcrete(idContact);
    //formFbFs.reset();
});

const createFormFbFs = (form) => {
    db.collection("contacts")
        .add(form)
        .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
            readAll();
        })
        .catch((error) => console.error("Error adding document: ", error));
}

const readAll = () => {
    tableContactsBody.innerHTML = '';

    //Petición a Firestore para leer todos los documentos de la colección album
    db.collection("contacts")
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                paintContacts(doc.data().name, doc.data().email, doc.data().message, doc.data().image);
            });

        })
        .catch(() => console.log('Error reading documents'));
}

const paintContacts = (name, email, message, image) => {

    const trTable = document.createElement('TR');
    const tdName = document.createElement('TD');
    tdName.innerText = name;
    const tdEmail = document.createElement('TD');
    tdEmail.innerText = email;
    const tdMessage = document.createElement('TD');
    tdMessage.innerText = message;
    const imgContacts = document.createElement('img');
    imgContacts.src = image;
    const tdImage = document.createElement('TD');
    tdImage.append(imgContacts);

    trTable.append(tdName, tdEmail, tdMessage, tdImage);
    fragment.append(trTable);
    tableContactsBody.append(fragment);
}

const deleteAllContacts = () => {
    db.collection('contacts')
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        });
}
 
const deleteConcrete = (idContact) => {
    // const id = prompt('Introduce el ID a borrar');
    db.collection('contacts').doc(idContact).delete().then(() => {
      alert(`Documento ${idContact} ha sido borrado`);
      //Clean
    //   document.getElementById('album').innerHTML = "";
      //Read all again
      readAll();
    })
      .catch(() => console.log('Error borrando documento'));
  };

readAll();