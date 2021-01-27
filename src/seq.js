const express = require('express')
const app = express()
const port = 4000

const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize('mysql://test@localhost/test');

class User extends Model {
    get appointments(){
        return this.getAppointments()
    }
}
User.init({
  username: DataTypes.STRING,
  full_name: DataTypes.STRING,
  adress: DataTypes.STRING,
  phone: DataTypes.NUMBER,
  email: DataTypes.STRING,
  position: DataTypes.NUMBER,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'user' });

class Doctor extends Model {
    get appointments(){
        return this.getAppointments()
    }
}

Doctor.init({  
  username: DataTypes.STRING,
  full_name: DataTypes.STRING,
  cabinet:  DataTypes.NUMBER,
  schedule: DataTypes.STRING,
  speciality: DataTypes.STRING,
  password: DataTypes.STRING,
}, { sequelize, modelName: 'doctor' });

class Appointment extends Model {
    get user(){
        return this.getUser()
    }
    get doctor(){
        return this.getDoctor()
    }
}

Appointment.init({
    date: DataTypes.DATE,
    status: DataTypes.NUMBER,
}), {sequelize, modelName: 'appointment'}

Appointment.belongsTo(User, {through: 'UserID'})
Appointment.belongsTo(Doctor, {through: 'DoctorID'})
User.hasMany(Appointment)
Doctor.hasMany(Appointment)


;(async () => {
  await sequelize.sync();
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

    type Mutation {
        addUser(user: UserInput): User
        addPost(post: PostInput): Post
    }

    type User {
        id: ID,
        username: String,
        createdAt: String,
        updatedAt: String,
        adress: String,
        email: String,
        full_name: String,
        phone: Number,
        position: Number,
        password: String,
        appointments: [Appointment]
    }

    input UserInput {
        username: String!,
        password: String!,
        email: String,
    }

    type Appointment {
        id: ID,
        createdAt: String,
        updatedAt: String,
        doctor: Doctor,
        user: User,
        status: Number,
        date: Date,

    }

    input AppointmentInput {
        doctorId: ID,
        userId: ID,
        date: Date,
    }

    type Doctor {
        id: ID,
        username: String,
        full_name: String,
        cabinet: Number,
        schedule: String,
        speciality: String,
        password: String,
    }

    input DoctorInput {
        username: String!,
        password: String!,

    }
`);

var root = {//объект соответствия названий в type Query и type Mutation с функциями-резолверами из JS-кода
    async getUsers(){
        return User.findAll({})
    },
    async getUser({id}){
        return User.findByPk(id)
    },
    async addUser({user}){
        return await User.create(user)
    },

    async getDoctors(){
        return Doctor.findAll({})
    },
    async getDoctor({id}){
        return Doctor.findByPk(id)
    },
    async addDoctor({doctor}){
        return await Doctor.create(doctor)
    },

    async getAppointments(){
        return Appointment.findAll({})
    },
    async getAppointment({id}){
        return Appointment.findByPk(id)
    },
    async addAppointment({app}){
        return await Appointment.create(app)
    },
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
