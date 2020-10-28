const { UserInputError, AuthenticationError } = require('apollo-server') 
const { Op } = require('sequelize')
const { User, Message } = require('../../models')

module.exports ={
    Query: {
        getMessages: async (parent, { from }, { user }) => {
            try {
                if(!user) throw new AuthenticationError('Unauthenticated')
                const restUser = await User.findOne({
                    where: { username: from}
                })
                if(!restUser) throw new UserInputError('User not found')

                const userNames = [user.username, restUser.username]
                // finding all message between sender and receiver
                const messages = await Message.findAll({
                    where: {
                        from: { [Op.in]: userNames },
                        to: { [Op.in]: userNames },
                    },
                    order: [[ 'createdAt', 'DESC' ]]
                })
                return messages

            } catch (error) {
                console.log(error)
                throw error
            }
        }
    },
    Mutation: {
      sendMessage: async (parent, { to, content }, { user }) => {
        try {
          if(!user) throw new AuthenticationError('Unauthenticated')

          const recipient = await User.findOne({
            where: { username: to}})
          if(!recipient){
            throw new UserInputError('User not found')
          } else if (recipient.username === user.username) {
            throw new UserInputError('You cant message yourself')
          }
          if(content.trim() === ''){
            throw new UserInputError('Message is empty')
          }
          //Sending mesage
          const message = await Message.create({
            from: user.username,
            to,
            content,
          })

          return message
        } catch (error) {
          console.log(error)
          throw error
        }
      }
    }
  };