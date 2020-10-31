const bcrypt = require('bcryptjs')
const { UserInputError, AuthenticationError } = require('apollo-server') 
const jwt = require('jsonwebtoken')
const { Op} = require('sequelize')

const { User, Message } = require('../../models')

module.exports ={
    Query: {
      getUsers: async(_, __, { user }) => {
        try {
          if(!user) throw new AuthenticationError('Unauthenticated')
        
        // Op.ne = operator not equal to will get all the user expect the token user
          let users = await User.findAll({
            attributes: ['username', 'imageUrl', 'createdAt'],
            where: { username: { [Op.ne]: user.username}}
          })
          const allUserMessages = await Message.findAll({
            where: {
              [Op.or]: [{ from: user.username}, { to: user.username}]
            },
            order: [['createdAt', 'DESC']]
          })

          users = users.map(restUser => {
            const latestMessage = allUserMessages.find(m=> m.from === restUser.username || m.to === restUser.username)
            restUser.latestMessage = latestMessage
            return restUser
          })
          return users
        } catch(error){
          console.log(error)
          throw error
        }
      },
      login: async(_, args)=> {
        const { username, password } = args
        let errors = {}
        try {
          if(username.trim() === '') errors.username = 'Username must not be empty'
          if(password === '') errors.password = 'Password must not be empty'
          if(Object.keys(errors).length > 0) {
            throw new UserInputError('Bad Input', { errors })
          }

          const user = await User.findOne({
            where: { username }
          })
          if(!user){
            errors.username = 'User not found'
            throw new UserInputError('user not found', { errors })
          }

          const validataPassword = await bcrypt.compare(password, user.password)
          if(!validataPassword){
            errors.password = 'password is incorrect'
            throw new UserInputError('password is incorrect',{ errors } )
          }

          const token = jwt.sign({username}, process.env.JWT_SECRET, { expiresIn: '1h'})
          return {
            ...user.toJSON(),
            token
          }
        } catch (error) {
          console.log(error)
          throw error
        }
      }
    },
    Mutation: {
      register: async(_, args)=> {
        const { username, email, password, confirmPassword } = args
        let errors = {}
        try{
          //validate input data
         if(email.trim() === '') errors.email = 'Email is mandotary'
         if(username.trim() === '') errors.username = 'Username is mandotary'
         if(password.trim() === '') errors.password = 'Password is mandotary'
         if(confirmPassword.trim() === '') errors.confirmPassword = 'ConfirmPassword is mandotary'
        
         //validate matching password
         if(password !== confirmPassword) errors.password='Passwords is not matching'
         
         //check if username/email already taken or not
        //  const inputUser = await User.findOne({ where: { username}})
        //  const inputEmail = await User.findOne({ where: { email}})

        //  if(inputUser) errors.username = 'Username already taken so use different one.'
        //  if(inputEmail) errors.email = 'email already taken so use different one.'

         if(Object.keys(errors).length > 0){
           throw errors
         }

         //hashed the password
         const hashedPassword = await bcrypt.hash(password, 10)
          const user = await User.create({
            username, email, password: hashedPassword
          })
          return user
        } catch(error){
          console.log(error)
          if(error.name === 'SequelizeUniqueConstraintError'){
            error.errors.forEach(e => (errors[e.path.split('.')[1]]= `${e.path.split('.')[1]} is alredy taken`))
          } else if(error.name === 'SequelizeValidationError'){
            error.errors.forEach(e => (errors[e.path] = e.message))
          }
          throw new UserInputError('Bad Input',{ errors })
        }
      },
    }
  };