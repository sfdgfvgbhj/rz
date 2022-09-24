const notes = require('./notes')
const {nanoid} = require('nanoid')

const addNoteHandler = (request, h) =>{
	const {title, tags, body} = request.payload;
	console.log(`payload : ${title},${tags},${body}`);
	const id = nanoid(16)
	console.log(`nano id  ${id}`);
	const createdAt = new Date().toISOString(); // waktu
	const updateAt = createdAt; 
	console.log(updateAt);


	const newNote = {
		title, tags, body, id, createdAt, updateAt, // data dari note-app client
	};

	notes.push(newNote) // tambahkan data
	const isSuccess = notes.filter((note) => note.id === id).length > 0; // kondisi
	if(isSuccess){
		// respon ketika success
		const response = h.response({
			status:'success',
			message:'Catatan berhasil di tambahkan',
			data: {
				noteId: id,
			},

		});
		console.log('berhasil menambahkan catatab')

		response.code(201);
		return response;
	}

	// untuk gagal

	const response = h.response({
		status : 'fail',
		message : 'Catatan gagal ditambahkan',
	});

	response.code(500);
	return response;	
}

const getAllNotesHandler = () =>({
	status : 'success',
	data : {
		notes,
	}
});

const getNoteByIdHandler = (request, h) => {
	const {id} = request.params;

	const note = notes.filter((n) => n.id === id)[0];

	if(note != undefined){
		return {
			status :'success',
			data  : {
				note,
			}
		}
	}

	const response = h.response({
		status : 'fail',
		message : 'Catatan tidak ditemukan',

	});

	response.code(404);
	return response;

}

const editNoteByIdHandler = (request, h) =>{
	const {id} = request.params;
	const {title, tags, body} = request.payload;
	const updateAt = new Date.toISOString();
	const index = notes.findIndex((note)=> note.id === id);

	if(index !== -1){
		notes[index] = {
			...notes[index],
			title,
			tags,
			body,
			updateAt,
		}

		const response = h.response({
			status : 'success',
			message : 'catatan berhasil diperbaharui',
		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status :'fail',
		message:'Gagal memperbaharui catatan. id tidak ditemukan',
	});

	response.code(404);
	return response;
}

const deleteNoteByIdHandler = (request, h) =>{
	const {id} = request.params;
	const index = notes.findIndex((note) => note.id === id);

	if(index !== -1){
		notes.splice(index, 1);
		const response = h.response({
			status: 'success',
			message : 'Catatan berhasil dihapus',

		});

		response.code(200);
		return response;
	}

	const response = h.response({
		status : 'fail',
		message : 'Catatan gagal dihapus. Id tidak ditemukan',
	});

	response.code(404);
	return response;

}

module.exports = {addNoteHandler, getAllNotesHandler, getNoteByIdHandler, editNoteByIdHandler, deleteNoteByIdHandler};