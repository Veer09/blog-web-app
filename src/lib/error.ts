import { toast } from "@/components/ui/use-toast";
import { Client } from "@upstash/qstash";
import { AxiosError } from "axios";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";
import { generateErrorMessage } from "zod-error";

export const ErrorTypes = z.enum([
  "bad_request",
  "unauthorized",
  "forbidden",
  "not_found",
  "internal_server_error",
  "recusrsive_book_error"
]);

export const ErrorCodes: Record<z.infer<typeof ErrorTypes>, number> = {
  bad_request: 400,
  unauthorized: 401,
  forbidden: 403,
  not_found: 404,
  internal_server_error: 500,
  recusrsive_book_error: 400
};

export const ErrorSchema = z.object({
  message: z.string(),
  chapter: z.optional(z.number()),
  code: z.number(),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;

export class ApiError extends Error {
  public readonly code: z.infer<typeof ErrorTypes>;
  public readonly chapter?: number
  constructor(message: string, code: z.infer<typeof ErrorTypes>, chapter?: number) {
    super(message);
    this.code = code;
    this.chapter = chapter
  }
}

export class ClientError{
  public readonly message: string;
  constructor(message: string) {
    this.message = message;
  }
}

export const handleZodError = (error: z.ZodError): ErrorResponse => {
  return {
    code: ErrorCodes.bad_request,
    message: generateErrorMessage(error.issues, {
      maxErrors: 1,
      code: {
        label: "",
        enabled: true,
      },
      message: {
        enabled: true,
        label: "",
      },
      path: {
        enabled: true,
        type: "objectNotation",
        label: "",
      },
    }),
  };
};

export const returnResponse = (error: any): ErrorResponse => {
  if (error instanceof ZodError) {
    return {
      ...handleZodError(error),
    };
  }
  if (error instanceof ApiError) {
    return {
      code: ErrorCodes[error.code],
      message: error.message,
    };
  }
  if (error.code && (error.code = "P2025")) {
    return {
      code: ErrorCodes.not_found,
      message: error.meta.cause,
    };
  }
  return {
    code: ErrorCodes.internal_server_error,
    message: "Something went wrong!! Plese try again later!",
  };
};

export const handleApiError = (error: any) => {
  const err = returnResponse(error);
  return err;
};

export const handleClientError = (error: any) => {
  if(error instanceof AxiosError){
    toast({
      variant: 'destructive',
      description: error.response?.data.error
    })
    if(error.status === 500) console.log(error.response?.data.error);
  }
  else if(error instanceof ZodError){
    toast({
      variant: 'destructive',
      description: handleZodError(error).message
    })
  }else if(error instanceof ClientError){
    toast({
      variant: 'destructive',
      description: error.message
    })
  }else{
    console.log(error);
    toast({
      variant: 'destructive',
      description: "Something went wrong!! Plese try again later!"
    })  
  }
}
