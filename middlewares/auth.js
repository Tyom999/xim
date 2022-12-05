const {isEmpty: _isEmpty} = require('lodash');

const {User} = require('../data/models');
const {Jwt} = require('../components');

module.exports = async (req, res, next) => {

    try {
        const token = req.headers['authorization'].split(' ')[1];
        const { id, salt } =    await Jwt.verify(token);

        if(_isEmpty(id)) {
          return res.sendStatus(401);
        }

        const user = await User.findOne({where: { id }, raw: true});

        if (_isEmpty(user) || salt !== user.accessTokenSalt) {
          return res.sendStatus(401);
        } else {
            req.user = user;
            next();
        }
    } catch (e) {
        return res.sendStatus(401);
    }
};