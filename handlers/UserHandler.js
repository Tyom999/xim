const {isEmpty: _isEmpty} = require('lodash');

const {User} = require('../data/models');
const {Jwt, Util} = require('../components');
const {ErrorMessages} = require('../constants');

class UserHandler {
    async info(req, res) {
        return res.status(200).json({userId: req.user.id});
    }

    async logout(req, res) {
        try {

            const accessTokenSalt = Util.generateRandomString(6);
            const refreshTokenSalt = Util.generateRandomString(6);

            await User.update({accessTokenSalt, refreshTokenSalt}, {where: {id: req.user.id}});

            res.sendStatus(200);

        } catch (e) {
            res.sendStatus(400);
        }
    }

    async signup(req, res) {
        const {email, password} = req.body;

        try {
            await User.create({email, password});

            return res.sendStatus(201);
        } catch (e) {
            return res.status(500).json({message: e.message})
        }

    }

    async signin(req, res) {
        const {email, password} = req.body;

        try {
            const user = await User.findOne({where: {email}});

            if (_isEmpty(user) || !(await user.comparePassword(password))) {
                return res.status(404).json({message: ErrorMessages.INVALID_CREDENTIALS});
            }

            const token = await user.generateToken();

            await user.update({refreshToken: token.refresh});

            return res.status(200).json({token});

        } catch (e) {
            return res.status(500).json({message: e.message})
        }

    }

    async newToken(req, res) {
        try {
            const {refreshToken} = req.body;

            if (_isEmpty(refreshToken)) {
                return res.sendStatus(403);
            }

            const user = await User.findOne({where: {refreshToken}});

            if (_isEmpty(user)) {
                return res.status(404).json({message: ErrorMessages.USER_NOT_FOUND});
            }

            const payload = await Jwt.verify(refreshToken);

            if (_isEmpty(payload)) {
                return res.sendStatus(403);
            }

            const accessTokenSalt = Util.generateRandomString(6);
            const refreshTokenSalt = Util.generateRandomString(6);

            const token = await user.generateToken(accessTokenSalt, refreshTokenSalt);

            await user.update({accessTokenSalt, refreshTokenSalt, refreshToken: token.refresh});

            return res.status(200).json({token});

        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }
}

module.exports = new UserHandler();
