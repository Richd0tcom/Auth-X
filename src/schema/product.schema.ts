import { object, string, TypeOf } from "zod";

export const createProductSchema = object({
  body: object({
    name: string({
      required_error: "Name is required",
    }),
    redirect_url: string({
      required_error: "redirect_url is required",
    }).url("Not a valid url"),
  }),
});

export type CreateProductInput = TypeOf<typeof createProductSchema>;
