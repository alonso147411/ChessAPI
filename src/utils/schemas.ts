const errorSchemaValidation = {
  400: {
    type: "object",
    properties: {
      error: { type: "string" },
    },
    required: ["error"],
  },
  404: {
    type: "object",
        properties: {
        error: { type: "string" },
        },
        required: ["error"],
    },
    500: {
        type: "object",
        properties: {
            error: { type: "string" },
        },
        required: ["error"],
    },
};

export const top10schema = {
  schema: {
    response: {
      200: {
        type: "object",
        additionalProperties: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              username: { type: "string" },
              perfs: { type: "object", additionalProperties: true },
            },
            required: ["id", "username", "perfs"],
          },
        },
      },
      errorSchemaValidation,
    },
  },
};

export const enrichedUserSchema = {
  schema: {
    response: {
      200: {
        type: "object",
        properties: {
          id: { type: "string" },
          username: { type: "string" },
          profile: { type: "object", additionalProperties: true },
          playTime: { type: "object", additionalProperties: true },
          rank: { type: "number" },
          resultStreak: { type: "object", additionalProperties: true },
        },
      },
      errorSchemaValidation,
    },
  },
};

export const topPlayerHistorySchema = {
  schema: {
    response: {
      200: {
        type: "object",

        properties: {
          username: { type: "string" },
          history: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                rating: { type: "number" },
              },
            },
          },
        },
      },
      errorSchemaValidation,
    },
  },
};

export const userByIdSchema = {
  schema: {
    response: {
      200: {
        type: "array",
        items: {
          type: "object",
          required: ["id", "username", "modes"],
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            modes: { type: "object", additionalProperties: true },
            flair: { type: "string" },
            patron: { type: "boolean" },
            verified: { type: "boolean" },
            createdAt: { type: "number" },
            profile: { type: "object", additionalProperties: true },
            seenAt: { type: "number" },
            playTime: { type: "object", additionalProperties: true },
          },
        },
      },
      errorSchemaValidation,
    },
  },
};
