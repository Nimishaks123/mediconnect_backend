// import mongoose, {
//   Schema,
//   Document,
// } from "mongoose";

// export interface CounterDocument
//   extends Document {

//   name: string;

//   sequence: number;
// }

// const CounterSchema =
//   new Schema(
//     {
//       name: {
//         type: String,
//         required: true,
//         unique: true,
//       },

//       sequence: {
//         type: Number,
//         default: 0,
//       },
//     },
//     {
//       timestamps: true,
//     }
//   );

// export const CounterModel =
//   mongoose.model<CounterDocument>(
//     "Counter",
//     CounterSchema
//   );
import mongoose, {
  Schema,
  Document,
} from "mongoose";

export interface CounterDocument
  extends Document {

  name: string;

  sequence: number;
}

const CounterSchema =
  new Schema(
    {
      name: {
        type: String,
        required: true,
        unique: true,
      },

      sequence: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export const CounterModel =
  mongoose.model<CounterDocument>(
    "Counter",
    CounterSchema
  );