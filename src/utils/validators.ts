export const validators = {
  required: (label: string) => ({
    required: `${label} is required`,
  }),

  email: {
    required: 'Email is required',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Enter a valid email address',
    },
  },

  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters',
    },
  },

  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters',
    },
    maxLength: {
      value: 30,
      message: 'Username must be at most 30 characters',
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username may only contain letters, numbers, and underscores',
    },
  },

  postTitle: {
    required: 'Title is required',
    minLength: {
      value: 10,
      message: 'Title must be at least 10 characters',
    },
    maxLength: {
      value: 200,
      message: 'Title must be at most 200 characters',
    },
  },

  postContent: {
    required: 'Content is required',
    minLength: {
      value: 20,
      message: 'Post content must be at least 20 characters',
    },
  },

  commentContent: {
    required: 'Comment cannot be empty',
    minLength: {
      value: 2,
      message: 'Comment must be at least 2 characters',
    },
    maxLength: {
      value: 2000,
      message: 'Comment must be at most 2000 characters',
    },
  },
};
