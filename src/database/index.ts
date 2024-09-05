import { connect } from "mongoose";
const database = connect("mongodb://localhost:27017/hono")
export default database