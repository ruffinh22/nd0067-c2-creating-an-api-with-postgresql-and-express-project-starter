import OrderStore from '../models/order';
import { verifyAuthToken } from './users';
const store = new OrderStore();
const index = async (_req, res) => {
    try {
        const orders = await store.index();
        res.json(orders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const create = async (req, res) => {
    const order1 = {
        status: req.body.status,
        product_quantity: req.body.productQuantity,
        product_id: req.body.productId,
        user_id: req.body.userId,
    };
    try {
        const newOrder = await store.create(order1);
        res.json(newOrder);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const show = async (req, res) => {
    try {
        const order = await store.show(req.params.id);
        res.json(order);
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
const addProduct = async (req, res) => {
    const quantity = req.body.quantity;
    const orderId = req.body.orderId;
    const productId = req.body.productId;
    try {
        const newProduct = await store.addProduct(quantity, orderId, productId);
        if (newProduct === null) {
            res.json('Order is closed.');
            return;
        }
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const deleteProduct = async (req, res) => {
    const productId = req.body.productId;
    try {
        const deletedProduct = await store.deleteProduct(productId);
        res.json(deletedProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const ordersRoutes = (app) => {
    app.post('/orders', verifyAuthToken, create);
    app.get('/orders', verifyAuthToken, index);
    app.get('/orders/:id', verifyAuthToken, show);
    app.delete('/orders/:id', verifyAuthToken, destroy);
    app.post('/orders/:id/products', verifyAuthToken, addProduct);
    app.delete('/orders/:id/products', verifyAuthToken, deleteProduct);
};
export default ordersRoutes;
