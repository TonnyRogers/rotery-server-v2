import { HttpException, InternalServerErrorException } from "@nestjs/common";

export const axiosErrorHandler = (error) => {
    if (error instanceof HttpException) {
        throw error;
      }
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new HttpException(
          {
            status: error.response.status,
            message: `Error attempting to request api "${error.config?.baseURL}"`,
            errorDetail: {
              baseUrl: error.config?.baseURL,
              url: error.config?.url,
              method: error.config?.method,
              params: error.config?.params,
              response: error.response.data,
              fromAPI: true,
            },
          },
          error.response.status,
        );
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        throw new InternalServerErrorException(
          `Error attempting to request api "${error.config?.baseURL}", The request was made but no response was received`,
        );
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new InternalServerErrorException(
          `Error attempting to request api "${error.config?.baseURL}", Something happened in setting up the request`,
        );
      }
}