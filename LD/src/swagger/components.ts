export default {
  components: {
    securitySchemes: {
      jwt: {
        type: 'http',
        scheme: 'bearer',
        in: 'header',
        bearerFormat: 'JWT',
        name: 'Bearer',
      },
      api_key: {
        type: 'apiKey',
        name: 'API-KEY',
        in: 'header',
      },
    },
    schemas: {
      id: {
        type: 'string',
        description: 'An id of a todo',
        example: 'tyVgf',
      },
      Todo: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Todo identification number',
            example: 'ytyVgh',
          },
          title: {
            type: 'string',
            description: "Todo's title",
            example: 'Coding in JavaScript',
          },
          completed: {
            type: 'boolean',
            description: 'The status of the todo',
            example: false,
          },
        },
      },
      TodoInput: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: "Todo's title",
            example: 'Coding in JavaScript',
          },
          completed: {
            type: 'boolean',
            description: 'The status of the todo',
            example: false,
          },
        },
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
          },
          internal_code: {
            type: 'string',
          },
        },
      },
    },
  },
};
