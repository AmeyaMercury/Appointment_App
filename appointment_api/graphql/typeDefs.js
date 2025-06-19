const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    name: String!
    phone: String!
    role: Role!
  }

  type Doctor {
    id: ID!
    user: User!
    specialization: String!
    experience: Int!
  }

  type Slot {
    id: ID!
    doctor: Doctor!
    date: String!
    startTime: String!
    endTime: String!
    isBooked: Boolean!
  }

  type Appointment {
    id: ID!
    user: User!
    doctor: Doctor!
    slot: Slot!
    status: AppointmentStatus!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  enum Role {
    USER
    DOCTOR
  }

  enum AppointmentStatus {
    BOOKED
    VACANT
  }

  input SignupInput {
    email: String!
    password: String!
    name: String!
    phone: String!
    role: Role!
    specialization: String
    experience: Int
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input SlotInput {
    date: String!
    startTime: String!
    endTime: String!
  }

  type Query {
    me: User
    availableSlots(doctorId: ID): [Slot!]!
    doctors: [Doctor!]!
    myAppointments: [Appointment!]!
  }

  type Mutation {
    signup(input: SignupInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!
    createSlot(input: SlotInput!): Slot!
    bookAppointment(slotId: ID!): Appointment!
  }
`;

module.exports = typeDefs;