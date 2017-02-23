export const SCHEMA = `
schema {
  query: Query
  mutation: Mutation
}

scalar Primitive

type Query {
  # Available zones
  zones: [Zone]
  state(type: String!): State
  config : Config!
}

type Mutation {
  runCommand(id: String!, command: String!, jsonArgs: String): BasicResult!
  setSwitch(id: String!, value: Primitive!): BasicResult!
  setState(type: String!, state: String!): BasicResult!
}

type Config {
  coords {
    lat: Float
    lng: Float
  }
}

type BasicResult {
  success: Boolean!
}

type State {
  current: String!
  available: [String]!
}

type Zone {
  id: String!
  name: String!
  sensors: [Sensor!]!
  lights: [Light!]!
  locks: [Lock!]!
  buttons: [Button!]!
}

type Light {
  id: String!
  switch: Switch!
  commands: Commands!
  values: Values!
}

type Lock {
  id: String!
  switch: Switch!
  commands: Commands!
  values: Values!
}

type Button {
  id: String!
  switch: Switch!
  commands: Commands!
  values: Values!
}

type Sensor {
  id: String!
  name: String!
  switch: Switch
  commands: Commands
  values: Values
}

type Switch {
  id: String!
  value: Primitive
}

type Commands {
  id: String!
  available: [AvailableCommand]!
}

type AvailableCommand {
  command: String!
  title: String!
  comment: String
}

type Values {
  id: String!
  items: [ValueItem]!
}

type ValueItem {
  key: String!
  value: Primitive
  svalue: String
  ivalue: Int
  bvalue: Boolean
  fvalue: Float
}

`;
