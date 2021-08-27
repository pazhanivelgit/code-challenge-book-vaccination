const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'sa',
  port: 5432,
});

const getCenters = async (req, res) => {
  try {
    const { name, date } = req.query;

    const fetchQuery = `SELECT * FROM mytest.vaccinecenters where centername='${name}' and vaccinationdate='${date}'`

    const { rows } = await pool.query(fetchQuery);

    if (rows.length === 0) {
      res.status(400).send({
        errorCode: 110044, errorMessage: "No records Found!"
      });
      return;
    }

    res.status(200).json(rows[0]);

  } catch (err) {
    throw error;
  }
}


const setupCenter = async (req, res) => {
  const { centerName, maxCapacity, nurseDetails, vaccinationDate } = req.body;

  const userDetails = '[]';

  const { rows } = await pool.query(
    "INSERT INTO mytest.vaccinecenters (centername, maxcapacity, nursedetails, vaccinationdate, userdetails) VALUES ($1,$2,$3,$4,$5) ON CONFLICT ON CONSTRAINT vaccinecenters_un DO update set maxCapacity = $2, nurseDetails=$3;",
    [centerName, maxCapacity, nurseDetails, vaccinationDate, userDetails]
  );

  res.status(201).send({
    message: "Updated successfully!"
  });
};

const createAppointment = async (req, res) => {

  const { centerName, userDetails, vaccinationDateTime } = req.body;

  let vdate = new Date(vaccinationDateTime).toLocaleDateString(); 

  const fetchQuery = `select maxcapacity, userdetails from mytest.vaccinecenters where centername='${centerName}' and vaccinationdate = '${vdate}'`;

  pool.query(fetchQuery, (error, results) => {
    if (error) {
      throw error;
    }

    if (results && (results.rows[0].userdetails.length > results.rows[0].maxcapacity)) {
      res.status(200).send({ errorCode: 110022, errorMessage: "This date is full!" });
    }
  });

  const { rows } = await pool.query(
    "update mytest.vaccinecenters set userdetails = userdetails || $1::jsonb where centername =$2 and vaccinationdate = $3",
    [userDetails, centerName, vdate]
  );

  res.status(201).send({
    message: "Updated successfully!"
  });
};

module.exports = { getCenters, setupCenter, createAppointment };