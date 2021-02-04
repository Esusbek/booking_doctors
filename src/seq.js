const express = require('express')
const app = express()
const port = 4000

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('test', 'root', 'password', {
    dialect: 'mysql'
});

const jwt = require('jsonwebtoken')
const jwtSalt = 'Adsjgnhfitj'
const bcrypt = require('bcrypt');

class User extends Model {}
User.init({
  username: DataTypes.STRING,
  full_name: DataTypes.STRING,
  phone: DataTypes.INTEGER,
  email: DataTypes.STRING,
  role: DataTypes.INTEGER,
  subID: DataTypes.INTEGER,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

class Doctor extends Model {}

Doctor.init({
  cabinet:  DataTypes.INTEGER,
  schedule: DataTypes.STRING,
  speciality: DataTypes.STRING,
}, { sequelize, modelName: 'doctor' });

class Patient extends Model {}

Patient.init({
    adress: DataTypes.STRING,
    gender: DataTypes.STRING,
    age: DataTypes.INTEGER,

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
    status: DataTypes.INTEGER,
    comment: DataTypes.TEXT,
}, {sequelize, modelName: 'appointment'});

Patient.belongsToMany(Doctor, {through: Appointment})
Doctor.belongsToMany(Patient, {through: Appointment})
Patient.belongsTo(User)
Doctor.belongsTo(User)
User.hasOne(Patient)


;(async () => {
  await sequelize.sync();
})(); 

const {graphqlHTTP: express_graphql} = require('express-graphql');
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        getUsers: [User]
        getUser(id: ID!): User
        getPatients: [Patient]
        getPatient(id: ID!): Patient 
        getDoctors: [Doctor]
        getDoctor(id: ID!): Doctor
        getAppointments: [Appointment]
        getAppointment(id: ID!): Appointment
        login(username: String!, password: String!): String
    }

    type Mutation {
        addUser(user: UserInput): User
        addPatient(patient: PatientInput): Patient
        addDoctor(doctor: DoctorInput): Doctor
        addAppointment(appointment: AppointmentInput): Appointment
    }

    type User {
        id: ID,
        username: String,
        createdAt: String,
        updatedAt: String,
        full_name: String,
        phone: Int,
        email: String,
        role: Int,
        subID: Int,
        password: String
    }

    input UserInput {
        username: String!,
        full_name: String!,
        phone: Int!,
        email: String!,
        password: String!
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
        cabinet: Int!,
        schedule: String!,
        speciality: String!
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
        adress: String!,
        gender: String!,
        age: Int!
    }

    type Appointment {
        id: ID,
        createdAt: String,
        updatedAt: String,
        date: Int,
        comment: String,
        status: Int,
        patient: Patient,
        doctor: Doctor
    }

    input AppointmentInput {
        date: Int!,
        comment: String!,
        status: Int!,
    }
`);

var root = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
    async getUsers(skip, {user}){/* 
        if (!user) throw new Error(`can't get userS when your anon`) */
        return await User.findAll({})
    },
    async getUser({id}, {user}){/* 
        if (!user) throw new Error(`can't get user when your anon`) */
        return await User.findByPk(id)
    },
    async getPatientss(skip, {user}){/* 
        if (!user) throw new Error(`can't get patients when your anon`) */
        return await Patient.findAll({})
    },
    async getPatient({id}, {user}){/* 
        if (!user) throw new Error(`can't get patient when your anon`) */
        return await Patient.findByPk(id)
    },
    async getDoctors(skip, {user}){/* 
        if (!user) throw new Error(`can't get doctors when your anon`) */
        return await Doctor.findAll({})
    },
    async getDoctors({id}, {user}){/* 
        if (!user) throw new Error(`can't get user when your anon`) */
        return await Doctor.findByPk(id)
    },
    async addUser({user:{username, password, full_name, phone, email, role = 1, subId}}){
        password = await bcrypt.hash(password, 10);
        return await User.create({username, password, full_name, phone, email, role, subId})
    },
    async addPatient({patient:{adress,gender,age}}){
        return await Patient.create({adress, gender, age})
    },
    async addDoctor({doctor:{cabinet, schedule, speciality}}){
        return await Doctor.create({cabinet, schedule, speciality})
    },
    async login(username, password)
    {
        if(username && password)
        {
            console.log(username, password)
            let user = await User.findOne({where: {username}});
            
            if(user && await bcrypt.compare(password, user.password)){
                const {id} = user
                const {role} = user
                return jwt.sign({sub:{id, role}}, jwtSalt)
            }
        }
    }
};

// Create an express server and a GraphQL endpoint
app.use('/graphql', express_graphql(async (req, res) => {
    let auth = req.headers.authorization
    let user;
    if (auth && auth.startsWith('Bearer ')){
        let token = auth.slice('Bearer '.length)
        try {
            let decoded = jwt.verify(token, jwtSalt);
            if (decoded){
                user = await User.findByPk(decoded.sub.id)
            }
        }catch(e){
            console.log(e)
        }
    }
    return {
        schema,
        rootValue: root,
        graphiql: true,
        context: {user}
    }
}));


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
