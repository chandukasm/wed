const Pool = require("pg").Pool;
const bcrypt = require("bcrypt");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "wedding",
  password: "eleos",
  port: 5432
});

const getUsers = (request, response) => {
  pool.query("SELECT * FROM users ORDER BY id ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

// const getUserById = (request, response) => {
//   const id = parseInt(request.params.id);

//   pool.query("SELECT * FROM users WHERE id = $1", [id], (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };

const createUser = async (request, response) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(request.body.password, salt);

  const { name, email } = request.body;

  pool.query(
    "INSERT INTO users (user_name, email,password) VALUES ($1, $2,$3) returning *",
    [name, email, password],
    (error, result) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`user created with id: ${result.rows[0].id}`);
      console.log(response);
    }
  );
};

const login = (request, response) => {
  const { email, password } = request.body;
  //   response.send("youare in login");

  pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }

      const dbPassword = results.rows[0].password; //returned password

      bcrypt.compare(password, dbPassword, (err, same) => {
        if (err) {
          response.status(500).send("invalid username or password");
          return;
        }
        if (same) {
          response.status(200).send("you are logged in");
          return;
        }
      });
    }
  );
};

module.exports = {
  getUsers,
  //   getUserById,
  createUser,
  login
};
