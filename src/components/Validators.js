const Validator = {
    title: {
      rules: [
        {
          test: (value) => {
            return value.length > 2;
          },
          message: 'Title must be longer than two characters',
        },
      ],
      errors: [],
      valid: false,
      state: '',
    },
    ingredients: {
      rules: [
        {
            test: (value) => {
              return value.length > 2;
            },
            message: 'ingredients must be longer than two characters',
        },
      ],
      errors: [],
      valid: false,
      state: ''
    },
  };

  export default Validator;