import { connection } from './database/connection.js';
import { noteModel } from './database/model/note.model.js';
import cors from 'cors';
import * as dotenv from 'dotenv';
import morgan from "morgan";
import { Server } from 'socket.io';
import express from 'express';
dotenv.config();
connection();
const app = express();
const port = 3000;

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
process.on('unhandledRejection',(err)=>{
    console.log(err);
})
app.get('/', (req, res) => res.send('Hello World!'));
let server=app.listen(port, () => console.log(`Example app listening on port ${port}!`));

//Socket.io
const io=new Server(server,{cors:"*"});
io.on('connection',(socket)=>{
  socket.on('add',async (data)=>{
    await noteModel.insertMany(data);
    let notes=await noteModel.find();
    io.emit('notes',notes);
  })
  socket.on('load',async ()=>{
    let notes=await noteModel.find();
    io.emit('notes',notes);
  })
  socket.on('delete',async (data)=>{
    await noteModel.findByIdAndDelete(data);
    let notes=await noteModel.find()
    io.emit('notes',notes);
  })
  socket.on('search',async(data)=>{
    let notes=await noteModel.find({name:{$regex:data,$options:'i'}});
    io.emit('notes',notes);
  })
})
