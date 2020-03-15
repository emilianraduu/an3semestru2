const API = 'api';
const USERS = 'users';
const ROLES = 'roles';

const router = (query) => {
    const route = query.split('/').filter((e) => e);
    if (!route) {
        return -1
    } else {
        if (route[0] !== API) {
            return -1
        } else {
            if (route[1] === USERS || route[1] === ROLES) {
                return route.filter((e) => e !== API);
            } else {
                return -1
            }
        }
    }
};

module.exports = router;
