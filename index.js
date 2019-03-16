const express = require('express');
const helmet = require('helmet');
const knex = require('knex');

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './data/lambda.sqlite3'
  },
  useNullAsDefault: true
}

const db = knex(knexConfig);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here

server.get('/api/zoos', async (req, res) => {
  try {
    const animals = await db('zoos');
    res.status(200).json(animals);
  } catch (e) {
    res.status(500).json({error: "Something went wrong with the server"})
  }
});

server.get('/api/zoos/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const zoo = await db('zoos').where({ id: id }).first();

    if(zoo) {
      res.status(200).json(zoo);
    } else {
      res.status(404).json({error: "Zoo with that ID was not found"})
    }
    
  } catch (e) {
    res.status(500).json({error: "Something went wrong with the server"})
  }
})

server.post('/api/zoos', async (req, res) => {
  const newAnimal = req.body;

  if(newAnimal) {
    try {
      const [id] = await db('zoos').insert(newAnimal);
      res.status(201).json(id);
    } catch (e) {
      res.status(500).json({error: "Something went wrong with the server"})
    }
  } else {
    res.status(400).json({error: "Please provide a name."})
  }
});

server.delete('/api/zoos/:id', async (req, res) => {
  try {
    await db('zoos').where({ id: req.params.id }).del();
    res.status(201).json({message: "That zoo was deleted"});
  } catch (e) {
    res.status(500).json({error: "Something went wrong with the server."});
  }
});

server.put('/api/zoos/:id', async (req, res) => {
  const newZoo = req.body;

  if(newZoo) {
    try {
      const updatedZoo = await db('zoos').where({ id: req.params.id }).update(newZoo)
      res.status(201).json(updatedZoo);
    } catch (e) {
      res.status(500).json({error: "Something went wrong with the server"});
    }
  }
})

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
