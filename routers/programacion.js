const express = require('express');

const {programacion} = require('../datos/cursos.js').infoCursos;

const routerProgramacion = express.Router();
//Middleware
routerProgramacion.use(express.json());

routerProgramacion.get('/', (req, res) => {
  res.send(JSON.stringify(programacion));
});
  
routerProgramacion.get('/:lenguaje', (req, res) => {
  const lenguaje = req.params.lenguaje;
  const resultados = programacion.filter(curso => curso.lenguaje === lenguaje);
  
  if (resultados.length === 0) {
    return res.status(404).send(`No se encontraron cursos de ${lenguaje}.`);
  } 
  
  if (req.query.ordenar === 'vistas') {
    return res.send(JSON.stringify(resultados.sort((a, b) => b.vistas - a.vistas)));
  }
  
  res.send(JSON.stringify(resultados));
});
  
routerProgramacion.get('/:lenguaje/:nivel', (req, res) => {
  const lenguaje = req.params.lenguaje;
  const nivel = req.params.nivel;
  
  const resultados = programacion.filter(curso => curso.lenguaje === lenguaje && curso.nivel === nivel);
  
  if (resultados.length === 0) {
    return res.status(404).send(`No se encontraron cursos de ${lenguaje} de nivel ${nivel}`);
  }
  res.send(JSON.stringify(resultados));
});
//POST
routerProgramacion.post('/', (req, res)=>{
    //vamos a estraer el cuerpo de la solicitud con request.body y queremos agregarlo al arreglo de programacion que estamos importando(normalmente hariamos una solicitud a base de datos)
  let cursoNuevo= req.body;
  programacion.push(cursoNuevo);
  res.send(JSON.stringify(programacion)); //enviamos el nuevo arreglo al cliente
});
//PUT

//tomamos el metodo /:id para especificar que curso queremos tomar
routerProgramacion.put('/:id',(req,res)=>{
  //cuerpo de la solicitud recibimos el curso actualizado
  const cursoActualizado= req.body;
  //extraemos el id del curso que estamos reemplazando
  const id= req.params.id;
  //buscamos el indice que corresponde a ese curso y lo almacenamos en una constante
  const indice= programacion.findIndex(curso => curso.id == id);
  //si el indice es valido vamos a reemplazar el objeto que tenemos actualmente con el curso actualizado   
  if(indice >= 0){
    programacion[indice] = cursoActualizado;
  }
  res.send(JSON.stringify(programacion)); //enviamos el arreglo de cursos de programacion
});

//PATCH
routerProgramacion.patch('/:id', (req,res)=>{
    const infoActualizada = req.body; //cuerpo de la solicitud
    const id = req.params.id; //extraemos el id
    const indice =  programacion.findIndex(curso => curso.id ==id); //encuentra el indice y compara si su id es = al id que estamos buscando
    if(indice >= 0){
        const cursoAModificar= programacion[indice]; //usamos el indice que obtenemos arriba
        Object.assign(cursoAModificar, infoActualizada);
    }

})

//DELETE
routerProgramacion.delete('/:id', (req, res)=>{
const id =  req.params.id; //extraemos el id, no el cuerpo ya que actuamos sobre el id individual
const indice = programacion.findIndex(curso =>curso.id == id);
if(indice >=0){
    programacion.splice(indice, 1); //especificamos donde vamos a cortar(indice) y cuantos elementos vamos a cortar (1)...
}
res.send(JSON.stringify(programacion)); //retornamos el arreglo para ver el cambio
});

module.exports = routerProgramacion;