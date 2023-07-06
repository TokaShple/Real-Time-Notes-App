var socket = io( 'http://localhost:3000/' );
socket.on('connect',()=>{socket.emit('load')});
let notes=[];

let name=document.getElementById('name');
let description=document.getElementById('description');

function addnote(){
  socket.emit('add',{name:name.value,description:description.value});
}

socket.on('notes',(data)=>{
  notes=data;
  showNotes();
})

function showNotes(){
  let cartona=``;
  for(let i=0;i<notes.length;i++){
    cartona +=`
    <div class="col-md-4">
      <div class="border text-center my-3">
        <h1>${notes[i].name}</h1>
        <p>${notes[i].description}</p>
        <button onclick="deleteNote('${notes[i]._id}')" class="btn btn-danger">delete</button>
      </div>
    </div>
    `
  }
  document.getElementById('row').innerHTML=cartona;
}

function deleteNote(id){
  socket.emit('delete',id);
}

function search(value){
  socket.emit('search',value);
}