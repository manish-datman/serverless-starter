'use strict';

const db = require('./models');

const clean = obj => {
  for (var propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
  return { ...obj }
}


module.exports.getAllUsers = async event => {

  const users = await db.User.findAll({ raw: true });

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Get All users!',
        users
      },
      null,
      2
    )
  };
};


module.exports.createUser = async event => {

  const body = JSON.parse(event.body)
  console.log(body)

  const user = await db.User.build(body, { returning: true, raw: true }).save();

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'Go Serverless v1.0! Create a new user',
        new_user: user
      },
      null,
      2
    ),
  };

}


module.exports.updateUser = async event => {

  const defaultResponse = {
    statusCode: 200,
  }


  const body = JSON.parse(event.body);

  const { id } = body;

  if (!id) return {
    statusCode: 400,
    message: 'No ID found, please provide a ID to update'
  }

  const cleanedBody = clean({ ...body, id: null })

  const [didUpdate] = await db.User.update(cleanedBody, {
    where: {
      id
    }
  });

  if (didUpdate) {

    defaultResponse.body = JSON.stringify(
      {
        message: `Go Serverless v1.0! User with ID ${id} updated successfully`
      },
      null,
      2)
  } else {
    defaultResponse.statusCode = 400;
    defaultResponse.body = JSON.stringify(
      {
        message: `User with ID ${id} not found, Please provide a valid ID `
      }, null, 2)
  }

  return defaultResponse;

}



