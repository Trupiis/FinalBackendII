import express from 'express';
import { getTickets, getTicketById, getTicketByCode, createTicket } from '../controller/ticket.controller.js';
import passport from 'passport';
import authorize from '../middlewares/authorization.js';
import { isAuth } from '../middlewares/auth.js';

const router = express.Router();

const JWTauth = isAuth;


/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Crea un nuevo ticket de compra
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: Monto total de la compra
 *               purchaser:
 *                 type: string
 *                 description: Email del comprador
 *     responses:
 *       201:
 *         description: Ticket creado exitosamente
 *       400:
 *         description: Error en la creación del ticket
 */
router.post('/', JWTauth, createTicket);

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Obtiene todos los tickets (solo admins)
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tickets obtenida correctamente
 *       403:
 *         description: Acceso denegado
 */
router.get('/', JWTauth, authorize('admin'), getTickets); 

/**
 * @swagger
 * /api/tickets/{tid}:
 *   get:
 *     summary: Obtiene un ticket por su ID
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tid
 *         required: true
 *         description: ID del ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/:tid', JWTauth, getTicketById); 

/**
 * @swagger
 * /api/tickets/by-code/{code}:
 *   get:
 *     summary: Obtiene un ticket por su código único
 *     tags: [Tickets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         description: Código único del ticket
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket encontrado
 *       404:
 *         description: Ticket no encontrado
 */
router.get('/by-code/:code', JWTauth, getTicketByCode); 

export default router;
