import express from 'express';
import { EventController } from './event.controller';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { EventValidation } from './event.validation';

const router = express.Router();

/**
 * @swagger
 * /events:
 *   post:
 *     summary: Create an Event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the event
 *               description:
 *                 type: string
 *                 description: Description of the event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Date and time of the event
 *               location:
 *                 type: string
 *                 description: Location of the event
 *     responses:
 *       201:
 *         description: Event created successfully
 *       400:
 *         description: Bad Request - invalid input
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.post(
  '/',
  auth(), 
  validateRequest(EventValidation.createEventZodSchema),
  EventController.createEventController
);

/**
 * @swagger
 * /events:
 *   get:
 *     summary: Get All Events
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: A list of events
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   location:
 *                     type: string
 */
router.get('/', EventController.getEventsController);

/**
 * @swagger
 * /events/my-events:
 *   get:
 *     summary: Get Events created by the logged-in user
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of events created by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *                   date:
 *                     type: string
 *                     format: date-time
 *                   location:
 *                     type: string
 *       401:
 *         description: Unauthorized - user not logged in
 */
router.get('/my-events', auth(), EventController.getUserEventsController);

/**
 * @swagger
 * /events/{id}:
 *   get:
 *     summary: Get a Single Event
 *     tags: [Events]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 description:
 *                   type: string
 *                 date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *       404:
 *         description: Event not found
 */
router.get('/:id', EventController.getSingleEventController);

/**
 * @swagger
 * /events/{id}:
 *   patch:
 *     summary: Update an Event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the event
 *               description:
 *                 type: string
 *                 description: Updated description of the event
 *               date:
 *                 type: string
 *                 format: date-time
 *                 description: Updated date and time of the event
 *               location:
 *                 type: string
 *                 description: Updated location of the event
 *     responses:
 *       200:
 *         description: Event updated successfully
 *       400:
 *         description: Bad Request - invalid input
 *       401:
 *         description: Unauthorized - user not logged in
 *       404:
 *         description: Event not found
 */
router.patch(
  '/:id',
  auth(), 
  validateRequest(EventValidation.updateEventZodSchema),
  EventController.updateEventController
);

/**
 * @swagger
 * /events/{id}:
 *   delete:
 *     summary: Delete an Event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the event to delete
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Event deleted successfully
 *       401:
 *         description: Unauthorized - user not logged in
 *       404:
 *         description: Event not found
 */
router.delete(
  '/:id',
  auth(), 
  EventController.deleteEventController
);

export const EventRoutes = router;

