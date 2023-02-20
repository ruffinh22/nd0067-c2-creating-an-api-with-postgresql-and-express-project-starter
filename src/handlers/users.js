import UserStore from '../models/user';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const store = new UserStore();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
const index = async (_req, res) => {
    try {
        const users = await store.index();
        res.json(users);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const create = async (req, res) => {
    const user1 = {
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        hash_password: req.body.password,
    };
    try {
        const newUser = await store.create(user1);
        const token = jwt.sign({ user: newUser }, TOKEN_SECRET);
        res.json(token);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const show = async (req, res) => {
    try {
        const user = await store.show(req.params.id);
        res.json(user);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const destroy = async (req, res) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const authenticate = async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const isUserAuthenticated = await store.authenticate(username, password);
        const result = isUserAuthenticated || 'User does not exist or password is invalid';
        res.json(result);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
export const verifyAuthToken = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers
            .authorization;
        const token = authorizationHeader.split(' ')[1];
        // eslint-disable-next-line
        const decoded = jwt.verify(token, TOKEN_SECRET);
        next();
    }
    catch (err) {
        res.status(401);
        res.json(err);
    }
};
const usersRoutes = (app) => {
    app.post('/users', create);
    app.get('/auth', authenticate);
    app.get('/users', verifyAuthToken, index);
    app.get('/users/:id', verifyAuthToken, show);
    app.delete('/users/:id', verifyAuthToken, destroy);
};
export default usersRoutes;
