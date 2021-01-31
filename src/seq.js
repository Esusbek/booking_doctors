const express = require('express')
const app = express()
const port = 4000

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('testDB', 'sa', '12345', {
    dialect: 'mysql',
    port: port
});

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  full_name: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  email: DataTypes.STRING,
  role: DataTypes.NUMBER,
  subID: DataTypes.NUMBER,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

class Doctor extends Model {}

Doctor.init({
  cabinet:  DataTypes.NUMBER,
  schedule: DataTypes.STRING,
  speciality: DataTypes.STRING,
}, { sequelize, modelName: 'doctor' });

class Patient extends Model {}

Patient.init({
    adress: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.NUMBER,

}, {sequelize, modelName: 'patient'});

class Appointment extends Model {
    get patient(){
        return this.___patient || this.getPatient()
    }
    set patient(patient){
        this.___patient=patient
    }
    get doctor(){
        return this.___doctor || this.getDoctor()
    }
    set doctor(doctor){
        this.___doctor=doctor
    }
}

Appointment.init({
    date: DataTypes.DATE,
    status: DataTypes.NUMBER,
    comment: DataTypes.TEXT,
}, {sequelize, modelName: 'appointment'});

Patient.belongsToMany(Doctor, {through: Appointment})
Doctor.belongsToMany(Patient, {through: Appointment})
Patient.belongsTo(User)
Doctor.belongsTo(User)
User.hasOne(Patient)


;(async () => {
  await sequelize.sync({force: true});
})(); 

const {graphqlHTTP: express_graphql} = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        getUsers: [User]
        getUser(id: ID!): User
        getDoctors: [Doctor]
        getDoctor(id: ID!): Doctor
        getAppointments: [Appointment]
        getAppointment(id: ID!): Appointment
    }

    type User {
        id: ID,
        username: String,
        createdAt: String,
        updatedAt: String,
        full_name: String,
        phone: Int,
        email: String,
        role: String,
        subID: Int,
        password: String
    }

    input UserInput {
        username: String!,
        password: String!,
        email: String
    }

    type Doctor {
        id: ID,
        createdAt: String,
        updatedAt: String,
        cabinet: Int,
        schedule: String,
        speciality: String,
    }

    input DoctorInput{
        cabinet: Int,
        schedule: String,
        speciality: String
    }

    type Patient {
        id: ID,
        createdAt: String,
        updatedAt: String,
        adress: String,
        gender: String,
        age: Int
    }

    input PatientInput {
        adress: String,
        gender: String,
        age: Int
    }

    type Appointment {
        id: ID,
        createdAt: String,
        updatedAt: String,
        date: Int,
        comment: String,
        status: Int,
        patientID: Int,
        doctorID: Int
    }

    input AppointmentInput {
        date: Int,
        comment: String,
        status: Int
    }
`);

var root = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
    
};

// Create an express server and a GraphQL endpoint
app.use('/graphql', express_graphql({
    schema,
    rootValue: root,
    graphiql: true
}));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
