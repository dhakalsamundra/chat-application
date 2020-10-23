module.exports ={
    Query: {
      getUsers: () => {
        const users = [
          {
            username: 'Samundra',
            email: 'samundra@email.com'
          },
          {
            username: 'Sandesh',
            email: 'Sandesh@email.com'
          },
        ]
        return users
      },
    },
  };