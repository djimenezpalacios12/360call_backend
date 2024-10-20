import { EndpointResponse } from "../interfaces/response.interface";

export const endpointResponse = (
  request_date: Date,
  message: string,
  code: number,
  data: any
): EndpointResponse => {
  return {
    request_date: request_date,
    message: message,
    code: code,
    data: data,
  };
};
