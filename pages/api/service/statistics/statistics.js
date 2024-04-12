import API from "../api";
import FormData from "form-data";
import axios from "axios";
import api from "../api";
import { getCookie } from "cookies-next";
let domen = false;

let STATS = {};

function firstDayOfMonthByDate(date = new Date()) {
    // date = new Date(date.setMonth(date.getMonth()-1))
    date = new Date(date.setDate('1'))
    date = new Date(date.setHours(0, 0, 0))
    return date;
}

export default STATS = {
    registered: async function getRegisteredStats() {
        const getUserCountFields = {
            table: 'users',
        };
        const count = await API.get.rowsCount(getUserCountFields);

        if (count) {
            return count;
        }
    },
    registeredByDate: async function getRegisteredByDateStats(dateFrom, dateTo = new Date()) {

        const getUserCountFields = {
            table: 'users',
        }

        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        getUserCountFields.filter = {
            date_registered: { from: dateFrom, to: dateTo }
        }

        const count = await API.get.rowsCount(getUserCountFields);

        if (count) {
            return count;
        }
    },
    blocked: async function getBlockedStats() {
        const getUserBlockedFields = {
            table: 'users',
            filter: {
                date_banned_to: { from: new Date() }
            }
        }
        const count = await API.get.rowsCount(getUserBlockedFields);

        if (count) {
            return count;
        }
    },
    blockedByDate: async function getBlockedByDateStats(dateFrom, dateTo) {

        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const getUserBlockedFields = {
            table: 'users',
            filter: {
                date_banned_to: { from: dateFrom }
            }
        }

        if (dateTo) {
            getUserBlockedFields.filter.date_banned_to.to = dateTo
        }

        const count = await API.get.rowsCount(getUserBlockedFields);

        if (count) {
            return count;
        }
    },
    productsAdded: async function getProductAddedStats(dateFrom, dateTo) {

        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const productsAddedFields = {
            table: 'product',
            filter: {
                date_created: { from: dateFrom, to: dateTo }
            }
        }

        const count = await API.get.rowsCount(productsAddedFields);
        if (count) {
            return count;
        }

    },
    activeUsers: async function getActveUsersStats(dateFrom, dateTo) {

        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const productsAddedFields = {
            table: 'users',
            filter: {
                last_login_date: { from: dateFrom, to: dateTo }
            }
        }

        const count = await API.get.rowsCount(productsAddedFields);
        if (count) {
            return count;
        }
    },
    usersAddedProds: async function getUsersAddedProdsStats(dateFrom, dateTo) {

        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const countData = await api.get.data({
            table: {join: ['users', 'product']},
            filter: {
                "product.user_id": "users.id",
                "product.date_created": { from: dateFrom, to: dateTo }
            },
            limit: 'all',
            select: [
                "COUNT(DISTINCT users.id)"
            ]
        })
        return countData[0]
    },
    usersSubscribed: async function getUsersSubscribedStats(dateFrom, dateTo) {
        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const productsAddedFields = {
            table: 'users',
            filter: {
                date_paid: { from: dateFrom, to: dateTo }
            }
        }

        const count = await API.get.rowsCount(productsAddedFields);
        if (count) {
            return count;
        }
    },
    paidProds: async function getPaidProdsStats(dateFrom, dateTo) {
        if (!dateFrom) {
            dateFrom = new Date()
            dateFrom = firstDayOfMonthByDate(dateFrom);
        }

        const productsAddedFields = {
            table: 'product',
            filter: {
                date_paid: { from: dateFrom, to: dateTo }
            }
        }

        const count = await API.get.rowsCount(productsAddedFields);
        if (count) {
            return count;
        }
    },

}