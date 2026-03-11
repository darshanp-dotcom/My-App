import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    tasks: i.entity({
      userId: i.string().indexed(),
      date: i.number().indexed(), // yyyymmdd
      section: i.string(), // Morning | Midday | Closing | Custom
      text: i.string(),
      done: i.boolean(),
      createdAt: i.number().indexed(),
    }),
    orders: i.entity({
      userId: i.string().indexed(),
      createdAt: i.number().indexed(),
      total: i.number(),
      foodCost: i.number(),
      dairy: i.number(),
      retail: i.number(),
      paperGoods: i.number(),
      cleaning: i.number(),
      itemsText: i.string().optional(),
    }),
    metrics: i.entity({
      userId: i.string().indexed(),
      date: i.number().indexed(), // yyyymmdd
      salesToday: i.number(),
      laborPct: i.number(),
      foodCostPct: i.number(),
      driveThruSeconds: i.number(),
      wasteCost: i.number(),
      updatedAt: i.number().indexed(),
    }),
    quizAttempts: i.entity({
      userId: i.string().indexed(),
      moduleSlug: i.string().indexed(),
      answer: i.string(),
      correct: i.boolean(),
      createdAt: i.number().indexed(),
    }),
  },
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

